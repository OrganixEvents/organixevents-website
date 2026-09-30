// Shared helpers for the static templates.

export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Join template fragments, dropping false/null/undefined. */
export const h = (strings, ...values) =>
  strings.reduce((out, str, i) => {
    let v = values[i - 1];
    if (Array.isArray(v)) v = v.filter((x) => x !== false && x != null).join('');
    if (v === false || v == null) v = '';
    return out + v + str;
  });

/** Pick a localised value: {en, fr, de} -> string. Plain strings pass through. */
export function tr(value, locale) {
  if (value == null) return value;
  if (typeof value !== 'object' || Array.isArray(value)) return value;
  if (!('en' in value)) return value;
  return value[locale] ?? value.en;
}

/** Break an array of lines into <span class="line"> elements. */
/** Longest word length — used by CSS to scale display type so no word overflows its column. */
export const longest = (t = '') => Math.max(1, ...String(t).split(/[\s\u2013\u2014/]+/).map((w) => [...w].length));
/** A single heading-sized text that shrinks to fit its container when a word is very long. */
export const fit = (t) => `<span class="fit" style="--fit:${longest(t)}">${esc(t)}</span>`;

/** Break an array of lines into <span class="line"> elements (each auto-fitted). */
export const lines = (arr) =>
  (Array.isArray(arr) ? arr : [arr]).map((l) => `<span class="line fit" style="--fit:${longest(l)}">${esc(l)}</span>`).join('');

export function formatPrice(n, currency = 'CHF', locale = 'en') {
  const loc = { en: 'en-GB', fr: 'fr-CH', de: 'de-CH' }[locale] || 'en-GB';
  return `${currency} ${new Intl.NumberFormat(loc).format(n)}`;
}

export function formatDateRange(start, end, locale = 'en') {
  const loc = { en: 'en-GB', fr: 'fr-CH', de: 'de-CH' }[locale] || 'en-GB';
  const f = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long' });
  const y = new Intl.DateTimeFormat(loc, { year: 'numeric' });
  const s = new Date(start + 'T12:00:00Z');
  const e = new Date(end + 'T12:00:00Z');
  return `${f.format(s)} – ${f.format(e)} ${y.format(e)}`;
}

/**
 * Responsive <picture> from the media manifest.
 * key: media key, or null for an explicit placeholder.
 * opts: { sizes, cls, eager, alt, mobile (media key for portrait screens), ratio }
 */
export function picture(ctx, key, opts = {}) {
  const { sizes = '100vw', cls = '', eager = false, mobile = null } = opts;
  if (!key || !ctx.media[key]) {
    ctx.missing.add(key ? `media key "${key}"` : `photo for ${ctx.route}`);
    return `<div class="ph ${esc(cls)}" role="img" aria-label="${esc(ctx.ui.common.placeholder)}"><span>${esc(opts.placeholderLabel || ctx.ui.common.placeholder)}</span></div>`;
  }
  const m = ctx.media[key];
  const formats = ctx.preview ? ['webp'] : ['avif', 'webp'];
  const widths = m.widths.filter((w) => !ctx.preview || w <= 1600);
  const set = (k, fmt, ws) => ws.map((w) => `${ctx.asset(`media/${k}/${w}.${fmt}`)} ${w}w`).join(', ');
  let sources = '';
  if (mobile && ctx.media[mobile]) {
    const mm = ctx.media[mobile];
    const mw = mm.widths.filter((w) => !ctx.preview || w <= 1600);
    for (const fmt of formats)
      sources += `<source media="(max-aspect-ratio: 4/5)" type="image/${fmt}" srcset="${set(mobile, fmt, mw)}" sizes="${esc(sizes)}">`;
  }
  for (const fmt of formats) sources += `<source type="image/${fmt}" srcset="${set(key, fmt, widths)}" sizes="${esc(sizes)}">`;
  const mid = widths.find((w) => w >= 800) || widths[widths.length - 1];
  const alt = opts.alt ?? (ctx.alt ? ctx.alt(key) : m.alt);
  const style = `object-position:${m.focal};background-color:${m.color}`;
  return `<picture class="pic ${esc(cls)}">${sources}<img src="${ctx.asset(`media/${key}/${mid}.webp`)}" width="${m.width}" height="${m.height}" alt="${esc(alt)}" style="${style}" ${
    eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'
  }></picture>`;
}

/** Inline brand SVG (read at build time) */
export const brand = (ctx, name, cls = '', label = 'Organix') =>
  ctx.svgs[name].replace('<svg ', `<svg class="${esc(cls)}" aria-label="${esc(label)}" focusable="false" `).replace(' aria-label="Organix"', '');

export const arrow = `<svg class="ic-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/></svg>`;

export function button(href, label, variant = 'primary', attrs = '') {
  return `<a class="btn btn--${variant}" href="${href}" ${attrs}><span>${esc(label)}</span>${arrow}</a>`;
}

/** Structured data helper */
export const jsonLd = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
