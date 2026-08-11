alter table candidates
  add column if not exists is_paid boolean not null default false;

update candidates
set is_paid = true
where status in ('payee', 'en_matching', 'mise_en_relation', 'cloturee')
  and is_paid = false;

alter table candidates
  alter column search_body_type type text[]
  using case
    when search_body_type is null or btrim(search_body_type) = '' then null
    else array[search_body_type]
  end;

comment on column candidates.is_paid is
  'Confirmation manuelle du paiement par un administrateur. Autorise la reservation apres le dossier detaille.';
