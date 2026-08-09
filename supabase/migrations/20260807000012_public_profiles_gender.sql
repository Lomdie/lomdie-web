drop view if exists public_candidate_profiles;

create view public_candidate_profiles as
  select id, gender, floor(extract(year from age(birth_date)))::int as age, city, occupation
  from candidates
  where is_publicly_listed = true and status not in ('cloturee');

grant select on public_candidate_profiles to anon, authenticated;

notify pgrst, 'reload schema';
