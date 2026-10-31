create table if not exists public.source_check_runs (
  month text primary key,
  ran_at timestamptz not null default now()
);
alter table public.source_check_runs enable row level security;
