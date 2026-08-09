insert into storage.buckets (id, name, public)
values ('team-photos', 'team-photos', true)
on conflict (id) do nothing;

create policy "team photos public read" on storage.objects
  for select using (bucket_id = 'team-photos');

create policy "team photos admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'team-photos');

create policy "team photos admin update" on storage.objects
  for update to authenticated using (bucket_id = 'team-photos');

create policy "team photos admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'team-photos');
