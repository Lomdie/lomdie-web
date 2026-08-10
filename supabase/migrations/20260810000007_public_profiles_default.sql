alter table candidates
  alter column is_publicly_listed set default true;

update candidates
set is_publicly_listed = true
where is_publicly_listed = false;

notify pgrst, 'reload schema';
