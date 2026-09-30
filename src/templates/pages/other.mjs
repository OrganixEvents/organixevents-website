import { esc, lines, fit, longest, picture, button, arrow, brand } from '../lib.mjs';
import { hero, sectionHead, finalCta, inspirationGrid, partnersStrip, breadcrumb, checkList } from '../components.mjs';

export function customPage(ctx) {
  const c = ctx.page('custom');
  const u = ctx.ui;
  const trail = [[u.common.breadcrumbHome, ''], [u.nav.custom, 'custom/']];
  const body = [
    hero(ctx, {
      image: c.hero.image,
      eyebrow: c.hero.eyebrow,
      title: c.hero.title,
      sub: c.hero.sub,
      size: 'full',
      ctas: [button(ctx.url('enquire/') + '?interest=custom', u.common.startConversation, 'primary', 'data-track="enquiry_cta" data-location="custom-hero" data-interest="custom"')],
    }),
    breadcrumb(ctx, trail),
    `<section class="section start"><div class="wrap start__grid">
      ${sectionHead({ title: c.start.title, lead: c.start.lead })}
      <ol class="start__list">${c.start.items.map((i, n) => `<li class="reveal" style="--d:${n}">${esc(i)}</li>`).join('')}</ol>
    </div></section>`,
    `<section class="section organise"><div class="wrap organise__grid">
      <div class="organise__copy">
        ${sectionHead({ eyebrow: c.organise.eyebrow, title: c.organise.title })}
        <ul class="biglist biglist--2">${c.organise.items.map((i, n) => `<li class="reveal" style="--d:${n % 3}"><span>${String(n + 1).padStart(2, '0')}</span>${esc(i)}</li>`).join('')}</ul>
      </div>
      <div class="organise__media reveal">${picture(ctx, c.organise.image, { sizes: '(min-width: 900px) 40vw, 100vw' })}</div>
    </div></section>`,
    `<section class="one"><div class="wrap"><p class="one__lines">${c.one.lines.map((l) => `<span class="line fit reveal" style="--fit:${longest(l)}">${esc(l)}</span>`).join('')}</p></div></section>`,
    `<section class="section inspiration"><div class="wrap">
      ${sectionHead({ eyebrow: c.inspiration.eyebrow, title: c.inspiration.title })}
      <h3 class="insp__group reveal">${esc(c.inspiration.winter)}</h3>
      ${inspirationGrid(ctx, { season: 'winter', cta: false })}
      <h3 class="insp__group reveal">${esc(c.inspiration.summer)}</h3>
      ${inspirationGrid(ctx, { season: 'summer', note: c.inspiration.note })}
    </div></section>`,
    `<section class="section audiences"><div class="wrap">
      ${sectionHead({ eyebrow: c.audiences.eyebrow, title: c.audiences.title })}
      <div class="who__grid">${c.audiences.groups.map((g, i) => `<article class="who__item reveal" style="--d:${i}"><h3>${esc(g.title)}</h3><p>${esc(g.text)}</p></article>`).join('')}</div>
      <p class="audiences__price reveal">${esc(c.audiences.price)}</p>
    </div></section>`,
    `<section class="section process"><div class="wrap">
      <h2 class="eyebrow reveal">${esc(c.process.eyebrow)}</h2>
      <ol class="steps">${c.process.steps.map((s, i) => `<li class="reveal" style="--d:${i}"><span class="steps__n">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol>
    </div></section>`,
    finalCta(ctx, { ...c.final, interest: 'custom', location: 'custom-final' }),
  ].join('\n');
  return {
    title: c.seo.title,
    description: c.seo.description,
    bodyClass: 'custom',
    ogImage: c.hero.image,
    preload: ctx.preloadHero(c.hero.image),
    jsonLd: [ctx.breadcrumbLd(trail)],
    body,
  };
}

export function aboutPage(ctx) {
  const c = ctx.page('about');
  const u = ctx.ui;
  const trail = [[u.common.breadcrumbHome, ''], [u.nav.about, 'about/']];
  const people = c.people
    .map((p) => ({ ...p, name: ctx.site.team[p.id].name }))
    .map(
      (p, i) => `<article class="person reveal" style="--d:${i}">
      ${p.image ? `<div class="person__media">${picture(ctx, p.image, { sizes: '(min-width: 900px) 40vw, 100vw' })}</div>` : ''}
      <div class="person__body">
        <p class="person__role">${esc(p.role)}</p>
        <h3 class="person__name">${fit(p.name)}</h3>
        <p class="person__intro">${esc(p.intro)}</p>
        ${p.text ? `<p class="person__text">${esc(p.text)}</p>` : ''}
        <ul class="dash">${p.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      </div>
    </article>`
    )
    .join('');
  const body = [
    hero(ctx, { image: c.hero.image, eyebrow: c.hero.eyebrow, title: c.hero.title, size: 'tall' }),
    breadcrumb(ctx, trail),
    `<section class="section story-about"><div class="wrap story-about__grid">
      <div>${sectionHead({ eyebrow: c.story.eyebrow, title: c.story.title })}
      ${c.story.paragraphs.map((p) => `<p class="reveal">${esc(p)}</p>`).join('')}</div>
      <ol class="milestones">${c.story.milestones.map((m, i) => `<li class="reveal" style="--d:${i}"><strong>${esc(m.label)}</strong><span>${esc(m.text)}</span></li>`).join('')}</ol>
    </div></section>`,
    `<section class="section people"><div class="wrap"><div class="people__grid">${people}</div></div></section>`,
    c.band?.length ? `<section class="photo-band" aria-label="${esc(u.common.gallery)}"><div class="photo-band__grid">${c.band.map((k) => `<figure class="photo-band__item reveal">${picture(ctx, k, { sizes: '(min-width: 900px) 25vw, 50vw' })}</figure>`).join('')}</div></section>` : '',
    `<section class="local"><div class="local__media">${picture(ctx, c.local.image, { sizes: '100vw' })}</div><div class="local__shade" aria-hidden="true"></div>
      <div class="wrap local__content"><p class="eyebrow reveal">${esc(c.local.eyebrow)}</p><h2 class="display display--lg reveal">${lines(c.local.title)}</h2><p class="local__text reveal">${esc(c.local.text)}</p></div></section>`,
    partnersStrip(ctx, { title: ctx.page('home').partners.eyebrow }),
    finalCta(ctx, { ...c.final, location: 'about-final' }),
  ].join('\n');
  return {
    title: c.seo.title,
    description: c.seo.description,
    bodyClass: 'about',
    ogImage: c.hero.image,
    preload: ctx.preloadHero(c.hero.image),
    jsonLd: [ctx.breadcrumbLd(trail)],
    body,
  };
}

export function partnersPage(ctx) {
  const c = ctx.page('partners');
  const u = ctx.ui;
  const trail = [[u.common.breadcrumbHome, ''], [u.nav.partners, 'partners/']];
  const list = ctx.site.partners
    .map((p, i) => {
      if (!p.logo) ctx.missing.add(`official partner logo: ${p.name}`);
      const inner = p.logo ? `<img src="${ctx.asset(p.logo)}" alt="${esc(p.name)}" loading="lazy">` : `<span class="plogo__name">${fit(p.name)}</span>`;
      return `<li class="plogo reveal ${p.logo ? '' : 'plogo--pending'}" style="--d:${i}">
      ${p.url ? `<a class="plogo__link" href="${p.url}" target="_blank" rel="noopener" data-track="partner_click" data-location="${esc(p.name)}">${inner}</a>` : inner}
    </li>`;
    })
    .join('');
  return {
    title: c.seo.title,
    description: c.seo.description,
    bodyClass: 'partners-page',
    headerSolid: true,
    jsonLd: [ctx.breadcrumbLd(trail)],
    body: `<section class="plain-hero"><div class="wrap">
      <p class="eyebrow reveal">${esc(c.hero.eyebrow)}</p>
      <h1 class="display display--xl reveal">${lines(c.hero.title)}</h1>
      ${c.hero.lead ? `<p class="lead reveal">${esc(c.hero.lead)}</p>` : ''}
    </div></section>
    ${breadcrumb(ctx, trail)}
    <section class="section"><div class="wrap"><ul class="plogos">${list}</ul></div></section>`,
  };
}

export function enquirePage(ctx) {
  const c = ctx.page('enquire');
  const e = ctx.ui.enquiry;
  const u = ctx.ui;
  const interests = ['north-macedonia', 'winter', 'summer', 'custom'];
  // values stay in English (stable for the Netlify inbox and URL pre-selection); labels are localised
  const opt = (key) => ctx.ui.enquiry[key].map((label, i) => `<option value="${esc(ctx.uiEn.enquiry[key][i])}">${esc(label)}</option>`).join('');
  const field = (id, label, input, { hint, optional = true, cls = '' } = {}) =>
    `<div class="field ${cls}"><label for="${id}">${esc(label)}${optional ? ` <span class="field__opt">(${esc(e.optional)})</span>` : ''}</label>${input}${hint ? `<p class="field__hint" id="${id}-hint">${esc(hint)}</p>` : ''}</div>`;

  const form = `<form class="enquiry" name="enquiry" method="${ctx.preview ? 'GET' : 'POST'}" action="${ctx.url('enquire/thanks/')}" ${ctx.preview ? 'data-preview' : 'data-netlify="true" netlify-honeypot="company"'} data-enquiry novalidate>
  <input type="hidden" name="form-name" value="enquiry">
  <input type="hidden" name="subject" value="${esc(ctx.uiEn.enquiry.subject)} — OrganixEvents (${ctx.locale.toUpperCase()})">
  <input type="hidden" name="language" value="${ctx.locale}">
  <input type="hidden" name="source_page" value="" data-source>
  <p class="hp" aria-hidden="true"><label>Company <input name="company" tabindex="-1" autocomplete="off"></label></p>

  <fieldset class="enquiry__step">
    <legend class="enquiry__legend"><span class="enquiry__n">01</span>${esc(e.step1)}</legend>
    <div class="interests" role="radiogroup">
      ${interests
        .map(
          (k, i) => `<label class="interest ${k === 'north-macedonia' ? 'interest--flag' : ''}">
        <input type="radio" name="interest" value="${k}" ${i === 0 ? 'required' : ''}>
        <span class="interest__box">
          ${k === 'north-macedonia' ? `<span class="interest__badge">${esc(u.common.flagship)}</span>` : ''}
          <span class="interest__title">${fit(e.interests[k])}</span>
          <span class="interest__hint">${esc(e.interestHints[k])}</span>
        </span>
      </label>`
        )
        .join('')}
    </div>
  </fieldset>

  <fieldset class="enquiry__step enquiry__details" data-details>
    <legend class="enquiry__legend"><span class="enquiry__n">02</span>${esc(e.step2)}</legend>

    <div class="enquiry__cond" data-when="north-macedonia">
      ${field('duration', e.duration, `<select id="duration" name="nm_duration"><option value="">—</option>${opt('durationOptions')}</select>`)}
    </div>
    <div class="enquiry__cond" data-when="winter">
      ${field('winter_which', e.winterWhich, `<select id="winter_which" name="winter_experience"><option value="">—</option>${opt('winterOptions')}</select>`)}
    </div>
    <div class="enquiry__cond" data-when="summer">
      ${field('summer_which', e.summerWhich, `<select id="summer_which" name="summer_experience"><option value="">—</option>${opt('summerOptions')}</select>`)}
    </div>
    <div class="enquiry__cond" data-when="north-macedonia winter">
      ${field('level', e.level, `<select id="level" name="level"><option value="">—</option>${opt('levelOptions')}</select>`)}
    </div>
    <div class="enquiry__cond" data-when="custom">
      ${field('activity', e.activity, `<input id="activity" name="custom_activity" type="text" aria-describedby="activity-hint">`, { hint: e.activityHint })}
      ${field('destination', e.destination, `<input id="destination" name="custom_destination" type="text">`)}
      <label class="check"><input type="checkbox" name="custom_open_to_ideas" value="yes"><span>${esc(e.openToIdeas)}</span></label>
    </div>

    <div class="grid-2">
      ${field('name', e.name, `<input id="name" name="name" type="text" autocomplete="name" required>`, { optional: false })}
      ${field('email', e.email, `<input id="email" name="email" type="email" autocomplete="email" required>`, { optional: false })}
      ${field('phone', e.phone, `<input id="phone" name="phone" type="tel" autocomplete="tel">`)}
      ${field('people', e.people, `<select id="people" name="people" aria-describedby="people-hint"><option value="">—</option>${opt('peopleOptions')}</select>`, { hint: e.peopleHint })}
    </div>
    <div class="grid-2 grid-2--dates">
      ${field('dates', e.dates, `<input id="dates" name="dates" type="text" aria-describedby="dates-hint">`, { hint: e.datesHint })}
      <fieldset class="field seg">
        <legend>${esc(e.datesType)}</legend>
        <div class="seg__opts">
          ${[['exact', e.datesExact], ['approximate', e.datesApprox], ['flexible', e.datesFlexible]]
            .map(([v, l]) => `<label><input type="radio" name="dates_type" value="${v}" ${v === 'flexible' ? 'checked' : ''}><span>${esc(l)}</span></label>`)
            .join('')}
        </div>
      </fieldset>
    </div>
    ${field('message', e.message, `<textarea id="message" name="message" rows="5" aria-describedby="message-hint"></textarea>`, { hint: e.messageHint })}
    <p class="enquiry__consent"><a href="${ctx.url('privacy/')}">${esc(e.consent)}</a></p>
    <p class="enquiry__error" role="alert" hidden data-error>${esc(e.error)}</p>
    <button class="btn btn--primary btn--submit" type="submit" data-sending="${esc(e.sending)}"><span>${esc(e.submit)}</span>${arrow}</button>
  </fieldset>
</form>`;

  const process = `<aside class="process-card">
    <h2 class="process-card__title">${esc(e.processTitle)}</h2>
    <ol class="process-card__list">${e.process.map((s, i) => `<li><span>${i + 1}</span>${esc(s)}</li>`).join('')}</ol>
    <p class="process-card__note">${esc(e.noCheckout)}</p>
    <p class="process-card__contact"><a href="mailto:${ctx.site.contact.email}" data-track="email_click">${esc(ctx.site.contact.email)}</a>${(ctx.site.social || []).map((s) => `<br><a href="${s.url}" rel="noopener" target="_blank">${esc(s.name)} ${esc(s.handle || '')}</a>`).join('')}</p>
  </aside>`;

  return {
    title: c.seo.title,
    description: c.seo.description,
    bodyClass: 'enquire',
    headerSolid: true,
    body: `<section class="enquire-page">
      <div class="enquire-page__media" aria-hidden="true">${picture(ctx, c.image, { sizes: '40vw', alt: '' })}</div>
      <div class="wrap enquire-page__grid">
        <header class="enquire-page__head">
          <h1 class="display display--lg">${lines(e.title)}</h1>
          <p class="lead">${esc(e.lead)}</p>
        </header>
        ${form}
        ${process}
      </div>
    </section>`,
  };
}

export function thanksPage(ctx) {
  const c = ctx.page('enquire');
  const e = ctx.ui.enquiry;
  return {
    title: c.thanksSeo.title,
    description: c.thanksSeo.description,
    bodyClass: 'thanks',
    headerSolid: true,
    noindex: true,
    body: `<section class="thanks-page" data-thanks><div class="wrap">
      ${brand(ctx, 'organix-symbol', 'thanks-page__x', '')}
      <h1 class="display display--xl">${lines(e.thanksTitle)}</h1>
      <p class="lead">${esc(e.thanksLead)}</p>
      ${(ctx.site.social || []).map((s) => `<p class="thanks-page__ig"><a href="${s.url}" rel="noopener" target="_blank" data-track="instagram_click">${esc(ctx.ui.footer.follow)} ${esc(s.handle)}</a></p>`).join('')}
      <div class="btn-row">${button(ctx.url(''), e.thanksBack, 'outline')}</div>
    </div></section>`,
  };
}

export function notFoundPage(ctx) {
  const msgs = [
    ['en', 'Off piste.', "This page doesn't exist — or not anymore.", 'Back to the homepage'],
    ['fr', 'Hors piste.', "Cette page n'existe pas, ou plus.", "Retour à l'accueil"],
    ['de', 'Abseits der Piste.', 'Diese Seite gibt es nicht – oder nicht mehr.', 'Zur Startseite'],
  ];
  return {
    title: 'Page not found | OrganixEvents',
    description: 'This page does not exist.',
    bodyClass: 'nf',
    headerSolid: true,
    noindex: true,
    body: `<section class="thanks-page"><div class="wrap">
      ${brand(ctx, 'organix-symbol', 'thanks-page__x', '')}
      <div class="nf-langs">${msgs
        .map(([l, t, p, b]) => `<div lang="${l}" class="nf-lang"><h${l === 'en' ? 1 : 2} class="display ${l === 'en' ? 'display--xl' : 'display--md'}">${esc(t)}</h${l === 'en' ? 1 : 2}><p class="lead">${esc(p)}</p><p><a class="text-link" href="${ctx.url('', l)}"><span>${esc(b)}</span>${arrow}</a></p></div>`)
        .join('')}</div>
    </div></section>`,
  };
}

/** Legal notice / privacy policy — simple document page (section paragraphs may contain trusted inline HTML from our own JSON). */
export function legalPage(ctx, key) {
  const c = ctx.page(key);
  const u = ctx.ui;
  const trail = [[u.common.breadcrumbHome, ''], [c.title, `${key}/`]];
  return {
    title: c.seo.title,
    description: c.seo.description,
    bodyClass: 'legal',
    headerSolid: true,
    jsonLd: [ctx.breadcrumbLd(trail)],
    body: `<section class="plain-hero"><div class="wrap">
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h1 class="display display--lg">${fit(c.title)}</h1>
      ${c.updated ? `<p class="lead">${esc(c.updated)}</p>` : ''}
    </div></section>
    ${breadcrumb(ctx, trail)}
    <section class="section"><div class="wrap legal-doc">${c.sections.map((s) => `<h2>${esc(s.h)}</h2>${s.p.map((p) => `<p>${p}</p>`).join('')}`).join('')}</div></section>`,
  };
}
