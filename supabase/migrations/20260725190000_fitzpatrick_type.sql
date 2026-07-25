-- Fitzpatrick phototype estimate (1–6) from scan AI
alter table public.profiles
  add column if not exists fitzpatrick_type smallint
  check (fitzpatrick_type is null or (fitzpatrick_type between 1 and 6));

alter table public.scan_analyses
  add column if not exists fitzpatrick_type smallint
  check (fitzpatrick_type is null or (fitzpatrick_type between 1 and 6));
