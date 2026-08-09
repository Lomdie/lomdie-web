create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

create policy "newsletter inscription publique" on newsletter_subscribers
  for insert with check (true);

create policy "newsletter lecture equipe" on newsletter_subscribers
  for select to authenticated using (true);

notify pgrst, 'reload schema';
