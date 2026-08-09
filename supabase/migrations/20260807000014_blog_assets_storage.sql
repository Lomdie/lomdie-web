insert into storage.buckets (id, name, public)
values ('blog-assets', 'blog-assets', true)
on conflict (id) do nothing;

create policy "blog assets public read" on storage.objects
  for select using (bucket_id = 'blog-assets');

create policy "blog assets admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'blog-assets');

create policy "blog assets admin update" on storage.objects
  for update to authenticated using (bucket_id = 'blog-assets');

create policy "blog assets admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'blog-assets');
