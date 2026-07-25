import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const STYLIST_SYSTEM = `You are Khumaar Color Edit — a premium cosmetic fashion stylist (NOT a doctor, NOT a dermatologist).
Return ONLY valid JSON with this exact shape:
{
  "look_name": string (short editorial title, 2–5 words),
  "blurb": string (one calm luxury sentence),
  "undertone_read": "cool" | "warm" | "neutral",
  "hero": { "id": string, "label": string, "hex": string, "why": string },
  "occasions": [
    { "id": "casual", "label": "Casual", "colors": [{ "id": string, "label": string, "hex": string }] },
    { "id": "formal", "label": "Formal", "colors": [{ "id": string, "label": string, "hex": string }] },
    { "id": "night_out", "label": "Night out", "colors": [{ "id": string, "label": string, "hex": string }] }
  ]
}
Rules:
- Cosmetic style guidance only. Never claim medical certainty.
- hex must be #RRGGBB uppercase.
- occasions MUST include exactly those three ids in that order.
- Each occasion.colors: 6–8 wearable outfit colors suited to that setting.
- Casual: everyday / weekend ease. Formal: work / polished. Night out: evening / elevated.
- Tailor wardrobe colors to phototype + undertone + gender presentation (woman / man / nonbinary).
- If gender is prefer_not_to_say or unknown, use gender-neutral wardrobe guidance.
- hero.why: one short line why this signature color flatters them.
- Real wardrobe colors (no neon gimmicks unless truly flattering).
- Vary the look when a variation seed is provided.
- Do NOT include accents or colors-to-avoid lists.`;

type StyleSwatch = { id: string; label: string; hex: string; why?: string };
type StyleOccasionId = 'casual' | 'formal' | 'night_out';
type StyleOccasion = {
  id: StyleOccasionId;
  label: string;
  colors: StyleSwatch[];
};
type StylePalette = {
  look_name: string;
  blurb: string;
  undertone_read: 'cool' | 'warm' | 'neutral';
  hero: StyleSwatch;
  occasions: StyleOccasion[];
};

const OCCASION_DEFS: Array<{
  id: StyleOccasionId;
  label: string;
  fallbacks: Array<{ label: string; hex: string }>;
}> = [
  {
    id: 'casual',
    label: 'Casual',
    fallbacks: [
      { label: 'Ivory', hex: '#F4EFE6' },
      { label: 'Stone', hex: '#C5BDB3' },
      { label: 'Soft denim', hex: '#7A8FA3' },
      { label: 'Sage', hex: '#8FA08A' },
      { label: 'Camel', hex: '#C4A484' },
      { label: 'Charcoal', hex: '#4A4A4C' },
    ],
  },
  {
    id: 'formal',
    label: 'Formal',
    fallbacks: [
      { label: 'Ink', hex: '#1C1C1E' },
      { label: 'Slate', hex: '#5C6670' },
      { label: 'Bone', hex: '#E8E2D8' },
      { label: 'Navy', hex: '#243B55' },
      { label: 'Taupe', hex: '#8B7E74' },
      { label: 'Wine', hex: '#5C2E3A' },
    ],
  },
  {
    id: 'night_out',
    label: 'Night out',
    fallbacks: [
      { label: 'Velvet', hex: '#2B1A2E' },
      { label: 'Berry', hex: '#7A3E5C' },
      { label: 'Bronze', hex: '#8C6A3F' },
      { label: 'Emerald', hex: '#2F5D50' },
      { label: 'Champagne', hex: '#E6D5B8' },
      { label: 'Graphite', hex: '#3A3A3C' },
    ],
  },
];

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

function normalizeHex(value: unknown, fallback: string): string {
  const raw = String(value ?? '').trim().toUpperCase();
  if (/^#[0-9A-F]{6}$/.test(raw)) return raw;
  if (/^[0-9A-F]{6}$/.test(raw)) return `#${raw}`;
  return fallback;
}

function slugId(label: string, index: number): string {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return base || `color-${index}`;
}

function normalizeSwatch(
  raw: Partial<StyleSwatch> | undefined,
  fallbackHex: string,
  index: number,
): StyleSwatch {
  const label = String(raw?.label || `Color ${index + 1}`).slice(0, 32);
  return {
    id: String(raw?.id || slugId(label, index)).slice(0, 48),
    label,
    hex: normalizeHex(raw?.hex, fallbackHex),
    ...(raw?.why ? { why: String(raw.why).slice(0, 160) } : {}),
  };
}

function normalizeOccasion(
  def: (typeof OCCASION_DEFS)[number],
  rawList: unknown[],
): StyleOccasion {
  const fromModel = rawList
    .filter((item): item is Partial<StyleSwatch> => !!item && typeof item === 'object')
    .slice(0, 8)
    .map((s, i) =>
      normalizeSwatch(s, def.fallbacks[i % def.fallbacks.length].hex, i),
    );

  const colors = [...fromModel];
  let fill = 0;
  while (colors.length < 6) {
    const fb = def.fallbacks[fill % def.fallbacks.length];
    colors.push(normalizeSwatch(fb, fb.hex, colors.length));
    fill += 1;
  }

  return {
    id: def.id,
    label: def.label,
    colors,
  };
}

function normalizePalette(parsed: Partial<StylePalette> & Record<string, unknown>): StylePalette {
  const undertone =
    parsed.undertone_read === 'cool' ||
    parsed.undertone_read === 'warm' ||
    parsed.undertone_read === 'neutral'
      ? parsed.undertone_read
      : 'neutral';

  const hero = normalizeSwatch(parsed.hero, '#3A3A3C', 0);
  if (parsed.hero?.why) hero.why = String(parsed.hero.why).slice(0, 160);
  else hero.why = 'A grounded signature that flatters your phototype.';

  const rawOccasions = Array.isArray(parsed.occasions) ? parsed.occasions : [];
  const byId = new Map<string, unknown[]>();
  for (const item of rawOccasions) {
    if (!item || typeof item !== 'object') continue;
    const o = item as { id?: string; colors?: unknown[] };
    if (o.id && Array.isArray(o.colors)) byId.set(o.id, o.colors);
  }

  const occasions = OCCASION_DEFS.map((def) =>
    normalizeOccasion(def, byId.get(def.id) ?? []),
  );

  return {
    look_name: String(parsed.look_name || 'Personal edit').slice(0, 48),
    blurb: String(
      parsed.blurb || 'A calm wardrobe edit tuned to your phototype.',
    ).slice(0, 220),
    undertone_read: undertone,
    hero,
    occasions,
  };
}

async function callGemini(params: {
  apiKey: string;
  model: string;
  prompt: string;
}): Promise<StylePalette | null> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent?key=${params.apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: params.prompt }] }],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 3072,
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  const raw = await response.text();
  if (!response.ok) {
    console.error('Gemini style-colors error', response.status, raw.slice(0, 500));
    return null;
  }

  let body: {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  try {
    body = JSON.parse(raw);
  } catch {
    return null;
  }

  const text = body?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? '')
    .join('')
    ?.trim();
  if (!text) return null;

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return normalizePalette(JSON.parse(jsonMatch[0]) as Partial<StylePalette>);
  } catch {
    return null;
  }
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

    const body = await req.json().catch(() => ({}));
    const variation =
      typeof body?.variation === 'number' && Number.isFinite(body.variation)
        ? Math.round(body.variation)
        : Math.floor(Math.random() * 10000);

    const { data: profile } = await admin
      .from('profiles')
      .select(
        'display_name, fitzpatrick_type, skin_undertone, skin_feel, concerns, gender',
      )
      .eq('id', user.id)
      .maybeSingle();

    const fitz = profile?.fitzpatrick_type;
    if (fitz == null || fitz < 1 || fitz > 6) {
      return new Response(
        JSON.stringify({ error: 'fitzpatrick_type required — complete a scan first' }),
        {
          status: 400,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        },
      );
    }

    const concerns = Array.isArray(profile?.concerns)
      ? (profile.concerns as string[]).slice(0, 8).join(', ')
      : 'none listed';

    const genderRaw = profile?.gender;
    const genderLabel =
      genderRaw === 'woman' ||
      genderRaw === 'man' ||
      genderRaw === 'nonbinary' ||
      genderRaw === 'prefer_not_to_say'
        ? genderRaw
        : 'unknown';

    const prompt = `${STYLIST_SYSTEM}

Client brief:
- Name: ${profile?.display_name ?? 'Client'}
- Gender presentation: ${genderLabel}
- Fitzpatrick phototype: ${fitz} (I–VI scale)
- Undertone hint from scan (optional): ${profile?.skin_undertone ?? 'unknown'}
- Skin feel: ${profile?.skin_feel ?? 'unknown'}
- Focus concerns: ${concerns}
- Variation seed: ${variation}

Create a distinctive personal color edit organized by Casual, Formal, and Night out — tuned to tone and gender presentation.`;

    const palette = await callGemini({
      apiKey: geminiKey,
      model: resolveGeminiModel(),
      prompt,
    });

    if (!palette) {
      return new Response(
        JSON.stringify({ error: 'Stylist unavailable', detail: 'Empty or invalid Gemini response' }),
        {
          status: 502,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(JSON.stringify({ palette }), {
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
