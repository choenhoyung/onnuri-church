alter table site_settings add column vision_text text not null default '';

create table church_history (
  id bigint generated always as identity primary key,
  year text not null,
  event text not null,
  sort_order int not null default 0
);
alter table church_history enable row level security;
create policy "public read" on church_history for select using (true);
create policy "admin write" on church_history for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create table serving_team (
  id bigint generated always as identity primary key,
  name text not null,
  role text not null default '',
  photo_url text not null default '',
  sort_order int not null default 0
);
alter table serving_team enable row level security;
create policy "public read" on serving_team for select using (true);
create policy "admin write" on serving_team for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
