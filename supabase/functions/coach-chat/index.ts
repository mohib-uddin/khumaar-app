import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const COACH_SYSTEM = `You are Khumaar Specialist — a calm cosmetic skin coach (NOT a doctor).
Rules:
- Cosmetic wellness coaching only. Never diagnose, prescribe drugs, or claim medical certainty.
- Be concise (2–4 short paragraphs or bullets) but always finish every sentence and list completely — never cut off mid-thought.
- Use the user's latest scan summary when relevant.
- If symptoms sound medical (infection, severe pain, sudden swelling), gently suggest seeing a clinician.
- Do not ask for or discuss photos in chat.`;

type HistoryTurn = {
  role: 'user' | 'assistant';
  content: string;
};

type AnalysisRow = {
  overall_score: number;
  top_focus: string;
  headline: string;
  metrics: Array<{ label?: string; value?: string }> | null;
  routine_plan: {
    morning?: { title?: string };
    night?: { title?: string };
    focus_points?: Array<{ label?: string; status?: string }>;
  } | null;
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

function resolveGeminiApiKey(): string | undefined {
  return Deno.env.get('GEMINI_API_KEY') ?? Deno.env.get('GOOGLE_GENERATIVE_AI_API_KEY');
}

function resolveGeminiModel(): string {
  const raw = Deno.env.get('GEMINI_MODEL') ?? Deno.env.get('ANALYSIS_MODEL') ?? 'gemini-2.5-flash';
  return raw.includes('/') ? raw.split('/').pop()! : raw;
}

function compactAnalysisSummary(analysis: AnalysisRow | null): string {
  if (!analysis) return 'No scan analysis on file yet.';
  const plan = analysis.routine_plan;
  const focus =
    plan?.focus_points?.map((p) => `${p.label} (${p.status})`).join(', ') ?? analysis.top_focus;
  const metrics = (analysis.metrics ?? [])
    .slice(0, 5)
    .map((m) => `${m.label ?? 'Metric'}: ${m.value ?? ''}`)
    .join('; ');
  return [
    `Score: ${analysis.overall_score}/100`,
    `Focus: ${analysis.top_focus}`,
    `Headline: ${analysis.headline}`,
    metrics ? `Metrics: ${metrics}` : null,
    plan ? `Morning: ${plan.morning?.title ?? 'Morning'}; Night: ${plan.night?.title ?? 'Night'}` : null,
    focus ? `Target points: ${focus}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

/** Gemini requires alternating user/model turns starting with user. */
function buildGeminiContents(
  system: string,
  history: HistoryTurn[],
  message: string,
): Array<{ role: string; parts: Array<{ text: string }> }> {
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  for (const turn of history.slice(-8)) {
    const role = turn.role === 'assistant' ? 'model' : 'user';
    const text = turn.content.slice(0, 2000);
    if (!text) continue;
    const last = contents[contents.length - 1];
    if (last?.role === role) {
      last.parts[0].text += `\n${text}`;
    } else {
      contents.push({ role, parts: [{ text }] });
    }
  }

  // Must start with user
  if (contents.length && contents[0].role !== 'user') {
    contents.unshift({ role: 'user', parts: [{ text: '(continuing skin coaching)' }] });
  }

  const userText = `${system}\n\nUser message:\n${message.slice(0, 2000)}`;
  const last = contents[contents.length - 1];
  if (!last || last.role === 'model') {
    contents.push({ role: 'user', parts: [{ text: userText }] });
  } else {
    // Merge into last user turn so we don't send two users in a row
    last.parts[0].text = `${last.parts[0].text}\n\n${userText}`;
  }

  return contents;
}

async function callGemini(params: {
  apiKey: string;
  model: string;
  system: string;
  history: HistoryTurn[];
  message: string;
}): Promise<{ text: string | null; error?: string }> {
  const contents = buildGeminiContents(params.system, params.history, params.message);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent?key=${params.apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.5,
          // Gemini 2.5 uses thinking tokens from this budget; 400 was truncating replies.
          maxOutputTokens: 2048,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      }),
    },
  );

  const raw = await response.text();
  if (!response.ok) {
    console.error('Gemini coach error', response.status, raw.slice(0, 500));
    return { text: null, error: `Gemini ${response.status}: ${raw.slice(0, 240)}` };
  }

  let body: {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  try {
    body = JSON.parse(raw);
  } catch {
    return { text: null, error: 'Invalid Gemini JSON' };
  }

  const text = body?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? '')
    .join('')
    ?.trim();
  if (!text) {
    console.error('Gemini coach empty candidates', raw.slice(0, 500));
    return { text: null, error: 'Empty Gemini response' };
  }
  return { text };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    const geminiKey = resolveGeminiApiKey();
    if (!geminiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const admin = createClient(supabaseUrl, serviceKey);

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!message) {
      return new Response(JSON.stringify({ error: 'message required' }), {
        status: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    const history: HistoryTurn[] = Array.isArray(body?.history)
      ? body.history
          .filter(
            (t: HistoryTurn) =>
              t &&
              (t.role === 'user' || t.role === 'assistant') &&
              typeof t.content === 'string' &&
              t.content.trim(),
          )
          .map((t: HistoryTurn) => ({
            role: t.role,
            content: String(t.content).slice(0, 2000),
          }))
      : [];

    const uuidRe =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const incomingThread =
      typeof body?.thread_id === 'string' ? body.thread_id.trim() : '';
    const threadId = uuidRe.test(incomingThread)
      ? incomingThread
      : crypto.randomUUID();

    const { data: analysis } = await admin
      .from('scan_analyses')
      .select('overall_score, top_focus, headline, metrics, routine_plan')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const system = `${COACH_SYSTEM}\n\nLatest scan summary:\n${compactAnalysisSummary(analysis as AnalysisRow | null)}`;
    const gemini = await callGemini({
      apiKey: geminiKey,
      model: resolveGeminiModel(),
      system,
      history,
      message,
    });

    if (!gemini.text) {
      return new Response(
        JSON.stringify({ error: 'Coach unavailable', detail: gemini.error ?? null }),
        {
          status: 502,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        },
      );
    }

    const reply = gemini.text;

    // Best-effort persistence — don't fail the chat if insert breaks
    try {
      await admin.from('coach_messages').insert([
        {
          user_id: user.id,
          thread_id: threadId,
          role: 'user',
          content: message.slice(0, 2000),
        },
        {
          user_id: user.id,
          thread_id: threadId,
          role: 'assistant',
          content: reply.slice(0, 4000),
        },
      ]);

      const { data: rows } = await admin
        .from('coach_messages')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(40, 200);
      if (rows?.length) {
        await admin.from('coach_messages').delete().in(
          'id',
          rows.map((r) => r.id),
        );
      }
    } catch (persistError) {
      console.error('coach_messages persist failed', persistError);
    }

    return new Response(JSON.stringify({ reply, thread_id: threadId }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      },
    );
  }
});
