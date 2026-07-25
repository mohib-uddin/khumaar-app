import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const DISCLAIMER =
  'Cosmetic skin coaching estimate — not a medical diagnosis. Consult a clinician for medical concerns.';

type Metric = {
  id: string;
  label: string;
  value: string;
  position: number;
  tone: 'good' | 'average' | 'improve';
};

type AnalysisPayload = {
  overall_score: number;
  top_focus: string;
  headline: string;
  metrics: Metric[];
  ritual_id: string;
  disclaimer: string;
};

const METRIC_LABELS: Record<string, string> = {
  clarity: 'Clarity',
  hydration: 'Hydration',
  texture: 'Texture',
  redness: 'Redness',
  pigmentation: 'Even tone',
  'dark-circles': 'Under-eye',
  pores: 'Pores',
  oil: 'Oil balance',
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

function heuristicAnalysis(concerns: string[], skinFeel: string | null): AnalysisPayload {
  const focus =
    concerns[0] ??
    (skinFeel === 'dry'
      ? 'hydration'
      : skinFeel === 'oily'
        ? 'oiliness'
        : skinFeel === 'sensitive'
          ? 'redness'
          : 'hydration');

  const focusLabel = focus.replace(/-/g, ' ');

  const baseMetrics: Metric[] = [
    { id: 'clarity', label: 'Clarity', value: 'Good', position: 0.72, tone: 'good' },
    { id: 'hydration', label: 'Hydration', value: 'Low', position: 0.38, tone: 'improve' },
    { id: 'texture', label: 'Texture', value: 'Even', position: 0.64, tone: 'average' },
    { id: 'redness', label: 'Redness', value: 'Mild', position: 0.55, tone: 'average' },
  ];

  const ritual_id =
    focus === 'acne' || focus === 'oiliness' || skinFeel === 'oily'
      ? 'morning'
      : focus === 'under-eye' || skinFeel === 'dry'
        ? 'night'
        : 'morning';

  return {
    overall_score: 78,
    top_focus: focusLabel,
    headline: `We'll coach ${focusLabel} first — a short daily ritual beats a long report.`,
    metrics: baseMetrics.map((m) =>
      m.id === 'hydration' && focus === 'hydration'
        ? { ...m, tone: 'improve' as const, position: 0.34, value: 'Focus' }
        : m,
    ),
    ritual_id,
    disclaimer: DISCLAIMER,
  };
}

async function analyzeWithClaude(params: {
  apiKey: string;
  concerns: string[];
  skinFeel: string | null;
  imageUrls: string[];
}): Promise<AnalysisPayload | null> {
  const system = `You are Khumaar, a cosmetic skin coaching assistant (NOT a doctor).
Return ONLY valid JSON with this shape:
{
  "overall_score": number 0-100,
  "top_focus": string (one short focus label),
  "headline": string (one supportive sentence),
  "metrics": [{"id":"clarity"|"hydration"|"texture"|"redness"|"pigmentation"|"dark-circles"|"pores"|"oil","label":string,"value":string,"position":number 0-1,"tone":"good"|"average"|"improve"}],
  "ritual_id": "morning" | "night" | "facial-fitness",
  "disclaimer": string
}
Rules:
- Cosmetic wellness coaching only. Never diagnose, prescribe, or claim medical certainty.
- Pick exactly ONE top_focus aligned with user concerns when possible.
- Include 3-5 metrics.
- Keep tone calm and actionable.`;

  const content: unknown[] = [
    {
      type: 'text',
      text: `User concerns: ${params.concerns.join(', ') || 'none'}. Skin feel: ${params.skinFeel ?? 'unknown'}. Analyze the face photos for cosmetic coaching only.`,
    },
  ];

  for (const url of params.imageUrls.slice(0, 3)) {
    content.push({
      type: 'image',
      source: { type: 'url', url },
    });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': params.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system,
      messages: [{ role: 'user', content }],
    }),
  });

  if (!response.ok) {
    console.error('Claude error', await response.text());
    return null;
  }

  const body = await response.json();
  const text = body?.content?.find((c: { type: string }) => c.type === 'text')?.text;
  if (!text) return null;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  const parsed = JSON.parse(jsonMatch[0]) as AnalysisPayload;
  parsed.disclaimer = parsed.disclaimer || DISCLAIMER;
  parsed.metrics = (parsed.metrics || []).map((m) => ({
    ...m,
    label: m.label || METRIC_LABELS[m.id] || m.id,
  }));
  return parsed;
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

    const { batch_id } = await req.json();
    if (!batch_id) {
      return new Response(JSON.stringify({ error: 'batch_id required' }), {
        status: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('concerns, skin_feel')
      .eq('id', user.id)
      .single();

    const { data: scans, error: scansError } = await admin
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .eq('batch_id', batch_id);

    if (scansError || !scans?.length) {
      return new Response(JSON.stringify({ error: 'No scans found for batch' }), {
        status: 404,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    await admin.from('scans').update({ status: 'analyzing' }).eq('batch_id', batch_id);

    const signedUrls: string[] = [];
    for (const scan of scans) {
      const { data: signed } = await admin.storage
        .from('scan-photos')
        .createSignedUrl(scan.storage_path, 120);
      if (signed?.signedUrl) signedUrls.push(signed.signedUrl);
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    let payload: AnalysisPayload | null = null;

    if (anthropicKey && signedUrls.length > 0) {
      payload = await analyzeWithClaude({
        apiKey: anthropicKey,
        concerns: profile?.concerns ?? [],
        skinFeel: profile?.skin_feel ?? null,
        imageUrls: signedUrls,
      });
    }

    if (!payload) {
      payload = heuristicAnalysis(profile?.concerns ?? [], profile?.skin_feel ?? null);
    }

    const { data: analysis, error: insertError } = await admin
      .from('scan_analyses')
      .upsert(
        {
          user_id: user.id,
          batch_id,
          overall_score: Math.round(payload.overall_score),
          top_focus: payload.top_focus,
          headline: payload.headline,
          metrics: payload.metrics,
          ritual_id: payload.ritual_id,
          disclaimer: payload.disclaimer,
          raw: payload,
        },
        { onConflict: 'batch_id' },
      )
      .select('*')
      .single();

    if (insertError) {
      throw insertError;
    }

    await admin.from('scans').update({ status: 'ready' }).eq('batch_id', batch_id);
    await admin
      .from('profiles')
      .update({
        onboarding_step: 'results',
        starter_ritual_id: payload.ritual_id,
      })
      .eq('id', user.id);

    return new Response(JSON.stringify({ analysis }), {
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
