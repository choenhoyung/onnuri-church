-- 1. 홈페이지 문구 (단일 행)
create table site_settings (
  id int primary key default 1,
  hero_title text not null default '청주 온누리감리교회',
  hero_verse text not null default '우리 마을을 향한 큰 그림을 다시 새롭게 하자',
  hero_ref text not null default '2026년 표어 · 에스겔서 47:5-12',
  pastor_name text not null default '변종태 담임목사',
  pastor_bio text not null default '청주 온누리감리교회를 섬기며, 성도들과 함께 말씀 위에 굳게 서는 교회를 세워가고 있습니다.',
  address text not null default '충북 청주시 서원구 성봉로 194 (개신동)',
  phone text not null default '043-265-1825 / 043-266-1825',
  founded_date text not null default '1981년 3월 14일',
  about_worship text not null default '하나님께 드리는 예배를 최우선으로 삼고, 매일의 기도와 새벽예배로 하루를 시작합니다.',
  about_love text not null default '가족 같은 공동체 안에서 서로의 삶을 나누고, 이웃과 마을을 섬기는 사랑을 실천합니다.',
  about_bible text not null default '말씀 위에 굳게 서서 삶의 방향을 찾고, 다음 세대에게 신앙을 물려주는 교회입니다.',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1);

-- 2. 예배시간 목록
create table worship_times (
  id bigint generated always as identity primary key,
  name text not null,
  time text not null,
  day text not null,
  sort_order int not null default 0
);
insert into worship_times (name, time, day, sort_order) values
  ('주일예배 1부', '오전 9:00', '주일(일요일)', 1),
  ('주일예배 2부', '오전 11:00', '주일(일요일)', 2),
  ('주일오후예배', '오후 2:00', '주일(일요일)', 3),
  ('수요예배', '오후 7:30', '수요일', 4),
  ('금요심야예배', '오후 8:30', '금요일', 5),
  ('새벽기도회', '오전 5:30', '월요일 ~ 토요일', 6);

-- 3. 사진 갤러리
create table photos (
  id bigint generated always as identity primary key,
  url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 4. 주보 게시판
create table bulletins (
  id bigint generated always as identity primary key,
  title text not null,
  bulletin_date date not null,
  description text,
  file_url text,
  created_at timestamptz not null default now()
);

-- RLS 활성화
alter table site_settings enable row level security;
alter table worship_times enable row level security;
alter table photos enable row level security;
alter table bulletins enable row level security;

-- 누구나 읽기 가능
create policy "public read" on site_settings for select using (true);
create policy "public read" on worship_times for select using (true);
create policy "public read" on photos for select using (true);
create policy "public read" on bulletins for select using (true);

-- 로그인한 사용자(관리자)만 쓰기 가능
create policy "admin write" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on worship_times for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on photos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on bulletins for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 5. 스토리지 버킷 (사진 / 주보 파일)
insert into storage.buckets (id, name, public) values ('gallery-photos', 'gallery-photos', true);
insert into storage.buckets (id, name, public) values ('bulletin-files', 'bulletin-files', true);

create policy "public read gallery" on storage.objects for select using (bucket_id = 'gallery-photos');
create policy "public read bulletins" on storage.objects for select using (bucket_id = 'bulletin-files');
create policy "admin write gallery" on storage.objects for insert with check (bucket_id = 'gallery-photos' and auth.role() = 'authenticated');
create policy "admin delete gallery" on storage.objects for delete using (bucket_id = 'gallery-photos' and auth.role() = 'authenticated');
create policy "admin write bulletins" on storage.objects for insert with check (bucket_id = 'bulletin-files' and auth.role() = 'authenticated');
create policy "admin delete bulletins" on storage.objects for delete using (bucket_id = 'bulletin-files' and auth.role() = 'authenticated');
