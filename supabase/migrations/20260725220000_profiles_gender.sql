-- Gender presentation for color stylist + onboarding step 'gender'
alter table public.profiles
  add column if not exists gender text
    check (gender is null or gender in ('woman', 'man', 'nonbinary', 'prefer_not_to_say'));

do $$ begin
  alter table public.profiles drop constraint if exists profiles_onboarding_step_check;
exception when undefined_object then null;
end $$;

alter table public.profiles
  add constraint profiles_onboarding_step_check
  check (onboarding_step in (
    'welcome', 'auth', 'consent', 'gender', 'concerns', 'feel', 'prep', 'scan', 'analyzing', 'results', 'done'
  ));
