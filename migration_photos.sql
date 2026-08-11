alter table photos add column photo_year int not null default extract(year from now())::int;
alter table photos add column department text not null default '전체';
