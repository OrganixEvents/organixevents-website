# OrganixEvents — V1 Release Candidate

Base: V0.2 (same design, same static architecture). Site still **noindex** (meta robots, `X-Robots-Tag`, robots.txt `Disallow: /`).

## Changes
- **Home:** "Beyond the ordinary." + "Built around you."; North Macedonia flagship with From CHF 2,250 / person; values reworded (field experience · mountains · sport · local knowledge · organisation; "Our own operation").
- **North Macedonia:** page simplified (repeated sections removed: "difference", 8-day example week, duplicate "included").
  - Format "7 nights · 6 ski days".
  - PistenBully PB300W owned by OrganixEvents Sàrl; snowcat straight from the hotel.
  - Guides: "local UIMLA guide", matching the Macedonia 2027 brochure (English, French, German).
  - Full board detailed (breakfast, picnic/lunch, dinner, water; no alcohol or soft drinks); last night in Skopje + final dinner within the 7 nights.
  - Rental list without boots/helmets; solo travellers "depending on dates, availability and levels".
  - Wild Tracks explained once; Albania heliski as an option only; FAQ reduced to 10 questions.
- **Georgia:** "we have secured one week", 12 clients maximum, a member of the Organix team, "coming back for several years", non-ownership stated.
- **Norway:** Ski & Sail and land-based presented as two turnkey products of equal weight; zones incl. surrounding areas; level + fitness for touring.
- **Alps:** formats (private day → week), beginner → expert, From CHF 550 / day then quote, Ski Safari as an Organix product, UIAGM partner guides for activities that legally require them, other alpine projects.
- **Youth Camps:** positioning (not a holiday camp), formats (week, day, half day, training, wake coaching), Lac des Brenets added, ages/prices/dates per edition.
- **Portugal:** the lake is public, the house, pontoon and boat are private; complete beginner → expert; equipment on site; flexible duration; price on request; better hero photo.
- **Summer Adventures:** "Organix isn't only winter".
- **Custom:** "You imagine. We create." (English signature), turnkey list, Corporate / Private / Clubs audiences, custom quotation, "Start with an idea."
- **About:** Bryan's text revised; Stéphane "Co-Founder · Operations & Local Development"; clear distinction between the ~15-year Organix adventure and the much more recent Sàrl; positive local philosophy.
- **Partners:** "The people and brands we trust along the way." + official logos (Julbo, Blizzard, Nidecker Group, Art Feet, Rocheray) taken from the official sites, clickable to verified URLs.
- **Contact:** unified CTAs ("Let's make it happen" / "Construisons-le ensemble" / "Packen wir es an"; "Explore the experience"); Instagram more visible (footer, form, thanks page); group size as a list; address removed from the footer (still in Legal).
- **Photos:** curation pass (low-resolution images removed from galleries, Portugal hero replaced).
- **SEO:** unique titles/descriptions checked; Organization (TravelAgency) + WebSite + BreadcrumbList + TouristTrip + FAQPage; "availability" removed from the offer.

## Checks
51 pages built · 0 overflow 320–1440 px (EN/FR/DE) · 0 broken internal links · 24/24 CTAs pre-fill the form · form (Netlify, honeypot, subject, no budget) OK · language change keeps the page · 0 duplicate titles/descriptions, 1 H1 per page, canonical + hreflang ×4 · sitemap 48 URLs · **noindex active** · 0 Gmail · Bryan Zooler / Stéphane Pfeuti OK · GA4: no Google request before consent.

## Blockers before production
1. SwissForce: official logo + website to confirm (two different Swiss companies use this name).
2. GA4 Measurement ID.
3. Netlify › Forms: email notification to hello@organixevents.com + real test submission.
4. Legal / Privacy validation.
5. Before go-live: remove noindex (`SITE_INDEXABLE=true`) and connect the domain.

---

# V1.0 Production Candidate (final polish)
- Spacing between phrases fixed at the source: `lines()` and the build now separate adjacent elements (0 glued occurrences in the 51 pages).
- Partners (home + page): official logos with consistent sizes, verified external links. SwissForce stays as a wordmark until the official logo/site is provided.
- North Macedonia: ~10–15% of repetition removed (FAQ 10 → 8, shorter texts), no commercial information lost; "+" removed before the heliski option.
- Portugal: "Small groups · usually 4 to 6 riders". Norway: "For several years".
- Final proofread: no internal notes, sources or placeholders in customer-facing text.
