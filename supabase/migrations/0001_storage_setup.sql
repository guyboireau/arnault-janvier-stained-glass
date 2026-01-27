
insert into storage.buckets
  (id, name, public)
values
  ('project-images', 'project-images', true);

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'project-images' );

create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'project-images' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'project-images' and auth.role() = 'authenticated' );
