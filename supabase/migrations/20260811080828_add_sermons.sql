create table sermons (
  id bigint generated always as identity primary key,
  video_id text not null unique,
  title text not null,
  thumbnail_url text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
alter table sermons enable row level security;
create policy "public read" on sermons for select using (true);
create policy "admin write" on sermons for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create table integration_settings (
  id int primary key default 1,
  youtube_api_key text not null default '',
  youtube_channel_handle text not null default '',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into integration_settings (id) values (1);
alter table integration_settings enable row level security;
create policy "admin read" on integration_settings for select using (auth.role() = 'authenticated');
create policy "admin write" on integration_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
