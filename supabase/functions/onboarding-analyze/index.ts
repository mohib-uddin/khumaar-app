import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { encodeBase64 } from 'jsr:@std/encoding@1/base64';

const DISCLAIMER =
  'Cosmetic skin coaching estimate — not a medical diagnosis. Consult a clinician for medical concerns.';

const COACHING_SYSTEM = `You are Khumaar, a cosmetic skin coaching assistant (NOT a doctor).
Return ONLY valid JSON with this shape:
{
  "overall_score": number 0-100,
  "top_focus": string (one short focus label),
  "headline": string (one supportive sentence),
  "metrics": [{"id":"clarity"|"hydration"|"texture"|"redness"|"pigmentation"|"dark-circles"|"pores"|"oil","label":string,"value":string,"position":number 0-1,"tone":"good"|"average"|"improve"}],
  "ritual_id": "morning" | "night" | "facial-fitness",
  "disclaimer": string,
  "routine_plan": {
    "morning": {
      "title": string,
      "subtitle": string,
      "steps": [{"id":string,"title":string,"description":string,"kind":"skincare"|"exercise"}]
    },
    "night": { "title": string, "subtitle": string, "steps": [...] },
    "focus_points": [
      {"key":string,"label":string,"status":"done"|"active"|"pending"}
    ],
    "weekly_tip": string
  }
}
Rules:
- Cosmetic wellness coaching only. Never diagnose, prescribe, or claim medical certainty.
- Pick exactly ONE top_focus aligned with user concerns when possible.
- Include 3-5 metrics.
- routine_plan.focus_points must be exactly 3 items (one active, others done/pending).
- morning and night each need 3-4 skincare steps with stable snake_case ids.
- Keep tone calm and actionable.`;

type Metric = {
  id: string;
  label: string;
  value: string;
  position: number;
  tone: 'good' | 'average' | 'improve';
};

type RoutinePlanStep = {
  id: string;
  title: string;
  description: string;
  kind: 'skincare' | 'exercise';
};

type RoutinePlanBlock = {
  title: string;
  subtitle: string;
  steps: RoutinePlanStep[];
};

type FocusPoint = {
  key: string;
  label: string;
  status: 'done' | 'active' | 'pending';
};

type RoutinePlan = {
  morning: RoutinePlanBlock;
  night: RoutinePlanBlock;
  focus_points: FocusPoint[];
  weekly_tip: string;
};

type AnalysisPayload = {
  overall_score: number;
  top_focus: string;
  headline: string;
  metrics: Metric[];
  ritual_id: string;
  disclaimer: string;
  routine_plan: RoutinePlan;
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

function coachingUserText(concerns: string[], skinFeel: string | null): string {
  return `User concerns: ${concerns.join(', ') || 'none'}. Skin feel: ${skinFeel ?? 'unknown'}. Analyze the face photos for cosmetic coaching only.`;
}

function defaultRoutinePlan(focusLabel: string, ritualId: string): RoutinePlan {
  const activeKey = focusLabel.toLowerCase().replace(/\s+/g, '-').slice(0, 32) || 'hydration';
  return {
    morning: {
      title: 'Morning Routine',
      subtitle: '3 Steps · Everyday',
      steps: [
        {
          id: 'cleanser',
          title: 'Gentle Cleanser',
          description: 'Remove overnight oil without stripping moisture.',
          kind: 'skincare',
        },
        {
          id: 'serum',
          title: 'Target Serum',
          description: `A light serum focused on ${focusLabel}.`,
          kind: 'skincare',
        },
        {
          id: 'moisturizer-spf',
          title: 'Moisturizer + SPF',
          description: 'Hydrate, then protect with broad-spectrum sunscreen.',
          kind: 'skincare',
        },
      ],
    },
    night: {
      title: 'Night Routine',
      subtitle: '3 Steps · Everyday',
      steps: [
        {
          id: 'cleanser',
          title: 'Cleanser',
          description: 'Wash away sunscreen, sweat, and daily buildup.',
          kind: 'skincare',
        },
        {
          id: 'treatment',
          title: 'Night Treatment',
          description: `Treat ${focusLabel} while skin recovers overnight.`,
          kind: 'skincare',
        },
        {
          id: 'moisturizer',
          title: 'Night Moisturizer',
          description: 'Seal in hydration with a nourishing cream.',
          kind: 'skincare',
        },
      ],
    },
    focus_points: [
      { key: 'barrier', label: 'Barrier care', status: 'done' },
      { key: activeKey, label: focusLabel, status: 'active' },
      { key: 'consistency', label: 'Consistency', status: 'pending' },
    ],
    weekly_tip:
      ritualId === 'night'
        ? 'Keep evenings calm — shorter steps beat skipping entirely.'
        : 'Protect mornings with SPF even on cloudy days.',
  };
}

function normalizeFocusPoints(points: FocusPoint[] | undefined, fallback: FocusPoint[]): FocusPoint[] {
  const cleaned = (points ?? [])
    .filter((p) => p?.key && p?.label)
    .slice(0, 3)
    .map((p) => ({
      key: String(p.key),
      label: String(p.label),
      status: (['done', 'active', 'pending'].includes(p.status) ? p.status : 'pending') as FocusPoint['status'],
    }));
  if (cleaned.length === 3) {
    if (!cleaned.some((p) => p.status === 'active')) cleaned[1].status = 'active';
    return cleaned;
  }
  return fallback;
}

function normalizeRoutineBlock(
  block: Partial<RoutinePlanBlock> | undefined,
  fallback: RoutinePlanBlock,
): RoutinePlanBlock {
  const steps = (block?.steps ?? [])
    .filter((s) => s?.id && s?.title)
    .map((s) => ({
      id: String(s.id),
      title: String(s.title),
      description: String(s.description ?? ''),
      kind: s.kind === 'exercise' ? ('exercise' as const) : ('skincare' as const),
    }));
  if (steps.length < 2) return fallback;
  return {
    title: String(block?.title || fallback.title),
    subtitle: String(block?.subtitle || fallback.subtitle),
    steps,
  };
}

function normalizePayload(parsed: Partial<AnalysisPayload>, concerns: string[], skinFeel: string | null): AnalysisPayload {
  const heuristic = heuristicAnalysis(concerns, skinFeel);
  const top_focus = String(parsed.top_focus || heuristic.top_focus);
  const ritual_id = ['morning', 'night', 'facial-fitness'].includes(String(parsed.ritual_id))
    ? String(parsed.ritual_id)
    : heuristic.ritual_id;
  const basePlan = parsed.routine_plan
    ? {
        morning: normalizeRoutineBlock(parsed.routine_plan.morning, heuristic.routine_plan.morning),
        night: normalizeRoutineBlock(parsed.routine_plan.night, heuristic.routine_plan.night),
        focus_points: normalizeFocusPoints(
          parsed.routine_plan.focus_points,
          heuristic.routine_plan.focus_points,
        ),
        weekly_tip: String(parsed.routine_plan.weekly_tip || heuristic.routine_plan.weekly_tip),
      }
    : defaultRoutinePlan(top_focus, ritual_id);

  return {
    overall_score: Math.min(100, Math.max(0, Number(parsed.overall_score ?? heuristic.overall_score))),
    top_focus,
    headline: String(parsed.headline || heuristic.headline),
    metrics: ((parsed.metrics?.length ? parsed.metrics : heuristic.metrics) as Metric[]).map((m) => ({
      ...m,
      label: m.label || METRIC_LABELS[m.id] || m.id,
      position: Math.min(1, Math.max(0, Number(m.position) || 0.5)),
      tone: (['good', 'average', 'improve'].includes(m.tone) ? m.tone : 'average') as Metric['tone'],
    })),
    ritual_id,
    disclaimer: String(parsed.disclaimer || DISCLAIMER),
    routine_plan: basePlan,
  };
}

function parseAnalysisJson(
  text: string,
  concerns: string[],
  skinFeel: string | null,
): AnalysisPayload | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return normalizePayload(JSON.parse(jsonMatch[0]) as Partial<AnalysisPayload>, concerns, skinFeel);
  } catch {
    return null;
  }
}

function mimeFromUrlOrHeader(url: string, contentType: string | null): string {
  const header = contentType?.split(';')[0]?.trim().toLowerCase();
  if (header?.startsWith('image/')) return header;
  const lower = url.toLowerCase();
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.gif')) return 'image/gif';
  return 'image/jpeg';
}

async function fetchImageAsBase64(
  url: string,
): Promise<{ mimeType: string; data: string } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Image fetch failed', res.status, url.slice(0, 80));
      return null;
    }
    const mimeType = url.includes('/scan-photos/') || url.includes('.jpg')
      ? 'image/jpeg'
      : mimeFromUrlOrHeader(url, res.headers.get('content-type'));
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.byteLength === 0) {
      console.error('Image fetch empty body', url.slice(0, 80));
      return null;
    }
    return { mimeType, data: encodeBase64(bytes) };
  } catch (error) {
    console.error('Image fetch error', error);
    return null;
  }
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
    routine_plan: defaultRoutinePlan(focusLabel, ritual_id),
  };
}

async function analyzeWithGemini(params: {
  apiKey: string;
  model: string;
  concerns: string[];
  skinFeel: string | null;
  imageUrls: string[];
}): Promise<AnalysisPayload | null> {
  const parts: unknown[] = [
    { text: `${COACHING_SYSTEM}\n\n${coachingUserText(params.concerns, params.skinFeel)}` },
  ];

  for (const url of params.imageUrls.slice(0, 3)) {
    const image = await fetchImageAsBase64(url);
    if (!image) continue;
    parts.push({
      inline_data: {
        mime_type: image.mimeType,
        data: image.data,
      },
    });
  }

  if (parts.length < 2 && params.imageUrls.length > 0) {
    console.error('Gemini: no images could be fetched');
    return null;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent?key=${params.apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2000,
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  if (!response.ok) {
    console.error('Gemini error', await response.text());
    return null;
  }

  const body = await response.json();
  const text = body?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? '')
    .join('')
    ?.trim();
  if (!text) return null;
  return parseAnalysisJson(text, params.concerns, params.skinFeel);
}

function resolveGeminiApiKey(): string | undefined {
  return Deno.env.get('GEMINI_API_KEY') ?? Deno.env.get('GOOGLE_GENERATIVE_AI_API_KEY');
}

function resolveGeminiModel(): string {
  const raw = Deno.env.get('GEMINI_MODEL') ?? Deno.env.get('ANALYSIS_MODEL') ?? 'gemini-2.5-flash';
  // Allow gateway-style ids like google/gemini-2.0-flash
  return raw.includes('/') ? raw.split('/').pop()! : raw;
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

    const geminiKey = resolveGeminiApiKey();
    const model = resolveGeminiModel();
    const concerns = profile?.concerns ?? [];
    const skinFeel = profile?.skin_feel ?? null;

    let payload: AnalysisPayload | null = null;
    if (geminiKey && signedUrls.length > 0) {
      payload = await analyzeWithGemini({
        apiKey: geminiKey,
        model,
        concerns,
        skinFeel,
        imageUrls: signedUrls,
      });
    }

    if (!payload) {
      payload = heuristicAnalysis(concerns, skinFeel);
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
          routine_plan: payload.routine_plan,
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

    const { data: profileStep } = await admin
      .from('profiles')
      .select('onboarding_step')
      .eq('id', user.id)
      .maybeSingle();

    // Weekly re-scans should not bounce finished users back to onboarding results.
    if (profileStep?.onboarding_step === 'done') {
      await admin
        .from('profiles')
        .update({ starter_ritual_id: payload.ritual_id })
        .eq('id', user.id);
    } else {
      await admin
        .from('profiles')
        .update({
          onboarding_step: 'results',
          starter_ritual_id: payload.ritual_id,
        })
        .eq('id', user.id);
    }

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
