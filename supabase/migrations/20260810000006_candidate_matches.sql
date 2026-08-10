create table if not exists candidate_matches (
  id uuid primary key default gen_random_uuid(),
  candidate_a_id uuid not null references candidates(id) on delete cascade,
  candidate_b_id uuid not null references candidates(id) on delete cascade,
  status text not null default 'proposee' check (
    status in ('proposee', 'en_discussion', 'rendez_vous_prevu', 'en_relation', 'refusee', 'terminee')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidate_matches_two_people check (candidate_a_id <> candidate_b_id)
);

create unique index if not exists candidate_matches_unique_pair
  on candidate_matches (least(candidate_a_id, candidate_b_id), greatest(candidate_a_id, candidate_b_id));

create index if not exists candidate_matches_candidate_a_idx on candidate_matches(candidate_a_id);
create index if not exists candidate_matches_candidate_b_idx on candidate_matches(candidate_b_id);

drop trigger if exists candidate_matches_updated_at on candidate_matches;
create trigger candidate_matches_updated_at
  before update on candidate_matches
  for each row execute function set_updated_at();

alter table candidate_matches enable row level security;

create policy "candidate matches admin select" on candidate_matches for select to authenticated using (true);
create policy "candidate matches admin insert" on candidate_matches for insert to authenticated with check (true);
create policy "candidate matches admin update" on candidate_matches for update to authenticated using (true) with check (true);
create policy "candidate matches admin delete" on candidate_matches for delete to authenticated using (true);

comment on table candidate_matches is 'Suivi bidirectionnel des mises en relation entre deux candidats';

notify pgrst, 'reload schema';
