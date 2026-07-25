-- Coach chat threads: one conversation = one thread_id
alter table public.coach_messages
  add column if not exists thread_id uuid;

-- Collapse existing flat messages into one legacy thread per user
update public.coach_messages cm
set thread_id = legacy.thread_id
from (
  select user_id, gen_random_uuid() as thread_id
  from public.coach_messages
  where thread_id is null
  group by user_id
) legacy
where cm.user_id = legacy.user_id
  and cm.thread_id is null;

update public.coach_messages
set thread_id = gen_random_uuid()
where thread_id is null;

alter table public.coach_messages
  alter column thread_id set default gen_random_uuid(),
  alter column thread_id set not null;

create index if not exists coach_messages_user_thread_created_idx
  on public.coach_messages (user_id, thread_id, created_at);
