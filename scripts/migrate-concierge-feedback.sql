create table if not exists public.concierge_feedback (
  id bigserial primary key,
  user_id bigint references public.users(id) on delete set null,
  rating smallint not null check (rating in (-1, 1)),
  question text,
  answer text,
  lang text,
  created_at timestamptz not null default now()
);
alter table public.concierge_feedback enable row level security;
