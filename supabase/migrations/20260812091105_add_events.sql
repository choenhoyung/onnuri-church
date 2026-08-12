create table events (
  id bigint generated always as identity primary key,
  title text not null,
  event_date date not null,
  event_time text not null default '',
  location text not null default '',
  description text not null default '',
  created_at timestamptz not null default now()
);
alter table events enable row level security;
create policy "public read" on events for select using (true);
create policy "admin write" on events for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
