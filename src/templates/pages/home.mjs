import { esc, lines, picture, button, arrow, jsonLd, brand } from '../lib.mjs';
import { hero, sectionHead, xFrame, priceTag, experienceCard, partnersStrip, finalCta, inspirationGrid } from '../components.mjs';

export function homePage(ctx) {
  const c = ctx.page('home');
  const nm = ctx.exp['north-macedonia'];
  const u = ctx.ui;

  const heroHtml = hero(ctx, {
    image: c.hero.image || nm.heroImage,
    imageMobile: c.hero.imageMobile || (c.hero.image ? null : nm.heroImageMobile),
    title: [c.hero.title],
    sub: [c.hero.subtitle],
    ctas: [
      button('#flagship', c.hero.ctaPrimary, 'primary'),
      button(ctx.url('enquire/'), c.hero.ctaSecondary, 'ghost', 'data-track="enquiry_cta" data-location="home-hero"'),
    ],
    extra: `<a class="scroll-cue" href="#flagship" aria-label="${esc(c.hero.ctaPrimary)}"><span></span></a>`,
  });

  const flagship = `<section class="flagship" id="flagship" aria-labelledby="flagship-title">
  <div class="flagship__bg" aria-hidden="true">${brand(ctx, 'organix-symbol', 'flagship__bgx', '')}</div>
  <div class="wrap flagship__grid">
    <div class="flagship__copy">
      <p class="eyebrow eyebrow--flag reveal">${esc(c.flagship.eyebrow)}</p>
      <h2 class="display display--lg reveal" id="flagship-title">${lines(c.flagship.title[0])}<span class="line line--sub">${esc(c.flagship.title[1])}</span></h2>
      <p class="manifesto reveal">${lines(c.flagship.message)}</p>
      <div class="reveal">${priceTag(ctx, nm)}</div>
      <p class="flagship__note reveal">${esc(c.flagship.priceNote)}</p>
      <p class="flagship__flex reveal">${esc(c.flagship.flexNote)}</p>
      <div class="btn-row reveal">${button(ctx.url(nm.path), c.flagship.cta, 'primary')}</div>
    </div>
    <div class="flagship__visual">
      ${xFrame(ctx, 'nm-snowcat-powder', 'reveal')}
      <figure class="flagship__inset reveal">${picture(ctx, 'nm-snowcat-crew', { sizes: '(min-width: 900px) 22vw, 45vw' })}</figure>
    </div>
  </div>
  <div class="flagship__strip wrap reveal" role="list">
    ${ctx.t(nm.gallery.slice(0, 4)).map((k, i) => `<div class="flagship__thumb" role="listitem" style="--d:${i}">${picture(ctx, k, { sizes: '(min-width: 900px) 24vw, 50vw' })}</div>`).join('')}
  </div>
</section>`;

  const winter = `<section class="section section--winter" aria-labelledby="winter-title">
  <div class="wrap">
    <div class="split-head">
      ${sectionHead({ eyebrow: c.winter.eyebrow, title: c.winter.title, lead: c.winter.lead }).replace('class="title', 'id="winter-title" class="title')}
      <a class="text-link reveal" href="${ctx.url('north-macedonia/')}">${brand(ctx, 'organix-symbol', 'text-link__x', '')}<span>${esc(c.winter.flagshipLink)}</span>${arrow}</a>
    </div>
    <div class="cards cards--3">
      ${ctx.visible(c.winter.items).map((s, i) => experienceCard(ctx, ctx.exp[s], { label: c.winter.labels[s], index: i })).join('')}
    </div>
    <div class="section-foot reveal">${button(ctx.url('winter/'), c.winter.cta, 'outline')}</div>
  </div>
</section>`;

  const summer = `<section class="section section--summer" aria-labelledby="summer-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: c.summer.eyebrow, title: c.summer.title }).replace('class="title', 'id="summer-title" class="title')}
    <div class="summer-row">
      ${ctx.visible(c.summer.items)
        .map((s, i) => {
          const e = ctx.exp[s];
          return `<a class="scard reveal" style="--d:${i}" href="${ctx.url(e.path)}">
          <div class="scard__media">${picture(ctx, e.heroImage, { sizes: '(min-width: 900px) 33vw, 85vw' })}</div>
          <div class="scard__body"><span class="scard__num">0${i + 1}</span><h3 class="scard__title">${esc(c.summer.labels[s])}</h3><p>${esc(ctx.t(e.tagline))}</p></div>
        </a>`;
        })
        .join('')}
    </div>
    <div class="section-foot reveal">${button(ctx.url('summer/'), c.summer.cta, 'outline')}</div>
  </div>
</section>`;

  const custom = `<section class="custom-band" aria-labelledby="custom-title">
  <div class="custom-band__media">${picture(ctx, c.custom.image, { sizes: '100vw' })}</div>
  <div class="custom-band__shade" aria-hidden="true"></div>
  <div class="wrap custom-band__content">
    <p class="eyebrow reveal">${esc(c.custom.eyebrow)}</p>
    <h2 class="display display--lg reveal" id="custom-title">${lines(c.custom.title)}</h2>
    <p class="custom-band__lead reveal">${lines(c.custom.lead)}</p>
    <p class="custom-band__label reveal">${esc(c.custom.inspirationLabel)}</p>
    <ul class="ticker reveal" role="list">${ctx.inspirations.items.map((i) => `<li>${esc(ctx.t(i.title))}</li>`).join('')}</ul>
    <div class="btn-row reveal">${button(ctx.url('custom/'), c.custom.cta, 'primary')}</div>
  </div>
</section>`;

  const why = `<section class="section why" aria-labelledby="why-title">
  <div class="wrap">
    <h2 class="eyebrow reveal" id="why-title">${esc(c.why.eyebrow)}</h2>
    <ol class="why__list">${c.why.items
      .map((it, i) => `<li class="why__item reveal" style="--d:${i % 3}"><span class="why__num">0${i + 1}</span><h3 class="why__title">${esc(it.title)}</h3><p>${esc(it.text)}</p></li>`)
      .join('')}</ol>
  </div>
</section>`;

  const about = `<section class="section about-teaser" aria-labelledby="about-title">
  <div class="wrap about-teaser__grid">
    <div class="about-teaser__media reveal">${picture(ctx, c.about.image, { sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
    <div class="about-teaser__copy">
      <p class="eyebrow reveal">${esc(c.about.eyebrow)}</p>
      <h2 class="title reveal" id="about-title">${lines(c.about.title)}</h2>
      <p class="reveal">${esc(c.about.text)}</p>
      <div class="btn-row reveal">${button(ctx.url('about/'), c.about.cta, 'outline')}</div>
    </div>
  </div>
</section>`;

  const body = [
    heroHtml,
    flagship,
    winter,
    summer,
    custom,
    why,
    about,
    partnersStrip(ctx, { title: c.partners.eyebrow }),
    finalCta(ctx, { ...c.final, location: 'home-final' }),
  ].join('\n');

  return {
    title: c.seo.title,
    description: c.seo.description,
    bodyClass: 'home',
    ogImage: nm.heroImage,
    preload: c.hero.image ? ctx.preloadHero(c.hero.image) : ctx.preloadHero(nm.heroImage, nm.heroImageMobile),
    jsonLd: [
      jsonLd({ '@context': 'https://schema.org', '@type': 'WebSite', name: ctx.site.name, url: ctx.abs(ctx.locale, ''), inLanguage: ctx.locale }),
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'TravelAgency',
        name: ctx.site.name,
        legalName: ctx.site.legalName,
        slogan: 'Beyond the ordinary.',
        founder: Object.values(ctx.site.team).map((m) => ({ '@type': 'Person', name: m.name })),
        url: ctx.abs(ctx.locale, ''),
        logo: ctx.absAsset('brand/organix-logo-events.svg'),
        email: ctx.site.contact.email,
        ...(ctx.site.contact.phone ? { telephone: ctx.site.contact.phone } : {}),
        sameAs: (ctx.site.social || []).map((s) => s.url),
        address: {
          '@type': 'PostalAddress',
          streetAddress: ctx.site.contact.address[0],
          postalCode: '1347',
          addressLocality: 'Le Sentier',
          addressCountry: 'CH',
        },
      }),
    ],
    body,
  };
}
