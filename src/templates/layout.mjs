import { esc, brand, button, arrow } from './lib.mjs';

function head(ctx, page) {
  const { site, locale } = ctx;
  const title = page.title;
  const desc = page.description;
  const canonical = ctx.abs(page.canonicalLocale || locale, ctx.route);
  const alternates = page.alternateLocales || [];
  const ogImage = page.ogImage && ctx.media[page.ogImage]
    ? ctx.absAsset(`media/${page.ogImage}/${ctx.media[page.ogImage].widths.find((w) => w >= 1200) || ctx.media[page.ogImage].widths.at(-1)}.webp`)
    : ctx.absAsset('brand/og-default.jpg');
  const robots = ctx.indexable && !page.noindex ? 'index,follow' : 'noindex,follow';
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">
${alternates.map((l) => `<link rel="alternate" hreflang="${l}" href="${ctx.abs(l, ctx.route)}">`).join('\n')}
${alternates.length ? `<link rel="alternate" hreflang="x-default" href="${ctx.abs('en', ctx.route)}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:locale" content="${{ en: 'en_GB', fr: 'fr_CH', de: 'de_CH' }[locale]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d0d12">
<link rel="icon" href="${ctx.asset('brand/favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,700;1,800&display=swap">
${page.preload || ''}
<link rel="stylesheet" href="${ctx.asset(`assets/main.css?v=${ctx.version}`)}">
${(page.jsonLd || []).join('\n')}
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});window.ORGANIX_CONFIG=${JSON.stringify({ ga4Id: site.analytics?.ga4Id || null, consentDemo: !!ctx.preview && !site.analytics?.ga4Id })};</script>
</head>`;
}

function langSwitch(ctx, cls = '') {
  return `<ul class="lang ${cls}" aria-label="${esc(ctx.ui.nav.language)}">${ctx.site.locales
    .map((l) => `<li><a href="${ctx.url(ctx.route, l.code)}" hreflang="${l.hreflang}" lang="${l.hreflang}" ${
      l.code === ctx.locale ? 'aria-current="true"' : ''
    } title="${esc(l.name)}">${l.label}</a></li>`)
    .join('')}</ul>`;
}

function header(ctx, page) {
  const { ui, site } = ctx;
  const links = site.nav
    .map((n) => {
      const active = ctx.route === n.path || (n.path !== '' && ctx.route.startsWith(n.path));
      return `<li><a href="${ctx.url(n.path)}" ${active ? 'aria-current="page"' : ''} ${
        n.key === 'northMacedonia' ? 'class="is-flag"' : ''
      }>${esc(ui.nav[n.key])}</a></li>`;
    })
    .join('');
  return `<header class="site-header ${page.headerSolid ? 'is-solid' : ''}" data-header>
  <div class="site-header__inner">
    <a class="logo" href="${ctx.url('')}" aria-label="${esc(ui.nav.home)}">${brand(ctx, 'organix-wordmark', 'logo__mark', 'Organix')}</a>
    <nav class="nav" aria-label="${esc(ui.nav.mainNav)}"><ul>${links}</ul></nav>
    <div class="site-header__end">
      ${langSwitch(ctx, 'lang--header')}
      <a class="btn btn--small btn--primary nav-enquire" href="${ctx.url('enquire/')}" data-track="enquiry_cta" data-location="header"><span>${esc(ui.nav.enquire)}</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle>
        <span class="menu-toggle__label">${esc(ui.nav.menu)}</span><span class="menu-toggle__bars" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
  </div>
</header>
<div class="menu" id="menu" hidden data-menu>
    <div class="menu__inner">
      <nav aria-label="${esc(ui.nav.mainNav)}"><ol class="menu__links">${site.nav
        .map((n, i) => `<li style="--i:${i}"><a href="${ctx.url(n.path)}"><span class="menu__num">0${i + 1}</span>${esc(ui.nav[n.key])}</a></li>`)
        .join('')}</ol></nav>
      <div class="menu__foot">
        ${button(ctx.url('enquire/'), ui.nav.enquire, 'primary', 'data-track="enquiry_cta" data-location="menu"')}
        ${langSwitch(ctx, 'lang--menu')}
      </div>
    </div>
</div>`;
}

function footer(ctx) {
  const { ui, site, exp } = ctx;
  const c = site.contact;
  const expLinks = [
    [ui.nav.northMacedonia, 'north-macedonia/'],
    ...ctx.visible(['georgia', 'norway', 'alps', 'youth-camps', 'portugal-wake', 'summer-adventures']).map((s) => [ctx.t(exp[s].shortTitle), exp[s].path]),
    [ui.nav.custom, 'custom/'],
  ];
  const coLinks = [
    [ui.nav.about, 'about/'],
    [ui.nav.partners, 'partners/'],
    [ui.nav.enquire, 'enquire/'],
  ];
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="site-footer__top">
      <div class="site-footer__brand">
        ${brand(ctx, 'organix-logo-events', 'site-footer__logo', 'Organix Events')}
        <p class="site-footer__statement">${esc(site.statement)}</p>
        <p class="site-footer__tagline">${esc(ui.footer.tagline)}</p>
      </div>
      <div class="site-footer__cols">
        <div><h2 class="site-footer__h">${esc(ui.footer.experiences)}</h2><ul>${expLinks.map(([l, p]) => `<li><a href="${ctx.url(p)}">${esc(l)}</a></li>`).join('')}</ul></div>
        <div><h2 class="site-footer__h">${esc(ui.footer.company)}</h2><ul>${coLinks.map(([l, p]) => `<li><a href="${ctx.url(p)}">${esc(l)}</a></li>`).join('')}</ul></div>
        <div><h2 class="site-footer__h">${esc(ui.footer.contact)}</h2>
          <ul>
            <li><a href="mailto:${c.email}" data-track="email_click">${esc(c.email)}</a></li>
            ${c.phone ? `<li><a href="tel:${c.phone.replace(/\s/g, '')}">${esc(c.phone)}</a></li>` : ''}
            ${(site.social || []).map((s) => `<li><a href="${s.url}" rel="noopener" target="_blank">${esc(s.name)} ${esc(s.handle || '')}</a></li>`).join('')}
          </ul>
          <address>${[c.address[0], c.address[1], { en: 'Switzerland', fr: 'Suisse', de: 'Schweiz' }[ctx.locale]].map(esc).join('<br>')}</address>
        </div>
      </div>
    </div>
    <div class="site-footer__bottom">
      <p>© ${new Date().getFullYear()} ${esc(site.legalName)}. ${esc(ui.footer.rights)}</p>
      <ul class="site-footer__legal">
        <li><a href="${ctx.url('legal/')}">${esc(ui.footer.legal)}</a></li>
        <li><a href="${ctx.url('privacy/')}">${esc(ui.footer.privacy)}</a></li>
        ${site.analytics?.ga4Id || ctx.preview ? `<li><button type="button" class="linkish" data-consent-open>${esc(ui.footer.cookies)}</button></li>` : ''}
      </ul>
      ${langSwitch(ctx, 'lang--footer')}
      ${ctx.indexable ? '' : `<p class="site-footer__preview">${esc(ui.footer.preview)}</p>`}
    </div>
  </div>
</footer>`;
}

export function layout(ctx, page, body) {
  const notice = page.fallback
    ? `<div class="fallback-notice" role="note"><div class="wrap">${esc(
        ctx.ui.common.fallbackNotice.replace('{language}', { en: 'English', fr: 'français', de: 'Deutsch' }[ctx.locale])
      )}</div></div>`
    : '';
  return `<!doctype html>
<html lang="${ctx.locale}" class="no-js">
${head(ctx, page)}
<body class="page-${esc(page.bodyClass || 'default')}"${page.destination ? ` data-destination="${esc(page.destination)}"` : ''}>
<script>document.documentElement.classList.replace('no-js','js')</script>
<a class="skip" href="#main">${esc(ctx.ui.nav.skip)}</a>
${header(ctx, page)}
${notice}
<main id="main" tabindex="-1"${page.fallback ? ' lang="en"' : ''}>
${body}
</main>
${footer(ctx)}
${ctx.xMaskDefs}
${consentCard(ctx)}
<script src="${ctx.asset(`assets/main.js?v=${ctx.version}`)}" defer></script>
</body>
</html>`;
}

function consentCard(ctx) {
  const c = ctx.ui.consent;
  return `<div class="consent" role="dialog" aria-live="polite" aria-label="${esc(c.title)}" hidden data-consent>
  <p class="consent__text"><strong>${esc(c.title)}.</strong> ${esc(c.text)} <a href="${ctx.url('privacy/')}">${esc(c.more)}</a></p>
  <div class="consent__btns"><button type="button" class="btn btn--small btn--outline" data-consent-choice="denied"><span>${esc(c.decline)}</span></button><button type="button" class="btn btn--small btn--primary" data-consent-choice="granted"><span>${esc(c.accept)}</span></button></div>
</div>`;
}
