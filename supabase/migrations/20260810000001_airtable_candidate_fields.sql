alter table candidates
  add column if not exists application_date timestamptz,
  add column if not exists airtable_record_id text,
  add column if not exists airtable_age integer,
  add column if not exists eligibility_score numeric,
  add column if not exists meeting_notes text,
  add column if not exists key_decisions text,
  add column if not exists airtable_status text,
  add column if not exists airtable_criteria_ids text[],
  add column if not exists airtable_data jsonb not null default '{}'::jsonb;

update candidates
set application_date = created_at
where application_date is null;

alter table candidates
  alter column application_date set default now(),
  alter column application_date set not null;

create unique index if not exists candidates_airtable_record_id_key
  on candidates (airtable_record_id)
  where airtable_record_id is not null;

create index if not exists candidates_application_date_idx
  on candidates (application_date desc);
