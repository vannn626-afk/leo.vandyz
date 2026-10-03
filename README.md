# KING VANDYZ V6 — Static Banner + Global Theme CMS

The existing KING VANDYZ V6 app/API architecture is preserved. This revision changes the visual layer, removes the old animated banner, and adds admin-controlled banner/theme customization.

## Existing database
The production database can remain the Batch 1–6 database already installed in Supabase. **Do not rerun the old master migration over it.**

Run this one additional SQL patch once:

`supabase/theme-banner-patch.sql`

It adds banner image settings and a JSONB theme palette to `public.site_settings`, without replacing existing users, orders, tools, credits, VIP state, or RPCs.

## Banner
- Old `banner.mp4` and `banner.svg` are removed from the public build.
- The supplied static image is now `public/banner.jpg` in 16:9.
- Admin → Banner can change the image URL, upload an image, crop position, overlay opacity, and alt text.
- The app never auto-plays a banner video.

## Themes
Default theme: **Neo Brutalism**.

The four themes change the complete interface, including navigation, cards, buttons, forms, admin CMS, page surfaces, typography accents, borders, shadows, and banner treatment:
- Glassmorphism
- Neo Brutalism
- Modern City
- Comic Style

Admin → Themes can change the palette for each theme. The selected default theme and palettes are persisted in `site_settings.theme_config`.

## API / security
Existing routes and execution remain: `/api/proxy`, `/api/catalog`, `/api/upload-video`, `/api/upload-image`, `src/services/api.js`, `src/data/catalog.js`, response rendering, Supabase Auth, RLS, credits/VIP RPCs, orders, and Admin CMS. No service-role key is shipped to the browser.

## Vercel
Set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- existing API environment variables required by `/api/proxy`

Build with `npm run build`.
