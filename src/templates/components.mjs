import { esc, lines, fit, picture, button, arrow, formatPrice, brand } from './lib.mjs';

/** Full-bleed cinematic hero. */
export function hero(ctx, { image, imageMobile, eyebrow, title, lead, sub, ctas = [], size = 'full', align = 'bottom', extra = '' }) {
  return `<section class="hero hero--${size} hero--${align}" data-hero>
  <div class="hero__media" data-parallax>${picture(ctx, image, { eager: true, mobile: imageMobile, cls: 'hero__img', sizes: '100vw' })}</div>
  <div class="hero__shade" aria-hidden="true"></div>
  <div class="hero__content wrap">
    ${eyebrow ? `<p class="eyebrow rise" style="--r:1">${esc(eyebrow)}</p>` : ''}
    <h1 class="display rise" style="--r:2">${lines(title)}</h1>
    ${sub ? `<p class="hero__sub rise" style="--r:3">${lines(sub)}</p>` : ''}
    ${lead ? `<p class="hero__lead rise" style="--r:4">${esc(lead)}</p>` : ''}
    ${ctas.length ? `<div class="btn-row rise" style="--r:5">${ctas.join('')}</div>` : ''}
    ${extra}
  </div>
</section>`;
}

export function sectionHead({ eyebrow, title, lead, cls = '', tag = 'h2' }) {
  return `<header class="section-head ${cls}">
  ${eyebrow ? `<p class="eyebrow reveal">${esc(eyebrow)}</p>` : ''}
  <${tag} class="title reveal">${lines(title)}</${tag}>
  ${lead ? `<p class="lead reveal">${Array.isArray(lead) ? lines(lead) : esc(lead)}</p>` : ''}
</header>`;
}

/** Image inside the official Organix X symbol (two facing chevrons). */
export function xFrame(ctx, image, cls = '') {
  return `<div class="xframe ${cls}" aria-hidden="false">${picture(ctx, image, { sizes: '(min-width: 900px) 45vw, 90vw', cls: 'xframe__img' })}</div>`;
}

export function priceTag(ctx, exp, { note, compact = false } = {}) {
  if (!exp.priceFrom) return '';
  return `<div class="price ${compact ? 'price--compact' : ''}">
  <span class="price__label">${esc(ctx.ui.common.from)}</span>
  <span class="price__value">${esc(formatPrice(exp.priceFrom, exp.currency, ctx.locale))}</span>
  <span class="price__unit">${esc(exp.priceUnit ? ctx.t(exp.priceUnit) : ctx.ui.common.perPerson)}</span>
  ${note ? `<span class="price__note">${esc(note)}</span>` : ''}
</div>`;
}

/** Card linking to an experience detail page. */
export function experienceCard(ctx, exp, { label, size = 'md', index } = {}) {
  const img = exp.cardImage || exp.heroImage;
  return `<article class="xcard xcard--${size} reveal" ${index != null ? `style="--d:${index}"` : ''}>
  <a class="xcard__link" href="${ctx.url(exp.path)}">
    <div class="xcard__media">${picture(ctx, img, { sizes: size === 'lg' ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 900px) 33vw, 100vw' })}</div>
    <div class="xcard__body">
      <p class="xcard__kicker">${esc(label || ctx.t(exp.universe) || '')}</p>
      <h3 class="xcard__title">${fit(ctx.t(exp.shortTitle))}</h3>
      <p class="xcard__text">${esc(ctx.t(exp.shortDescription))}</p>
      <span class="xcard__more">${esc(ctx.ui.common.discover)} ${arrow}</span>
    </div>
  </a>
</article>`;
}

export function partnersStrip(ctx, { title, compact = false } = {}) {
  const items = ctx.site.partners
    .map((p) => {
      const inner = p.logo
        ? `<img src="${ctx.asset(p.logo)}" alt="${esc(p.name)}" loading="lazy">`
        : `<span class="partner__name">${fit(p.name)}</span>`;
      if (!p.logo) ctx.missing.add(`official partner logo: ${p.name}`);
      const body = p.url ? `<a class="partner__link" href="${p.url}" target="_blank" rel="noopener" data-track="partner_click" data-location="${esc(p.name)}">${inner}</a>` : inner;
      return `<li class="partner ${p.logo ? '' : 'partner--pending'}">${body}</li>`;
    })
    .join('');
  return `<section class="partners ${compact ? 'partners--compact' : ''}" aria-labelledby="partners-title">
  <div class="wrap">
    <h2 class="eyebrow partners__title" id="partners-title">${esc(title)}</h2>
    <ul class="partners__list">${items}</ul>
  </div>
</section>`;
}

export function finalCta(ctx, { title, lead, cta, image, interest, location }) {
  const href = ctx.url('enquire/') + (interest ? `?interest=${interest}` : '');
  return `<section class="final">
  <div class="final__media">${picture(ctx, image, { sizes: '100vw' })}</div>
  <div class="final__shade" aria-hidden="true"></div>
  <div class="final__content wrap">
    <h2 class="display display--md reveal">${lines(title)}</h2>
    ${lead ? `<p class="final__lead reveal">${Array.isArray(lead) ? lines(lead) : esc(lead)}</p>` : ''}
    <div class="btn-row reveal">${button(href, cta, 'primary', `data-track="enquiry_cta" data-location="${esc(location || 'final')}"`)}</div>
  </div>
</section>`;
}

export function inspirationGrid(ctx, { note, season, cta = true } = {}) {
  const items = ctx.inspirations.items.filter((i) => !season || i.season === season);
  return `<ul class="insp" role="list">${items
    .map(
      (it, i) => `<li class="insp__item reveal" style="--d:${i % 4}">
      <span class="insp__tag">${esc(ctx.ui.common.inspiration)}</span>
      <span class="insp__title">${fit(ctx.t(it.title))}</span>
      <span class="insp__sport">${esc(ctx.t(it.sport))}</span>
      ${brand(ctx, 'organix-symbol', 'insp__x', '')}
    </li>`
    )
    .join('')}${cta ? `<li class="insp__item insp__item--cta reveal" style="--d:3"><a class="insp__cta" href="${ctx.url('enquire/')}?interest=custom" data-track="enquiry_cta" data-location="inspiration" data-interest="custom">
      <span class="insp__tag">${esc(ctx.ui.nav.custom)}</span>
      <span class="insp__title">${esc(ctx.ui.common.yourIdea)}</span>
      <span class="insp__sport">${esc(ctx.ui.common.tellUs)} ${arrow}</span>
      ${brand(ctx, 'organix-symbol', 'insp__x', '')}
    </a></li>` : ''}</ul>${note ? `<p class="insp__note">${esc(note)}</p>` : ''}`;
}

export function checkList(items, cls = '') {
  return `<ul class="checks ${cls}">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

export function breadcrumb(ctx, trail) {
  // trail: [[label, path], ...] — last item is current page
  return `<nav class="crumbs wrap" aria-label="${esc(ctx.ui.common.breadcrumb)}"><ol>${trail
    .map(([label, path], i) =>
      i === trail.length - 1
        ? `<li aria-current="page">${esc(label)}</li>`
        : `<li><a href="${ctx.url(path)}">${esc(label)}</a></li>`
    )
    .join('')}</ol></nav>`;
}
