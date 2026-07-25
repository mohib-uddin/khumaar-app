-- Onboarding schema for Khumaar (reference copy of remote MCP migration).
-- Prefer applying via Supabase MCP / `supabase db push` against project kppuwckmuoapvcycovqd.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  onboarding_step text not null default 'welcome'
    check (onboarding_step in (
      'welcome', 'auth', 'consent', 'concerns', 'feel', 'prep', 'scan', 'analyzing', 'results', 'done'
    )),
  concerns text[] not null default '{}',
  skin_feel text check (skin_feel is null or skin_feel in ('dry', 'oily', 'combo', 'sensitive')),
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  wellness_disclaimer_accepted_at timestamptz,
  photo_ai_consent_at timestamptz,
  starter_ritual_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consent_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  consent_type text not null check (consent_type in ('terms', 'privacy', 'wellness_disclaimer', 'photo_ai')),
  accepted boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  view text not null check (view in ('front', 'left', 'right', 'side')),
  storage_path text not null,
  status text not null default 'pending'
    check (status in ('pending', 'uploaded', 'analyzing', 'ready', 'failed')),
  batch_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.scan_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  batch_id uuid not null,
  overall_score integer not null check (overall_score between 0 and 100),
  top_focus text not null,
  headline text not null,
  metrics jsonb not null default '[]'::jsonb,
  ritual_id text not null default 'morning',
  disclaimer text not null default 'Cosmetic skin coaching estimate — not a medical diagnosis.',
  raw jsonb,
  created_at timestamptz not null default now()
);
