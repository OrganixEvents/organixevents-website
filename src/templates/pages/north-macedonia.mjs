import { esc, lines, fit, picture, button, arrow, jsonLd, brand, formatPrice, formatDateRange } from '../lib.mjs';
import { hero, sectionHead, xFrame, priceTag, finalCta, checkList, breadcrumb } from '../components.mjs';

export function northMacedoniaPage(ctx) {
  const c = ctx.page('north-macedonia');
  const e = ctx.exp['north-macedonia'];
  const u = ctx.ui;
  const enquire = ctx.url('enquire/') + '?interest=north-macedonia';
  const track = (loc) => `data-track="enquiry_cta" data-location="${loc}" data-interest="north-macedonia"`;
  const heroImg = c.hero.image || e.heroImage;
  const heroImgM = c.hero.imageMobile || e.heroImageMobile;

  const heroHtml = hero(ctx, {
    image: heroImg,
    imageMobile: heroImgM,
    eyebrow: c.hero.eyebrow,
    title: c.hero.title,
    sub: c.hero.message,
    ctas: [button(enquire, c.hero.ctaPrimary, 'primary', track('nm-hero')), button('#example-week', c.hero.ctaSecondary, 'ghost')],
    extra: `<dl class="hero__facts reveal">
      <div><dt>${esc(u.common.from)}</dt><dd>${esc(formatPrice(e.priceFrom, e.currency, ctx.locale))} <small>${esc(u.common.perPerson)}</small></dd></div>
      <div><dt>${esc(u.common.duration)}</dt><dd>${esc(u.common.flexible)}</dd></div>
      <div><dt>${esc(u.common.groupSize)}</dt><dd>≤ ${e.groupSize.absoluteMax}</dd></div>
    </dl>`,
  });

  const core = `<section class="core" aria-labelledby="core-title">
  <div class="wrap core__grid">
    <h2 class="display display--xl reveal" id="core-title">${lines(c.core.title)}</h2>
    <p class="core__text reveal">${esc(c.core.text)}</p>
  </div>
</section>`;

  const level = c.level ? `<section class="statement" aria-labelledby="level-title">
  <div class="wrap statement__grid">
    <div class="statement__copy">
      <p class="eyebrow eyebrow--flag reveal">${esc(c.level.eyebrow)}</p>
      <h2 class="display display--lg reveal" id="level-title">${lines(c.level.title)}</h2>
      <p class="statement__text reveal">${esc(c.level.text)}</p>
    </div>
    <div class="statement__media reveal">${picture(ctx, c.level.image, { sizes: '(min-width: 900px) 40vw, 100vw' })}</div>
  </div>
</section>` : '';

  const band = c.band ? `<section class="photo-band" aria-label="${esc(u.common.gallery)}"><div class="photo-band__grid">${c.band
    .map((k, i) => `<figure class="photo-band__item reveal" style="--d:${i}">${picture(ctx, k, { sizes: '(min-width: 900px) 25vw, 50vw' })}</figure>`)
    .join('')}</div></section>` : '';

  const gear = c.gear ? `<section class="section gear" aria-labelledby="gear-title">
  <div class="wrap gear__grid">
    <div class="gear__media reveal">${picture(ctx, c.gear.image, { sizes: '(min-width: 900px) 40vw, 100vw' })}</div>
    <div class="gear__copy">
      <p class="eyebrow reveal">${esc(c.gear.eyebrow)}</p>
      <h2 class="display display--lg reveal" id="gear-title">${lines(c.gear.title)}</h2>
      <p class="reveal">${esc(c.gear.text)}</p>
      <ul class="chips reveal">${c.gear.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      <p class="note note--flag reveal">${brand(ctx, 'organix-symbol', 'note__x', '')}<span>${esc(c.gear.note)}</span></p>
    </div>
  </div>
</section>` : '';

  const terrain = `<section class="section terrain" aria-labelledby="terrain-title">
  <div class="wrap terrain__grid">
    <div class="terrain__copy">
      ${sectionHead({ eyebrow: c.terrain.eyebrow, title: c.terrain.title }).replace('class="title', 'id="terrain-title" class="title')}
      <p class="reveal">${esc(c.terrain.text)}</p>
      <dl class="facts reveal">${c.terrain.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>
    </div>
    <div class="terrain__media reveal">${picture(ctx, c.terrain.image, { sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
  </div>
</section>`;

  const difference = `<section class="section difference" aria-labelledby="diff-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: c.difference.eyebrow, title: c.difference.title }).replace('class="title', 'id="diff-title" class="title')}
    <ol class="numbered">${c.difference.items
      .map((it, i) => `<li class="reveal" style="--d:${i}"><span class="numbered__n">0${i + 1}</span><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></li>`)
      .join('')}</ol>
  </div>
</section>`;

  const snowcat = `<section class="snowcat" aria-labelledby="snowcat-title">
  <div class="wrap snowcat__grid">
    <div class="snowcat__visual">
      ${xFrame(ctx, c.snowcat.image, 'reveal')}
    </div>
    <div class="snowcat__copy">
      <p class="eyebrow reveal">${esc(c.snowcat.eyebrow)}</p>
      <h2 class="display display--lg reveal" id="snowcat-title">${lines(c.snowcat.title)}</h2>
      <p class="reveal">${esc(c.snowcat.text)}</p>
      <dl class="specs reveal">${c.snowcat.specs.map((s) => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}</dl>
    </div>
  </div>
  <div class="snowcat__wide reveal">${picture(ctx, c.snowcat.image2, { sizes: '100vw' })}</div>
</section>`;

  const day = `<section class="section day" aria-labelledby="day-title">
  <div class="wrap day__grid">
    <div class="day__intro">
      ${sectionHead({ eyebrow: c.day.eyebrow, title: c.day.title, lead: c.day.note }).replace('class="title', 'id="day-title" class="title')}
      <div class="day__media reveal">${picture(ctx, c.day.image, { sizes: '(min-width: 900px) 40vw, 100vw' })}</div>
    </div>
    <ol class="timeline">${c.day.steps
      .map((s, i) => `<li class="timeline__item reveal" style="--d:${i}"><span class="timeline__time">${esc(s.time)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`)
      .join('')}</ol>
  </div>
</section>`;

  const beyond = `<section class="beyond" aria-labelledby="beyond-title">
  <div class="beyond__media">${picture(ctx, c.beyond.image, { sizes: '100vw' })}</div>
  <div class="beyond__shade" aria-hidden="true"></div>
  <div class="wrap beyond__content">
    <p class="eyebrow reveal">${esc(c.beyond.eyebrow)}</p>
    <h2 class="display display--lg reveal" id="beyond-title">${lines(c.beyond.title)}</h2>
    <p class="beyond__text reveal">${esc(c.beyond.text)}</p>
    <ul class="chips chips--light reveal">${c.beyond.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    ${c.beyond.option ? `<p class="beyond__option reveal"><span>+</span>${esc(c.beyond.option)}</p>` : ''}
  </div>
</section>`;

  const week = `<section class="section week" id="example-week" aria-labelledby="week-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: c.week.eyebrow, title: c.week.title }).replace('class="title', 'id="week-title" class="title')}
    <p class="note note--flag reveal">${brand(ctx, 'organix-symbol', 'note__x', '')}<span>${esc(c.week.note)}</span></p>
    <ol class="week__days">${c.week.days
      .map((d, i) => `<li class="week__day reveal ${i === 0 || i === c.week.days.length - 1 ? 'is-travel' : ''}" style="--d:${i % 4}"><span class="week__dow">${esc(d.day)}</span><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p></li>`)
      .join('')}</ol>
  </div>
</section>`;

  const stay = `<section class="section stay" aria-labelledby="stay-title">
  <div class="wrap stay__grid">
    <div class="stay__media reveal">${picture(ctx, c.stay.image, { sizes: '(min-width: 900px) 55vw, 100vw' })}</div>
    <div class="stay__copy">
      ${sectionHead({ eyebrow: c.stay.eyebrow, title: c.stay.title }).replace('class="title', 'id="stay-title" class="title')}
      <p class="reveal">${esc(c.stay.text)}</p>
    </div>
  </div>
  ${c.stay.gallery ? `<div class="wrap stay__gallery">${c.stay.gallery.map((k, i) => `<figure class="reveal" style="--d:${i}">${picture(ctx, k, { sizes: '(min-width: 900px) 33vw, 100vw' })}</figure>`).join('')}</div>` : ''}
</section>`;

  const included = `<section class="section included" aria-labelledby="inc-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: c.included.eyebrow, title: c.included.title }).replace('class="title', 'id="inc-title" class="title')}
    <div class="included__grid">
      <div class="reveal"><h3 class="included__h">${esc(u.common.included)}</h3>${checkList(ctx.t(e.included))}</div>
      <div class="reveal"><h3 class="included__h included__h--muted">${esc(u.common.notIncluded)}</h3>${checkList(ctx.t(e.notIncluded), 'checks--muted')}</div>
    </div>
  </div>
</section>`;

  const pricing = `<section class="pricing" id="pricing" aria-labelledby="pricing-title">
  <div class="wrap pricing__grid">
    <div class="pricing__main reveal">
      <p class="eyebrow">${esc(c.pricing.eyebrow)}</p>
      <h2 class="pricing__title" id="pricing-title">${fit(c.pricing.title)}</h2>
      ${priceTag(ctx, e)}
      ${checkList(c.pricing.items, 'checks--light')}
      <p class="pricing__basis">${esc(c.pricing.basis)}</p>
    </div>
    <div class="pricing__side reveal">
      <h3 class="pricing__tailored">${fit(c.pricing.tailoredTitle)}</h3>
      <ul class="dash">${c.pricing.tailored.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <p class="pricing__cur">${esc(c.pricing.currencies)}</p>
      ${button(enquire, c.pricing.cta, 'primary', track('nm-pricing'))}
    </div>
  </div>
  <div class="wrap pricing__season reveal">
    <p><strong>${esc(u.common.season)}</strong> ${esc(c.pricing.season || ctx.t(e.seasonWindow))}</p>
  </div>
</section>`;

  const who = `<section class="section who" aria-labelledby="who-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: c.who.eyebrow, title: c.who.title }).replace('class="title', 'id="who-title" class="title')}
    <div class="who__grid">${c.who.items
      .map((it, i) => `<article class="who__item reveal" style="--d:${i}"><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></article>`)
      .join('')}</div>
  </div>
</section>`;

  const team = `<section class="section team" aria-labelledby="team-title">
  <div class="wrap team__grid">
    <div class="team__copy">
      ${sectionHead({ eyebrow: c.team.eyebrow, title: c.team.title }).replace('class="title', 'id="team-title" class="title')}
      <p class="reveal">${esc(c.team.text)}</p>
      <ul class="roles">${c.team.roles
        .map((r) => `<li class="reveal"><span class="roles__plus" aria-hidden="true">+</span><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></li>`)
        .join('')}</ul>
      <a class="text-link reveal" href="${ctx.url('about/')}"><span>${esc(u.nav.about)}</span>${arrow}</a>
    </div>
    <div class="team__media reveal">${picture(ctx, c.team.image, { sizes: '(min-width: 900px) 45vw, 100vw' })}</div>
  </div>
</section>`;

  const faq = `<section class="section faq" aria-labelledby="faq-title">
  <div class="wrap faq__grid">
    ${sectionHead({ eyebrow: c.faq.eyebrow, title: c.faq.title }).replace('class="title', 'id="faq-title" class="title')}
    <div class="faq__list">${c.faq.items
      .map((f) => `<details class="faq__item reveal"><summary><span>${esc(f.q)}</span><i aria-hidden="true"></i></summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`)
      .join('')}</div>
  </div>
</section>`;

  const body = [
    heroHtml,
    breadcrumb(ctx, [[u.common.breadcrumbHome, ''], [u.nav.northMacedonia, 'north-macedonia/']]),
    core,
    level,
    terrain,
    difference,
    snowcat,
    band,
    day,
    beyond,
    gear,
    week,
    stay,
    included,
    pricing,
    who,
    team,
    faq,
    finalCta(ctx, { ...c.final, interest: 'north-macedonia', location: 'nm-final' }),
  ].join('\n');

  return {
    title: ctx.t(e.seo.title),
    description: ctx.t(e.seo.description),
    bodyClass: 'nm',
    destination: 'north-macedonia',
    ogImage: heroImg,
    preload: ctx.preloadHero(heroImg, heroImgM),
    jsonLd: [
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: ctx.t(e.title),
        description: ctx.t(e.shortDescription),
        touristType: ['Skiers', 'Snowboarders', 'Freeriders', 'Ski tourers'],
        url: ctx.abs(ctx.locale, e.path),
        image: ctx.absAsset(`media/${heroImg}/1600.webp`),
        provider: { '@type': 'TravelAgency', name: ctx.site.name, url: ctx.abs(ctx.locale, '') },
        itinerary: { '@type': 'Place', name: 'Popova Shapka, Šar Mountains, North Macedonia', address: { '@type': 'PostalAddress', addressCountry: 'MK' } },
        offers: {
          '@type': 'Offer',
          price: e.priceFrom,
          priceCurrency: e.currency,
          description: ctx.t(e.priceBasis),
          eligibleQuantity: { '@type': 'QuantitativeValue', value: 8, unitText: 'guests (price basis)' },
          availability: 'https://schema.org/InStock',
          url: ctx.abs(ctx.locale, 'enquire/'),
        },
      }),
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: c.faq.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }),
      ctx.breadcrumbLd([[u.common.breadcrumbHome, ''], [u.nav.northMacedonia, 'north-macedonia/']]),
    ],
    body,
  };
}
