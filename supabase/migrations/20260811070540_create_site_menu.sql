create table site_menu (
  id int primary key default 1,
  menu jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into site_menu (id, menu) values (1, '[
  {
    "title": "교회소개",
    "url": "index.html#about",
    "submenus": [
      { "label": "담임목사 인사", "url": "index.html#pastor" },
      { "label": "예배시간 안내", "url": "index.html#worship" },
      { "label": "오시는 길", "url": "index.html#location" }
    ]
  },
  {
    "title": "좋은뉴스",
    "url": "bulletins.html",
    "submenus": [
      { "label": "교회주보", "url": "bulletins.html" },
      { "label": "앨범", "url": "gallery.html" }
    ]
  },
  {
    "title": "교육부&청년회",
    "url": "gallery.html",
    "submenus": [
      { "label": "유치부", "url": "gallery.html" },
      { "label": "초등부", "url": "gallery.html" },
      { "label": "학생부", "url": "gallery.html" },
      { "label": "청년부", "url": "gallery.html" },
      { "label": "장년부", "url": "gallery.html" }
    ]
  }
]'::jsonb);

alter table site_menu enable row level security;
create policy "public read" on site_menu for select using (true);
create policy "admin write" on site_menu for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
