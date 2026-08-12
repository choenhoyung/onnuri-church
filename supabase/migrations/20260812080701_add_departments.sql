create table departments (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  leader_name text not null default '',
  banner_image text not null default '',
  sort_order int not null default 0
);

insert into departments (slug, name, description, leader_name, sort_order) values
  ('유치부', '유치부', '유치부는 어린 아이들이 하나님의 사랑을 몸과 마음으로 배우는 시간입니다. 찬양과 놀이, 성경이야기를 통해 즐겁게 신앙의 첫걸음을 뗍니다.', '', 1),
  ('초등부', '초등부', '초등부는 말씀과 찬양, 다양한 활동을 통해 어린이들이 스스로 신앙을 세워갈 수 있도록 돕습니다.', '', 2),
  ('학생부', '학생부', '학생부는 청소년들이 또래와 함께 신앙 안에서 고민을 나누고 성장하는 공동체입니다.', '', 3),
  ('청년부', '청년부', '청년부는 삶의 방향을 고민하는 청년들이 말씀 안에서 서로를 세워주는 공동체입니다.', '', 4),
  ('장년부', '장년부', '장년부는 삶의 경험을 나누며 다음 세대를 위해 기도하고 섬기는 공동체입니다.', '', 5);

alter table departments enable row level security;
create policy "public read" on departments for select using (true);
create policy "admin write" on departments for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
