create table if not exists integration_secrets (
  name text primary key,
  secret text not null,
  updated_at timestamptz not null default now()
);

alter table integration_secrets enable row level security;
