insert into storage.buckets (id, name, public)
values ('candidate-photos', 'candidate-photos', false)
on conflict (id) do nothing;

-- Bucket prive : les candidats deposent leurs photos via le formulaire public
-- (insert anonyme autorise), mais seule l'equipe authentifiee peut les relire
-- (jamais de photo de candidat exposee publiquement, meme via URL directe).
create policy "candidate photos public upload" on storage.objects
  for insert with check (bucket_id = 'candidate-photos');

create policy "candidate photos admin read" on storage.objects
  for select to authenticated using (bucket_id = 'candidate-photos');

create policy "candidate photos admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'candidate-photos');
