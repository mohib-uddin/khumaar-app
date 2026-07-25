-- Persist LLM routine plan on analyses
alter table public.scan_analyses
  add column if not exists routine_plan jsonb;

-- Daily step completions
create table if not exists public.routine_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_id text not null,
  step_id text not null,
  completed_on date not null default (timezone('utc', now()))::date,
  created_at timestamptz not null default now(),
  unique (user_id, routine_id, step_id, completed_on)
);

create index if not exists routine_completions_user_date_idx
  on public.routine_completions (user_id, completed_on desc);

alter table public.routine_completions enable row level security;

drop policy if exists "routine_completions_select_own" on public.routine_completions;
create policy "routine_completions_select_own"
  on public.routine_completions for select
  using (auth.uid() = user_id);

drop policy if exists "routine_completions_insert_own" on public.routine_completions;
create policy "routine_completions_insert_own"
  on public.routine_completions for insert
  with check (auth.uid() = user_id);

drop policy if exists "routine_completions_delete_own" on public.routine_completions;
create policy "routine_completions_delete_own"
  on public.routine_completions for delete
  using (auth.uid() = user_id);

-- Coach message history
create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists coach_messages_user_created_idx
  on public.coach_messages (user_id, created_at desc);

alter table public.coach_messages enable row level security;

drop policy if exists "coach_messages_select_own" on public.coach_messages;
create policy "coach_messages_select_own"
  on public.coach_messages for select
  using (auth.uid() = user_id);

drop policy if exists "coach_messages_insert_own" on public.coach_messages;
create policy "coach_messages_insert_own"
  on public.coach_messages for insert
  with check (auth.uid() = user_id);

drop policy if exists "coach_messages_delete_own" on public.coach_messages;
create policy "coach_messages_delete_own"
  on public.coach_messages for delete
  using (auth.uid() = user_id);
