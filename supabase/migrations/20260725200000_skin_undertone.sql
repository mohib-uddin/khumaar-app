-- Cosmetic undertone estimate from scan AI
alter table public.profiles
  add column if not exists skin_undertone text
  check (skin_undertone is null or skin_undertone in ('cool', 'warm', 'neutral'));

alter table public.scan_analyses
  add column if not exists skin_undertone text
  check (skin_undertone is null or skin_undertone in ('cool', 'warm', 'neutral'));
