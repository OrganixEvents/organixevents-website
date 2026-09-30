# Content guide

Everything editable lives in `src/content/` and `src/i18n/`. After any change, Netlify rebuilds on push.

## Experiences — `src/content/experiences/<slug>.json`

One file per experience. Pages, cards, the footer and structured data are generated from these files —
nothing is hard-coded in the layout.

| Field | Meaning |
|---|---|
| `slug` | unique id (also used by page copy to reference the experience) |
| `path` | URL under each language, e.g. `winter/norway/` |
| `template` | `experience` (generic page) or `flagship` (North Macedonia's dedicated page) |
| `title`, `shortTitle`, `tagline`, `shortDescription`, `longDescription` | text, per language: `{ "en": "…", "fr": "…", "de": "…" }` |
| `country`, `region` | location labels |
| `season` | `winter` or `summer` — decides where it appears |
| `experienceType` | free label (snowcat-freeride, ski-and-sail, wake…) |
| `universe` | small label above the title (e.g. "Hosted partner experience") |
| `heroImage`, `gallery` | media keys from `src/content/media.json` (`null` → visible placeholder) |
| `status` | `active` or `hidden` (hidden = page, cards and links disappear) |
| `featured`, `flagship` | flags |
| `priceFrom`, `currency` | `null` hides the price everywhere |
| `duration`, `dates`, `seasonWindow`, `flexibleDates` | dates are `{ "label": {…}, "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" }` |
| `groupSize` | `{ typical, usualMax, absoluteMax, note }` |
| `activities`, `included`, `notIncluded` | lists, per language |
| `difficulty`, `partner` | optional |
| `blocks` | extra page sections: `points`, `options`, `story`, `chips`, `list`, `camps` |
| `cta` | enquiry button label + which enquiry option to pre-select |
| `seo` | title + description per language |

### Common tasks

- **Disable an experience:** `"status": "hidden"`.
- **Add a destination:** copy an existing file (e.g. `norway.json`), change `slug`, `path` and content,
  then add the slug to `items` in `src/content/pages/winter.en.json` (or summer) to show it on the landing pages.
- **Change dates / price:** edit `dates` / `priceFrom`.
- **Change an image:** point `heroImage` to another media key.
- **Youth camps per season:** in `youth-camps.json`, set `"active": true` and `"dates"` for each camp.

## Photos

1. Put the original in `source-media/…`.
2. Add a line to `MEDIA` in `scripts/images.py`: key, file, English alt text, focal point.
3. Run `python3 scripts/images.py` and commit `public/media/` + `src/content/media.json`.

## Page copy — `src/content/pages/<page>.<lang>.json`

One file per page and language. To translate a page into French: copy `home.en.json` to `home.fr.json`
and translate the values (keep the keys). The page then becomes indexable in French, hreflang links
appear automatically, and the fallback notice disappears.

The root language redirect (`_redirects`) is generated automatically for every language that has a home page.

## Contact details and team names — `src/content/site.json`

Single source of truth: `contact.email` (hello@organixevents.com), address, `social` (Instagram) and — optional, currently removed — `phone` / `whatsapp`, and
`team.bryan.name` / `team.stephane.name`. Change a value there and every page (footer, enquiry page,
About cards, structured data) updates on the next build.

## Partners — `src/content/site.json`

Add the official logo file to `public/brand/partners/` and set `"logo": "brand/partners/julbo.svg"`.

## Interface strings — `src/i18n/<lang>.json`

Navigation, buttons, form labels, in EN / FR / DE. Form option *values* always stay in English
(stable in the Netlify inbox and for URL pre-selection); only the labels are translated.

## Translated alt texts — `src/content/media-alt.json`

French and German alt text per media key (English lives in `scripts/images.py`).

## Headings and long words

Big headings shrink automatically when a single word would not fit its column (e.g. "Nordmazedonien" on a phone),
so copy can be edited freely in any language.

## Analytics (GA4) & consent
Set `analytics.ga4Id` in `src/content/site.json` (e.g. `G-XXXXXXX`). Until it is set, no analytics code runs.
When set, Consent Mode v2 starts with everything denied; Google's script loads only after the visitor clicks "Accept"
in the consent card. The visitor can change the choice via "Cookie settings" in the footer.
Events: page_view (+ destination), destination_view, enquiry_cta, enquiry_started, enquiry_submitted, language_change, partner_click, email_click.

## Netlify form notifications
Netlify › Site › Forms › Form notifications › Add notification › Email → hello@organixevents.com, form `enquiry`.
The hidden `subject` field sets the email subject.

## Legal pages
`src/content/pages/legal.<lang>.json` and `privacy.<lang>.json` (sections with a heading and paragraphs). Must be legally validated before production.
