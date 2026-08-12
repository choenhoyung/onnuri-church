alter table site_settings add column hero_bg_image text not null default '';

insert into storage.buckets (id, name, public) values ('hero-images', 'hero-images', true);
create policy "public read hero" on storage.objects for select using (bucket_id = 'hero-images');
create policy "admin write hero" on storage.objects for insert with check (bucket_id = 'hero-images' and auth.role() = 'authenticated');
create policy "admin delete hero" on storage.objects for delete using (bucket_id = 'hero-images' and auth.role() = 'authenticated');
