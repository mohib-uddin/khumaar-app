-- Saved AI color stylist look on profile
alter table public.profiles
  add column if not exists style_palette jsonb,
  add column if not exists style_palette_updated_at timestamptz;
