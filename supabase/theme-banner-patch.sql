-- KING VANDYZ V6 — THEME + STATIC BANNER PATCH
-- Run this ONCE after the existing Batch 1–6 database.
-- It does not replace or delete any existing table/data.

alter table public.site_settings
  add column if not exists banner_image_url text default '/banner.jpg',
  add column if not exists banner_position text not null default 'center',
  add column if not exists banner_overlay numeric not null default 0.22,
  add column if not exists banner_alt text not null default 'KING VANDYZ banner',
  add column if not exists theme_config jsonb not null default '{}'::jsonb;

alter table public.site_settings
  drop constraint if exists site_settings_banner_overlay_check;

alter table public.site_settings
  add constraint site_settings_banner_overlay_check
  check (banner_overlay >= 0 and banner_overlay <= 1);

update public.site_settings
set
  banner_image_url = coalesce(nullif(banner_image_url,''), '/banner.jpg'),
  banner_position = coalesce(nullif(banner_position,''), 'center'),
  banner_overlay = least(greatest(coalesce(banner_overlay,0.22),0),1),
  banner_alt = coalesce(nullif(banner_alt,''), 'KING VANDYZ banner'),
  banner_video_url = null,
  default_theme = 'brutal',
  theme_config = case
    when theme_config = '{}'::jsonb then jsonb_build_object(
      'glass',jsonb_build_object('bg','#07080d','surface','#0d1018','surface2','#121722','text','#f6f7fb','muted','#8d96aa','border','#2a3040','primary','#66e6ff','secondary','#c58cff','accent','#ff2bd6','highlight','#66e6ff','shadow','#000000'),
      'brutal',jsonb_build_object('bg','#FFFDF5','surface','#FFFFFF','surface2','#FFFFFF','text','#090909','muted','#4a4640','border','#090909','primary','#4D7CFF','secondary','#A77BFF','accent','#FF4D5A','highlight','#FFD23F','shadow','#090909'),
      'city',jsonb_build_object('bg','#08111b','surface','#0d1925','surface2','#122333','text','#eff7ff','muted','#8ba0b6','border','#2a4257','primary','#7bd9ff','secondary','#78a8ff','accent','#36e1c1','highlight','#ffcc66','shadow','#02060b'),
      'comic',jsonb_build_object('bg','#fff6dc','surface','#FFFFFF','surface2','#FFFFFF','text','#17120d','muted','#6e5e4c','border','#17120d','primary','#1769ff','secondary','#ff3d8d','accent','#ffe05c','highlight','#58d68d','shadow','#17120d')
    )
    else theme_config
  end
where id = true;

select id, default_theme, banner_image_url, banner_position, banner_overlay, theme_config
from public.site_settings
where id = true;
