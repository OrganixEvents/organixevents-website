import { esc, lines, fit, picture, button, arrow, brand } from '../lib.mjs';
import { hero, sectionHead, xFrame, priceTag, experienceCard, finalCta, breadcrumb } from '../components.mjs';

export function winterPage(ctx) {
  const c = ctx.page('winter');
  const nm = ctx.exp['north-macedonia'];
  const u = ctx.ui;

  const flagship = `<section class="wflag" aria-labelledby="wflag-title">
  <a class="wflag__link" href="${ctx.url(nm.path)}">
    <div class="wflag__media">${picture(ctx, 'nm-snowcat-ridge', { sizes: '100vw', mobile: 'nm-snowcat-ridge' })}</div>
    <div class="wflag__shade" aria-hidden="true"></div>
    <div class="wrap wflag__content">
      <p class="eyebrow eyebrow--flag reveal">${esc(c.flagship.eyebrow)}</p>
      <h2 class="display display--xl reveal" id="wflag-title">${fit(c.flagship.title)}</h2>
      <p class="wflag__sub reveal">${esc(c.flagship.subtitle)}</p>
      <p class="wflag__msg reveal">${esc(c.flagship.message)}</p>
      <div class="wflag__row reveal">${priceTag(ctx, nm, { compact: true })}<span class="btn btn--primary"><span>${esc(c.flagship.cta)}</span>${arrow}</span></div>
    </div>
  </a>
</section>`;

  const universes = `<section class="section universes" aria-labelledby="uni-title">
  <div class="wrap">
    ${sectionHead({ title: c.universes.title }).replace('class="title', 'id="uni-title" class="title')}
    <div class="uni">${ctx.visible(c.universes.items)
      .map((s, i) => {
        const e = ctx.exp[s];
        return `<article class="uni__row reveal ${i % 2 ? 'uni__row--flip' : ''}">
        <a class="uni__media" href="${ctx.url(e.path)}" tabindex="-1" aria-hidden="true">${picture(ctx, e.heroImage, { sizes: '(min-width: 900px) 55vw, 100vw' })}</a>
        <div class="uni__copy">
          <p class="uni__kicker">${esc(ctx.t(e.universe))}</p>
          <h3 class="uni__title"><a href="${ctx.url(e.path)}">${fit(ctx.t(e.shortTitle))}</a></h3>
          <p class="uni__tagline">${esc(ctx.t(e.tagline))}</p>
          <p>${esc(ctx.t(e.shortDescription))}</p>
          ${e.partner ? `<p class="uni__partner">${esc(u.common.partner)} <strong>${esc(e.partner.name)}</strong></p>` : ''}
          <a class="text-link" href="${ctx.url(e.path)}"><span>${esc(u.common.discover)}</span>${arrow}</a>
        </div>
      </article>`;
      })
      .join('')}</div>
  </div>
</section>`;

  return {
    title: c.seo.title,
    description: c.seo.description,
    bodyClass: 'winter',
    ogImage: c.hero.image,
    preload: ctx.preloadHero(c.hero.image),
    jsonLd: [ctx.breadcrumbLd([[u.common.breadcrumbHome, ''], [u.nav.winter, 'winter/']])],
    body: [
      hero(ctx, { image: c.hero.image, eyebrow: c.hero.eyebrow, title: c.hero.title, lead: c.hero.lead, size: 'tall' }),
      breadcrumb(ctx, [[u.common.breadcrumbHome, ''], [u.nav.winter, 'winter/']]),
      flagship,
      universes,
      finalCta(ctx, { ...c.final, interest: 'winter', location: 'winter-final' }),
    ].join('\n'),
  };
}

export function summerPage(ctx) {
  const c = ctx.page('summer');
  const u = ctx.ui;
  const [camps, wake, adv] = c.areas.map((s) => ctx.exp[s]);
  const activeCamps = (camps.camps || []).filter((x) => x.active);

  const intro = `<section class="summer-intro"><div class="wrap"><p class="big-quote reveal">${esc(c.intro)}</p></div></section>`;

  const campsHtml = `<section class="sarea sarea--camps" aria-labelledby="camps-title">
  <div class="wrap sarea__grid">
    <div class="sarea__media reveal">${picture(ctx, camps.heroImage, { sizes: '(min-width: 900px) 40vw, 100vw' })}</div>
    <div class="sarea__copy">
      <span class="sarea__num">01</span>
      <h2 class="title reveal" id="camps-title">${esc(ctx.t(camps.shortTitle))}</h2>
      <p class="sarea__tag reveal">${esc(ctx.t(camps.tagline))}</p>
      <p class="reveal">${esc(ctx.t(camps.shortDescription))}</p>
      <dl class="facts facts--inline reveal">
        <div><dt>${esc(u.common.duration)}</dt><dd>${esc(ctx.t(camps.duration))}</dd></div>
        <div><dt>${esc(u.common.groupSize)}</dt><dd>${esc(ctx.t(camps.groupSize.note))}</dd></div>
      </dl>
      <p class="status ${activeCamps.length ? 'status--on' : ''} reveal">${esc(activeCamps.length ? u.common.active : u.common.comingSoon)}</p>
      <a class="text-link reveal" href="${ctx.url(camps.path)}"><span>${esc(u.common.discover)}</span>${arrow}</a>
    </div>
  </div>
</section>`;

  const wakeHtml = `<section class="sarea sarea--wake" aria-labelledby="wake-title">
  <div class="sarea__full">${picture(ctx, wake.heroImage, { sizes: '100vw' })}</div>
  <div class="sarea__fullshade" aria-hidden="true"></div>
  <div class="wrap sarea__over">
    <span class="sarea__num">02</span>
    <h2 class="display display--lg reveal" id="wake-title">${esc(ctx.t(wake.shortTitle))}</h2>
    <p class="sarea__tag reveal">${esc(ctx.t(wake.tagline))}</p>
    <ul class="chips chips--light reveal">${ctx.t(wake.included).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    <div class="btn-row reveal">${button(ctx.url(wake.path), u.common.discover, 'primary')}</div>
  </div>
</section>`;

  const advHtml = `<section class="sarea sarea--adv" aria-labelledby="adv-title">
  <div class="wrap">
    <div class="sarea__head">
      <span class="sarea__num">03</span>
      <h2 class="title reveal" id="adv-title">${esc(ctx.t(adv.shortTitle))}</h2>
      <p class="reveal">${esc(ctx.t(adv.longDescription))}</p>
    </div>
    <div class="mosaic">
      ${[adv.heroImage, ...adv.gallery].slice(0, 4).map((k, i) => `<div class="mosaic__item mosaic__item--${i} reveal" style="--d:${i}">${picture(ctx, k, { sizes: '(min-width: 900px) 30vw, 50vw' })}</div>`).join('')}
    </div>
    <ul class="chips reveal">${ctx.t(adv.activities).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    <div class="btn-row reveal">${button(ctx.url(adv.path), `${u.common.discover}`, 'outline')}</div>
  </div>
</section>`;

  return {
    title: c.seo.title,
    description: c.seo.description,
    bodyClass: 'summer',
    ogImage: c.hero.image,
    preload: ctx.preloadHero(c.hero.image),
    jsonLd: [ctx.breadcrumbLd([[u.common.breadcrumbHome, ''], [u.nav.summer, 'summer/']])],
    body: [
      hero(ctx, { image: c.hero.image, eyebrow: c.hero.eyebrow, title: c.hero.title, lead: c.hero.lead, size: 'tall' }),
      breadcrumb(ctx, [[u.common.breadcrumbHome, ''], [u.nav.summer, 'summer/']]),
      intro,
      campsHtml,
      wakeHtml,
      advHtml,
      finalCta(ctx, { ...c.final, interest: 'summer', location: 'summer-final' }),
    ].join('\n'),
  };
}
