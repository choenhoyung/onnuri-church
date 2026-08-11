create table popup_settings (
  id int primary key default 1,
  image_url text not null default '',
  link_url text not null default '',
  active boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into popup_settings (id) values (1);

alter table popup_settings enable row level security;
create policy "public read" on popup_settings for select using (true);
create policy "admin write" on popup_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public) values ('popup-images', 'popup-images', true);
create policy "public read popup" on storage.objects for select using (bucket_id = 'popup-images');
create policy "admin write popup" on storage.objects for insert with check (bucket_id = 'popup-images' and auth.role() = 'authenticated');
create policy "admin delete popup" on storage.objects for delete using (bucket_id = 'popup-images' and auth.role() = 'authenticated');
