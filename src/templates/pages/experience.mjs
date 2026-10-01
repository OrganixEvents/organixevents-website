import { esc, lines, fit, picture, button, arrow, jsonLd, brand, formatDateRange, formatPrice } from '../lib.mjs';
import { hero, sectionHead, priceTag, finalCta, checkList, breadcrumb } from '../components.mjs';

/** Generic, data-driven experience page (Georgia, Norway, Alps, Portugal, Camps, Adventures). */
export function experiencePage(ctx, e) {
  const u = ctx.ui;
  const seasonKey = e.season; // winter | summer
  const seasonPath = `${seasonKey}/`;
  const enquire = ctx.url('enquire/') + `?interest=${e.cta.interest}` + (e.cta.option ? `&option=${encodeURIComponent(e.cta.option)}` : '');
  const trail = [[u.common.breadcrumbHome, ''], [u.nav[seasonKey], seasonPath], [ctx.t(e.shortTitle), e.path]];

  const facts = [];
  if (e.duration) facts.push([u.common.duration, ctx.t(e.duration)]);
  if (e.groupSize?.note) facts.push([u.common.groupSize, ctx.t(e.groupSize.note)]);
  if (e.dates?.length) facts.push([u.common.dates, e.dates.map((d) => formatDateRange(d.start, d.end, ctx.locale)).join(' · ')]);
  else if (e.seasonWindow) facts.push([u.common.season, ctx.t(e.seasonWindow)]);
  if (e.level) facts.push([u.common.level, ctx.t(e.level)]);
  if (e.priceFrom) facts.push([u.common.price, `${u.common.from} ${formatPrice(e.priceFrom, e.currency, ctx.locale)} ${e.priceUnit ? ctx.t(e.priceUnit) : u.common.perPerson}` + (e.priceNote ? `, ${ctx.t(e.priceNote)}` : '')]);
  else if (e.priceOnRequest) facts.push([u.common.price, u.common.onRequest]);
  if (e.region) facts.push(['', ctx.t(e.region)]);
  if (e.partner) facts.push([u.common.partner, e.partner.name]);

  const intro = `<section class="section xintro" aria-label="${esc(ctx.t(e.shortTitle))}">
  <div class="wrap xintro__grid">
    <p class="big-quote reveal">${esc(ctx.t(e.longDescription))}</p>
    <dl class="facts facts--stack reveal">${facts
      .map(([k, v]) => `<div>${k ? `<dt>${esc(k)}</dt>` : ''}<dd>${esc(v)}</dd></div>`)
      .join('')}</dl>
  </div>
</section>`;

  const blocks = (e.blocks || []).map((b) => renderBlock(ctx, e, b)).join('\n');

  const inc =
    e.included && !(e.blocks || []).some((b) => b.field === 'included')
      ? `<section class="section included"><div class="wrap"><div class="included__grid">
      <div class="reveal"><h2 class="included__h">${esc(u.common.included)}</h2>${checkList(ctx.t(e.included))}</div>
      ${e.notIncluded ? `<div class="reveal"><h2 class="included__h included__h--muted">${esc(u.common.notIncluded)}</h2>${checkList(ctx.t(e.notIncluded), 'checks--muted')}</div>` : ''}
    </div></div></section>`
      : '';

  const gallery = e.gallery?.length
    ? `<section class="gallery" aria-label="${esc(u.common.gallery)}"><div class="gallery__track" style="--cols:${[0, 1, 2, 3, 4, 5, 3, 4, 4, 3][e.gallery.length] || 4}">${e.gallery
        .map((k, i) => `<figure class="gallery__item reveal" style="--d:${i % 4}">${picture(ctx, k, { sizes: '(min-width: 900px) 30vw, 70vw' })}</figure>`)
        .join('')}</div></section>`
    : '';

  const finalImg = e.gallery?.[0] || e.heroImage || 'nm-sunset';

  return {
    title: ctx.t(e.seo.title),
    description: ctx.t(e.seo.description),
    bodyClass: `exp exp-${e.slug}`,
    destination: e.slug,
    ogImage: e.heroImage,
    preload: e.heroImage ? ctx.preloadHero(e.heroImage) : '',
    jsonLd: [
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: ctx.t(e.title),
        description: ctx.t(e.shortDescription),
        url: ctx.abs(ctx.locale, e.path),
        ...(e.heroImage ? { image: ctx.absAsset(`media/${e.heroImage}/${ctx.media[e.heroImage].widths.at(-1)}.webp`) } : {}),
        provider: { '@type': 'TravelAgency', name: ctx.site.name, url: ctx.abs(ctx.locale, '') },
      }),
      ctx.breadcrumbLd(trail),
    ],
    body: [
      hero(ctx, {
        image: e.heroImage,
        eyebrow: ctx.t(e.universe),
        title: [ctx.t(e.shortTitle)],
        sub: [ctx.t(e.tagline)],
        size: 'tall',
        ctas: [button(enquire, u.common.startConversation, 'primary', `data-track="enquiry_cta" data-location="exp-hero" data-interest="${e.cta.interest}"`)],
      }),
      breadcrumb(ctx, trail),
      intro,
      blocks,
      inc,
      gallery,
      finalCta(ctx, {
        title: [ctx.t(e.cta.label)],
        lead: u.enquiry.lead,
        cta: u.common.startConversation,
        image: finalImg,
        interest: e.cta.interest,
        location: `exp-${e.slug}-final`,
      }),
    ].join('\n'),
  };
}

function renderBlock(ctx, e, b) {
  const title = ctx.t(b.title);
  switch (b.type) {
    case 'points':
      return `<section class="section points"><div class="wrap">
        ${sectionHead({ title })}
        <ol class="numbered numbered--${b.items.length}">${b.items
          .map((it, i) => `<li class="reveal" style="--d:${i}"><span class="numbered__n">0${i + 1}</span><h3>${esc(ctx.t(it.title))}</h3>${it.text ? `<p>${esc(ctx.t(it.text))}</p>` : ''}</li>`)
          .join('')}</ol></div></section>`;
    case 'options':
      return `<section class="section options"><div class="wrap">
        ${sectionHead({ title })}
        <div class="options__grid">${b.items
          .map((it, i) => `<article class="option reveal" style="--d:${i}">
            <div class="option__media">${picture(ctx, it.image, { sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
            <div class="option__body"><span class="option__n">0${i + 1}</span><h3>${fit(ctx.t(it.title))}</h3><p>${esc(ctx.t(it.text))}</p></div>
          </article>`)
          .join('')}</div></div></section>`;
    case 'story':
      return `<section class="story"><div class="wrap story__grid">
        <div class="story__media reveal">${picture(ctx, b.image, { sizes: '(min-width: 900px) 45vw, 100vw' })}</div>
        <div class="story__copy">
          <p class="eyebrow reveal">${esc(ctx.t(b.eyebrow))}</p>
          <h2 class="title reveal">${lines(title)}</h2>
          <p class="reveal">${esc(ctx.t(b.text))}</p>
        </div></div></section>`;
    case 'chips':
      return `<section class="section chips-block"><div class="wrap">
        ${sectionHead({ title, lead: ctx.t(b.text) })}
        <ul class="chips chips--lg reveal">${(ctx.t(e[b.field]) || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </div></section>`;
    case 'list':
      return `<section class="section list-block"><div class="wrap list-block__grid">
        ${sectionHead({ title })}
        <ul class="biglist">${(ctx.t(e[b.field]) || []).map((i, n) => `<li class="reveal" style="--d:${n % 4}"><span>${String(n + 1).padStart(2, '0')}</span>${esc(i)}</li>`).join('')}</ul>
      </div></section>`;
    case 'photos':
      return `<section class="photo-band" aria-label="${esc(ctx.ui.common.gallery)}"><div class="photo-band__grid">${b.images
        .map((k) => `<figure class="photo-band__item reveal">${picture(ctx, k, { sizes: '(min-width: 900px) 25vw, 50vw' })}</figure>`)
        .join('')}</div></section>`;
    case 'note':
      return `<section class="section note-block"><div class="wrap narrow"><p class="eyebrow reveal">${esc(ctx.t(b.eyebrow))}</p><h2 class="title reveal">${lines(title)}</h2>${b.text ? `<p class="lead reveal">${esc(ctx.t(b.text))}</p>` : ''}</div></section>`;
    case 'camps': {
      const camps = e.camps || [];
      const any = camps.some((c) => c.active);
      return `<section class="section camps"><div class="wrap">
        ${sectionHead({ title, lead: any ? null : ctx.ui.common.comingSoon })}
        <ul class="camps__list">${camps
          .map((c) => `<li class="camp reveal ${c.active ? 'is-active' : ''}"><h3>${esc(ctx.t(c.title))}</h3><p class="status ${c.active ? 'status--on' : ''}">${esc(c.active ? ctx.ui.common.active : ctx.ui.common.comingSoon)}</p>${c.dates ? `<p>${esc(c.dates)}</p>` : ''}</li>`)
          .join('')}</ul></div></section>`;
    }
    default:
      return '';
  }
}
