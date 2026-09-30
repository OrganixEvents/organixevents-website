# OrganixEvents — website 2027 (V0.1)

New OrganixEvents website, built separately from the live Squarespace site (which stays untouched).
Deployed to a Netlify preview. **Not connected to organixevents.com.**

## Stack

A zero-dependency static site generator in plain Node.js (≥ 18):

- **No `npm install`, no framework, no client-side JS framework.** Pages are pre-rendered HTML + one CSS file + one small JS file for progressive enhancement (menu, reveal motion, enquiry form).
- Content lives in **JSON files** (`src/content/`) — experiences, page copy, UI strings per language.
- Images are pre-generated as **AVIF + WebP** in 5 responsive widths (`scripts/images.py`).
- Forms use **Netlify Forms** (no backend).

## Commands

```bash
node scripts/build.mjs            # build → dist/  (what Netlify runs)
node scripts/serve.mjs            # serve dist/ on http://localhost:8080/en/
PREVIEW=1 node scripts/build.mjs  # file-based build → dist-preview/ (static review copy)
python3 scripts/images.py         # regenerate responsive images after adding/replacing photos
```

## Netlify setup

1. New site → import `OrganixEvents/organixevents-website`.
2. Build settings are read from `netlify.toml` (build: `node scripts/build.mjs`, publish: `dist`).
3. Forms: enable form detection (Site settings → Forms). The `enquiry` form is detected automatically. Add an email notification to receive enquiries.
4. Leave `SITE_INDEXABLE` unset until launch → every page is `noindex`, `robots.txt` disallows all, and an `X-Robots-Tag: noindex` header is sent.
5. At launch: connect the domain, set `SITE_URL=https://www.organixevents.com` and `SITE_INDEXABLE=true`.

## Structure

```
netlify.toml
scripts/
  build.mjs            static site generator (routes, i18n, SEO, sitemap, headers, redirects)
  serve.mjs            local preview server
  images.py            photo pipeline: source-media/ → public/media/ + src/content/media.json
source-media/          original photos (from the Organix media pack)
public/
  brand/               official logo, X symbol (vector, extracted from ORGANIX LOGO.pdf), favicon, OG image
  media/<key>/<w>.avif|webp   generated responsive images
src/
  content/
    site.json          contact, languages, navigation, partners
    media.json         generated image manifest (alt text, focal point, sizes)
    inspirations.json  custom-trip inspiration (not bookable products)
    experiences/*.json one file per experience (the reusable data model)
    pages/<page>.<lang>.json   page copy per language
  i18n/en|fr|de.json   interface strings (navigation, buttons, form)
  templates/
    layout.mjs         <head>, header, mobile menu, footer
    components.mjs     hero, cards, CTA, partners, etc.
    pages/*.mjs        one template per page type
  assets/main.css, main.js
docs/
  CONTENT-GUIDE.md     how to edit experiences, dates, prices, images, languages
  V0-RAPPORT.md        V0 delivery report
  V0.1-CHANGELOG.md    V0.1 changes, open questions, missing assets
```

## Languages

`/en/`, `/fr/`, `/de/` are fully translated (pages, experiences, inspirations, form, SEO, alt texts).
A page counts as translated when `src/content/pages/<page>.<lang>.json` exists (for experiences: when the
`fr` / `de` keys exist in the JSON). If a translation is ever missing, the page falls back to English with a
visible notice, `noindex` and a canonical to the English page — the build prints the list.
hreflang (en / fr / de + x-default) and the sitemap link all translated versions. The root `/` redirects
by browser language (`_redirects`). The whole site stays `noindex` until `SITE_INDEXABLE=true`.

## Analytics

No provider is loaded in V0. Events are pushed to `window.dataLayer`:
`enquiry_started`, `enquiry_submitted`, `north_macedonia_enquiry`, `winter_enquiry`, `summer_enquiry`,
`custom_enquiry`, plus `enquiry_cta` clicks (with location). Add GA4 / Plausible / GTM later in `layout.mjs`.
