#!/usr/bin/env node
/**
 * OrganixEvents static site build — zero dependencies (Node >= 18).
 *
 *   node scripts/build.mjs              → dist/ (Netlify)
 *   PREVIEW=1 node scripts/build.mjs    → dist-preview/ (file-based links, webp only)
 *
 * Environment:
 *   SITE_URL        absolute origin used for canonical / hreflang / sitemap
 *                   (defaults to site.json siteUrl = https://organixevents.com)
 *   SITE_INDEXABLE  "false" to block search engines (used for Netlify deploy previews only)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { layout } from '../src/templates/layout.mjs';
import { tr, jsonLd } from '../src/templates/lib.mjs';
import { homePage } from '../src/templates/pages/home.mjs';
import { northMacedoniaPage } from '../src/templates/pages/north-macedonia.mjs';
import { winterPage, summerPage } from '../src/templates/pages/seasons.mjs';
import { experiencePage } from '../src/templates/pages/experience.mjs';
import { customPage, aboutPage, partnersPage, enquirePage, thanksPage, notFoundPage, legalPage } from '../src/templates/pages/other.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PREVIEW = process.env.PREVIEW === '1';
const OUT = path.join(ROOT, PREVIEW ? 'dist-preview' : 'dist');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

// ---------- content ----------
const site = readJson('src/content/site.json');
const media = readJson('src/content/media.json');
const inspirations = readJson('src/content/inspirations.json');
const mediaAlt = readJson('src/content/media-alt.json');
const SITE_URL = (process.env.SITE_URL || site.siteUrl).replace(/\/$/, '');
const INDEXABLE = process.env.SITE_INDEXABLE !== 'false';
const VERSION = Date.now().toString(36);

const experiences = {};
for (const f of fs.readdirSync(path.join(ROOT, 'src/content/experiences'))) {
  if (!f.endsWith('.json')) continue;
  const e = readJson(`src/content/experiences/${f}`);
  experiences[e.slug] = e;
}
const ui = Object.fromEntries(site.locales.map((l) => [l.code, readJson(`src/i18n/${l.code}.json`)]));

function loadPage(name, locale) {
  const p = `src/content/pages/${name}.${locale}.json`;
  if (fs.existsSync(path.join(ROOT, p))) return { data: readJson(p), fallback: false };
  return { data: readJson(`src/content/pages/${name}.en.json`), fallback: true };
}
/** Which locales have real (non-fallback) copy for a page */
const translatedLocales = (name) =>
  site.locales.map((l) => l.code).filter((code) => fs.existsSync(path.join(ROOT, `src/content/pages/${name}.${code}.json`)));

const svgs = {};
for (const f of fs.readdirSync(path.join(ROOT, 'public/brand'))) {
  if (f.endsWith('.svg')) svgs[f.replace('.svg', '')] = fs.readFileSync(path.join(ROOT, 'public/brand', f), 'utf8');
}

// X symbol as a normalised clipPath (objectBoundingBox) — used to mask photos with the official mark.
function xMask() {
  const s = svgs['organix-symbol'];
  const [vx, vy, vw, vh] = s.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const ds = [...s.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
  const norm = ds.map((d) => {
    let i = 0;
    return d.replace(/-?\d+\.?\d*/g, (n) => {
      const v = Number(n);
      const out = i % 2 === 0 ? (v - vx) / vw : (v - vy) / vh;
      i++;
      return out.toFixed(5);
    });
  });
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><clipPath id="x-mask" clipPathUnits="objectBoundingBox"><path d="${norm.join(' ')}"/></clipPath></defs></svg>`;
}
const X_MASK = xMask();

// ---------- routes ----------
const expRoutes = Object.values(experiences)
  .filter((e) => e.template === 'experience' && e.status !== 'hidden')
  .map((e) => ({ route: e.path, pageKey: `exp:${e.slug}`, render: (ctx) => experiencePage(ctx, e), copy: null, exp: e }));

const ROUTES = [
  { route: '', copy: 'home', render: homePage },
  { route: 'north-macedonia/', copy: 'north-macedonia', render: northMacedoniaPage },
  { route: 'winter/', copy: 'winter', render: winterPage },
  { route: 'summer/', copy: 'summer', render: summerPage },
  ...expRoutes,
  { route: 'custom/', copy: 'custom', render: customPage },
  { route: 'about/', copy: 'about', render: aboutPage },
  { route: 'partners/', copy: 'partners', render: partnersPage },
  { route: 'enquire/', copy: 'enquire', render: enquirePage },
  { route: 'enquire/thanks/', copy: 'enquire', render: thanksPage, noSitemap: true },
  { route: 'legal/', copy: 'legal', render: (ctx) => legalPage(ctx, 'legal') },
  { route: 'privacy/', copy: 'privacy', render: (ctx) => legalPage(ctx, 'privacy') },
];

/** Translation status of a route: which locales are genuinely translated */
function routeLocales(r) {
  if (r.copy) return translatedLocales(r.copy);
  // experience pages: translated when title + longDescription exist in that locale
  return site.locales.map((l) => l.code).filter((code) => r.exp.longDescription?.[code] && r.exp.title?.[code]);
}

// ---------- context ----------
function makeCtx(locale, route, missing) {
  const depth = (locale + '/' + route).split('/').filter(Boolean).length;
  const prefix = '../'.repeat(depth);
  let usedFallback = false;
  const ctx = {
    site, media, inspirations, svgs, locale, route, missing,
    preview: PREVIEW,
    version: VERSION,
    indexable: INDEXABLE && !PREVIEW,
    ui: ui[locale],
    uiEn: ui.en,
    alt: (key) => (locale !== 'en' && mediaAlt[key]?.[locale]) || media[key]?.alt || '',
    exp: experiences,
    visible: (slugs) => slugs.filter((sl) => experiences[sl] && experiences[sl].status !== 'hidden'),
    xMaskDefs: X_MASK,
    t: (v) => {
      if (v && typeof v === 'object' && !Array.isArray(v) && 'en' in v && !(locale in v)) usedFallback = true;
      return tr(v, locale);
    },
    page: (name) => {
      const p = loadPage(name, locale);
      if (p.fallback) usedFallback = true;
      return p.data;
    },
    get usedFallback() { return usedFallback; },
    url: (target, loc = locale) => {
      let u = `${prefix}${loc}/${target}`;
      if (PREVIEW) u += 'index.html';
      return u;
    },
    asset: (p) => prefix + p,
    abs: (loc, target) => `${SITE_URL}/${loc}/${target}`,
    absAsset: (p) => `${SITE_URL}/${p}`,
    preloadHero: (key, mobileKey) => {
      if (PREVIEW || !media[key]) return '';
      const m = media[key];
      const set = m.widths.map((w) => `/media/${key}/${w}.avif ${w}w`).join(', ');
      let out = `<link rel="preload" as="image" type="image/avif" imagesrcset="${set}" imagesizes="100vw"${mobileKey ? ' media="(min-aspect-ratio: 4/5)"' : ''} fetchpriority="high">`;
      if (mobileKey && media[mobileKey]) {
        const mm = media[mobileKey];
        out += `<link rel="preload" as="image" type="image/avif" imagesrcset="${mm.widths.map((w) => `/media/${mobileKey}/${w}.avif ${w}w`).join(', ')}" imagesizes="100vw" media="(max-aspect-ratio: 4/5)" fetchpriority="high">`;
      }
      return out;
    },
    breadcrumbLd: (trail) =>
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}/${locale}/${p}` })),
      }),
  };
  return ctx;
}

// ---------- build ----------
function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function copyDir(src, dst, filter = () => true) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d, filter);
    else if (filter(s)) fs.copyFileSync(s, d);
  }
}
function write(rel, content) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

rmrf(OUT);
copyDir(path.join(ROOT, 'public'), OUT, (f) => !(PREVIEW && f.endsWith('.avif')) && !(PREVIEW && /\/(2400)\.webp$/.test(f)));
copyDir(path.join(ROOT, 'src/assets'), path.join(OUT, 'assets'));

const missing = new Set();
const sitemap = [];
const report = [];

for (const r of ROUTES) {
  const locs = routeLocales(r);
  for (const l of site.locales) {
    const ctx = makeCtx(l.code, r.route, missing);
    const page = r.render(ctx);
    const fallback = ctx.usedFallback && l.code !== 'en';
    page.fallback = fallback;
    // hreflang only between genuinely translated versions; untranslated → canonical to EN + noindex
    page.alternateLocales = locs.length > 1 ? locs : [];
    if (fallback) {
      page.noindex = true;
      page.canonicalLocale = 'en';
      page.alternateLocales = [];
    }
    let html = layout(ctx, page, page.body);
    // French typography: narrow no-break space before ? ! : ; (text nodes only)
    // Text separation at the source: a closing text-level/block tag directly followed by another tag gets a newline,
    // so words from adjacent elements never glue together in extracted text (readers, previews, search snippets).
    html = html.replace(/<\/(p|h[1-6]|li|dt|dd|span|a|strong|summary|figure|figcaption|legend|label|small|em|b|i|div|section|article|header|footer|ul|ol|dl|nav|details|button|address|blockquote|time)>(?=<(?!\/))/g, '</$1>\n');
    if (l.code === 'fr') html = html.replace(/>([^<]+)</g, (m, t) => '>' + t.replace(/ ([?!:;])/g, '\u202F$1') + '<');
    write(`${l.code}/${r.route}index.html`, html);
    report.push(`${l.code}/${r.route}${fallback ? '  (EN fallback, noindex)' : ''}`);
    if (!r.noSitemap && !fallback && !page.noindex) sitemap.push({ loc: l.code, route: r.route, alts: page.alternateLocales });
  }
}

// 404
{
  const base = makeCtx('en', '', missing);
  // 404 lives at the root and is served for any path: use absolute URLs
  const ctx = Object.assign(Object.create(Object.getPrototypeOf(base)), base, { url: (t, loc = 'en') => `/${loc}/${t}`, asset: (p) => `/${p}` });
  const page = notFoundPage(ctx);
  const html = layout(ctx, page, page.body);
  write('404.html', html.replace(/<\/(p|h[1-6]|li|dt|dd|span|a|strong|summary|figure|figcaption|legend|label|small|em|b|i|div|section|article|header|footer|ul|ol|dl|nav|details|button|address|blockquote|time)>(?=<(?!\/))/g, '</$1>\n'));
}

// Root: language redirect (Netlify handles it server-side too, see _redirects)
if (PREVIEW) {
  // Artifact preview entry page: content only (the host adds the document skeleton)
  write('index.html', `<title>OrganixEvents V0</title>
<style>:root{color-scheme:dark}body{background:#0d0d12;color:#f5f4f8;font-family:Montserrat,Poppins,system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;padding-inline:16px}a{color:#beb5e1}</style>
<meta http-equiv="refresh" content="0; url=en/index.html">
<p><a href="en/index.html">OrganixEvents — V0.1 preview</a></p>
<script>location.replace('en/index.html')</script>`);
} else write(
  'index.html',
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>OrganixEvents</title>
<meta name="robots" content="noindex"><link rel="canonical" href="${SITE_URL}/en/">
<meta http-equiv="refresh" content="0; url=en/${PREVIEW ? 'index.html' : ''}">
<script>location.replace('en/${PREVIEW ? 'index.html' : ''}')</script></head>
<body style="background:#0d0d12"><a href="en/${PREVIEW ? 'index.html' : ''}">OrganixEvents</a></body></html>`
);

if (!PREVIEW) {
  // sitemap with hreflang alternates
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap
  .map(
    (s) => `  <url>
    <loc>${SITE_URL}/${s.loc}/${s.route}</loc>${s.alts.length ? '\n' : ''}${s.alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${SITE_URL}/${a}/${s.route}"/>`).join('\n')}${
      s.alts.length ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/${s.route}"/>` : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>
`;
  write('sitemap.xml', xml);
  write('robots.txt', INDEXABLE ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` : `User-agent: *\nDisallow: /\n`);
  write(
    '_headers',
    `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
${INDEXABLE ? '' : '  X-Robots-Tag: noindex\n'}
/media/*
  Cache-Control: public, max-age=31536000, immutable
/brand/*
  Cache-Control: public, max-age=2592000
/assets/*
  Cache-Control: public, max-age=31536000, immutable
`
  );
  // Root → language (browser preference). FR / DE get a rule once their home page exists.
  const langRules = ['fr', 'de']
    .filter((l) => fs.existsSync(path.join(ROOT, `src/content/pages/home.${l}.json`)))
    .map((l) => `/  /${l}/  302!  Language=${l}`);
  write('_redirects', ['# Root → language (browser preference), default English', ...langRules, '/  /en/  302!', ''].join('\n'));
}

const fb = report.filter((r) => r.includes('fallback'));
console.log(`Built ${report.length} pages → ${path.relative(ROOT, OUT)}/ (${PREVIEW ? 'preview' : 'netlify'}, ${INDEXABLE ? 'indexable' : 'noindex'})`);
if (fb.length) console.log(`\n${fb.length} page(s) still use the English fallback:\n  ` + fb.join('\n  '));
if (process.env.VERBOSE) console.log(report.join('\n'));
if (missing.size) {
  console.log('\nMissing assets (placeholders shown):');
  for (const m of [...missing].sort()) console.log('  - ' + m);
}
