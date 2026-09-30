/* OrganixEvents V0 — progressive enhancement only. The site works without JS. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- analytics: GA4 with Consent Mode v2 — nothing loads before consent ---------- */
  var CFG = window.ORGANIX_CONFIG || {};
  var KEY = 'organix-consent';
  var ga = false;
  function store(v) { try { if (v === undefined) return localStorage.getItem(KEY); localStorage.setItem(KEY, v); } catch (e) { return null; } }
  function loadGA() {
    if (ga || !CFG.ga4Id) return;
    ga = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CFG.ga4Id);
    document.head.appendChild(s);
    gtag('js', new Date());
    var dest = document.body.getAttribute('data-destination');
    gtag('config', CFG.ga4Id, { language: document.documentElement.lang, destination: dest || undefined });
    if (dest) gtag('event', 'destination_view', { destination: dest });
  }
  function track(event, params) {
    var payload = Object.assign({ page_path: location.pathname, language: document.documentElement.lang }, params || {});
    if (ga) gtag('event', event, payload);
    if (window.organixDebug) console.log('[track]', event, payload);
  }
  window.organixTrack = track;
  var card = document.querySelector('[data-consent]');
  function showCard(show) { if (card) card.hidden = !show; }
  if (CFG.ga4Id || CFG.consentDemo) {
    var choice = store();
    if (choice === 'granted') loadGA();
    else if (!choice) showCard(true);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-consent-choice]');
    if (b) { var v = b.getAttribute('data-consent-choice'); store(v); showCard(false); if (v === 'granted') loadGA(); else if (ga) gtag('consent', 'update', { analytics_storage: 'denied' }); }
    if (e.target.closest('[data-consent-open]')) showCard(true);
    var l = e.target.closest('.lang a');
    if (l && !l.hasAttribute('aria-current')) track('language_change', { from: document.documentElement.lang, to: l.getAttribute('hreflang') });
  });

  /* ---------- header ---------- */
  var header = document.querySelector('[data-header]');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 40);
      if (!document.body.classList.contains('menu-open')) header.classList.toggle('is-hidden', y > 400 && y > lastY + 4);
      if (y < lastY - 4) header.classList.remove('is-hidden');
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    header.classList.remove('is-hidden');
    header.classList.toggle('is-scrolled', open || window.scrollY > 40);
    var label = toggle.querySelector('.menu-toggle__label');
    if (label) label.textContent = open ? (document.documentElement.lang === 'de' ? 'Schliessen' : document.documentElement.lang === 'fr' ? 'Fermer' : 'Close') : (document.documentElement.lang === 'de' ? 'Menü' : 'Menu');
    if (open) { var first = menu.querySelector('a'); if (first) first.focus(); } else toggle.focus();
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
      if (e.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
        var f = [toggle].concat([].slice.call(menu.querySelectorAll('a')));
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.matchMedia('(min-width: 1021px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- reveal on scroll ---------- */
  var els = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- subtle hero parallax ---------- */
  var par = document.querySelector('[data-parallax]');
  if (par && !reduced) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, window.innerHeight);
        par.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- CTA clicks ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track]');
    if (a) track(a.getAttribute('data-track'), { location: a.getAttribute('data-location'), interest: a.getAttribute('data-interest') || undefined });
  });

  /* ---------- enquiry form ---------- */
  var form = document.querySelector('[data-enquiry]');
  if (form) {
    var params = new URLSearchParams(location.search);
    var src = form.querySelector('[data-source]');
    if (src) src.value = document.referrer || '';
    var started = false;
    function start() { if (!started) { started = true; track('enquiry_started'); } }

    function applyInterest(value, fromUser) {
      form.classList.toggle('has-interest', !!value);
      form.querySelectorAll('[data-when]').forEach(function (el) {
        var on = el.getAttribute('data-when').split(' ').indexOf(value) > -1;
        el.classList.toggle('is-on', on);
        el.querySelectorAll('input,select,textarea').forEach(function (i) { i.disabled = !on; });
      });
      if (fromUser) {
        start();
        var details = form.querySelector('[data-details]');
        if (details && !reduced && details.getBoundingClientRect().top > window.innerHeight * 0.7) {
          details.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'interest') applyInterest(e.target.value, true);
    });
    form.addEventListener('input', start, { once: true });

    var pre = params.get('interest');
    var radio = pre && form.querySelector('input[name="interest"][value="' + pre + '"]');
    if (radio) { radio.checked = true; applyInterest(pre, false); }
    else { var checked = form.querySelector('input[name="interest"]:checked'); applyInterest(checked ? checked.value : '', false); }
    var option = params.get('option');
    if (option) {
      form.querySelectorAll('select').forEach(function (s) {
        [].forEach.call(s.options, function (o) { if (o.value === option) s.value = option; });
      });
    }

    form.addEventListener('submit', function (e) {
      var ok = true;
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (i) {
        var valid = i.type === 'radio' ? !!form.querySelector('input[name="' + i.name + '"]:checked') : i.checkValidity();
        if (i.type !== 'radio') i.setAttribute('aria-invalid', String(!valid));
        if (!valid) { ok = false; firstBad = firstBad || i; }
      });
      if (!ok) { e.preventDefault(); firstBad.focus(); return; }

      var interest = (form.querySelector('input[name="interest"]:checked') || {}).value;
      var eventName = { 'north-macedonia': 'north_macedonia_enquiry', winter: 'winter_enquiry', summer: 'summer_enquiry', custom: 'custom_enquiry' }[interest];

      // Submit to Netlify Forms via fetch; fall back to a normal POST on failure.
      if (!window.fetch || location.protocol === 'file:' || form.hasAttribute('data-preview')) { track('enquiry_submitted', { interest: interest }); if (eventName) track(eventName); return; }
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var label = btn.querySelector('span');
      var original = label.textContent;
      btn.disabled = true; label.textContent = btn.getAttribute('data-sending');
      var data = new FormData(form);
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          track('enquiry_submitted', { interest: interest });
          if (eventName) track(eventName);
          setTimeout(function () { location.href = form.getAttribute('action'); }, ga ? 400 : 0);
        })
        .catch(function () {
          btn.disabled = false; label.textContent = original;
          var err = form.querySelector('[data-error]'); if (err) err.hidden = false;
        });
    });
  }
})();
