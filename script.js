/* Investors Club — interakce: karta Žádost o přístup (lead do CLARIX CRM), Login, menu pro členy. */
(() => {
  'use strict';
  // Náhled variant úvodu: ?varianta=svetla
  const varianta = new URLSearchParams(location.search).get('varianta');
  if (varianta) document.documentElement.dataset.varianta = varianta;
  // Náhled písem: ?pismo=manrope | sora | jakarta
  const FONTS = { manrope: 'Manrope:wght@400;500;600;700', sora: 'Sora:wght@400;500;600;700', jakarta: 'Plus+Jakarta+Sans:wght@400;500;600;700' };
  const pismo = new URLSearchParams(location.search).get('pismo');
  if (FONTS[pismo]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + FONTS[pismo] + '&display=swap';
    document.head.appendChild(l);
    document.documentElement.dataset.pismo = pismo;
  }

  // ---- Napojení na CLARIX CRM ----
  // siteKey = klíč webu z CRM (Nastavení → Weby a měření). Bez klíče formulář nic neodešle a řekne to.
  const CRM = {
    origin: 'https://clarix-crm.onrender.com',
    siteKey: '',
    formName: 'Žádost o přístup'
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const layer = $('#dialog-layer');
  const panel = $('#dialog-panel');
  const content = $('#dialog-content');
  const closeButton = $('#dialog-close');
  const menuToggle = $('#menu-toggle');
  const menu = $('#main-nav');
  const card = $('#access-card');
  const cardBody = $('#access-body');
  const accessForm = $('#access-form');
  const statusEl = $('#access-status');
  let previousFocus = null;
  let cardTrigger = null;

  // ---- Členská sekce: po přihlášení se odemkne menu a sekce #klub ----
  // Přihlášení je zatím ukázkové (bez napojení na účty) – přijme jakékoli vyplněné údaje.
  const MEMBER_KEY = 'ic-member';
  const members = $('#klub');
  const loginBtn = $('.login-btn');
  const loginLabel = loginBtn.querySelector('span');
  function setMember(on, scroll) {
    document.body.classList.toggle('access-locked', !on);
    document.body.classList.toggle('is-member', on);
    members.hidden = !on;
    loginBtn.dataset.open = on ? 'logout' : 'login';
    loginLabel.textContent = on ? 'Odhlásit' : 'Login';
    try { on ? localStorage.setItem(MEMBER_KEY, '1') : localStorage.removeItem(MEMBER_KEY); } catch (e) { /* storage blocked */ }
    if (on && scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    if (on && window.__icRevealCheck) setTimeout(window.__icRevealCheck, 50);
    if (!on) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const unlockMenu = () => setMember(true, false);

  const dialogs = {
    about: `
      <h2 id="dialog-title">O klubu</h2>
      <p>Investors Club nabízí přístup k vybraným investičním projektům od 1 mil. Kč. Přístup do klubu podléhá individuálnímu schválení.</p>
      <ul class="facts"><li>Vybrané projekty</li><li>Investiční příležitosti</li><li>Detailní podklady</li><li>Schvalovaný přístup</li></ul>`,
    projects: `
      <h2 id="dialog-title">Vybrané projekty</h2>
      <p>Projekty Vám představíme osobně v návaznosti na vaše preference uvedené v investičním profilu.</p>
      <p>Automatickou provázanost připravujeme v nejbližší době – poté se Vám zde automaticky budou zobrazovat nové příležitosti spolu s notifikací na Váš e-mail.</p>
      <p>Na řešení intenzivně pracujeme – děkujeme za pochopení.</p>
      <a class="cta dialog-action" href="profil.html">Můj investiční profil</a>`,
    how: `
      <h2 id="dialog-title">Jak to funguje</h2>
      <ul class="facts"><li>Vyplníte žádost o přístup.</li><li>Každou žádost individuálně posuzujeme.</li><li>Po schválení získáte přihlášení do klubu.</li></ul>`,
    contact: () => {
      // Pracovní dny (po–pá) na 3 týdny dopředu, časy po půlhodinách 9:00–19:00
      const days = [];
      const d = new Date(); d.setHours(12, 0, 0, 0);
      while (days.length < 15) {
        d.setDate(d.getDate() + 1);
        const wd = d.getDay();
        if (wd === 0 || wd === 6) continue;
        const label = d.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'numeric' });
        days.push(`<option value="${label}">${label.charAt(0).toUpperCase() + label.slice(1)}</option>`);
      }
      const times = [];
      for (let m = 9 * 60; m <= 19 * 60; m += 30) times.push(`${Math.floor(m / 60)}:${m % 60 ? '30' : '00'}`);
      return `
      <h2 id="dialog-title">Kontakt</h2>
      <p class="dialog-intro">Napište nám zprávu a zvolte, kdy se vám máme ozvat.</p>
      <form id="contact-form" class="form-grid" novalidate>
        <div class="field"><label for="contact-name">Jméno a příjmení *</label><input id="contact-name" name="name" type="text" autocomplete="name" maxlength="120" required><small data-error-for="contact-name" aria-live="polite"></small></div>
        <div class="field-row">
          <div class="field"><label for="contact-phone">Telefon *</label><input id="contact-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="30" required><small data-error-for="contact-phone" aria-live="polite"></small></div>
          <div class="field"><label for="contact-email">E-mail *</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required><small data-error-for="contact-email" aria-live="polite"></small></div>
        </div>
        <div class="field"><label for="contact-message">Zpráva *</label><textarea id="contact-message" name="message" maxlength="2000" required></textarea><small data-error-for="contact-message" aria-live="polite"></small></div>
        <fieldset class="field-pref">
          <legend>Preferovaný čas spojení</legend>
          <div class="field-row">
            <div class="field"><label for="contact-day">Den (po–pá)</label><select id="contact-day" name="day"><option value="">Kdykoli</option>${days.join('')}</select></div>
            <div class="field"><label for="contact-time">Čas</label><select id="contact-time" name="time"><option value="">Kdykoli</option>${times.map((t) => `<option value="${t}">${t}</option>`).join('')}</select></div>
          </div>
        </fieldset>
        <label class="a-consent"><input id="contact-consent" type="checkbox" required><span>Souhlasím se zpracováním osobních údajů za účelem vyřízení dotazu.</span></label>
        <small data-error-for="contact-consent" aria-live="polite" class="consent-error"></small>
        <input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button type="submit" class="cta dialog-submit">Odeslat zprávu</button>
        <p class="login-status" id="contact-status" role="status" aria-live="polite"></p>
      </form>`;
    },
    login: `
      <h2 id="dialog-title">Přihlášení členů</h2>
      <form id="login-form" class="form-grid" novalidate>
        <div class="field"><label for="login-email">E-mail</label><input id="login-email" name="email" type="email" autocomplete="username" maxlength="254" required></div>
        <div class="field"><label for="login-password">Heslo</label><input id="login-password" name="password" type="password" autocomplete="current-password" maxlength="200" required></div>
        <button type="submit" class="cta dialog-submit">Přihlásit se</button>
        <p class="login-status" id="login-status" role="status" aria-live="polite"></p>
        <p class="login-demo">Ukázkový režim – přihlášení zatím není napojené na členské účty.</p>
      </form>
      <p class="login-hint">Ještě nejste členem? <button type="button" class="link-btn" data-open-card>Požádat o přístup</button></p>`
  };

  // ---- Menu (mobil) ----
  function closeMenu() {
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Otevřít navigaci');
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Zavřít navigaci' : 'Otevřít navigaci');
  });

  // ---- Dialogy (O klubu, Login…) ----
  function openDialog(type) {
    if (!Object.hasOwn(dialogs, type)) return;
    if (layer.hidden) previousFocus = document.activeElement;
    closeMenu();
    content.innerHTML = typeof dialogs[type] === 'function' ? dialogs[type]() : dialogs[type];
    layer.hidden = false;
    document.body.classList.add('modal-open');
    const first = content.querySelector('input');
    (first || panel).focus();
  }
  function closeDialog() {
    if (layer.hidden) return;
    layer.hidden = true;
    document.body.classList.remove('modal-open');
    content.replaceChildren();
    if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
    previousFocus = null;
  }
  closeButton.addEventListener('click', closeDialog);

  // ---- Karta Žádost o přístup ----
  const isSheet = () => window.matchMedia('(max-width: 820px)').matches;
  function openCard(trigger) {
    closeDialog();
    closeMenu();
    cardTrigger = trigger || null;
    card.hidden = false;
    card.classList.remove('is-in');
    void card.offsetWidth;
    card.classList.add('is-in');
    document.body.classList.toggle('sheet-open', isSheet());
    const first = $('#access-name');
    if (first && !accessForm.hidden) first.focus({ preventScroll: !isSheet() });
  }
  function closeCard() {
    if (card.hidden) return;
    card.hidden = true;
    document.body.classList.remove('sheet-open');
    if (cardTrigger && document.contains(cardTrigger)) cardTrigger.focus();
    cardTrigger = null;
  }

  // ---- Validace ----
  const rules = {
    'access-name': (v) => (v.length < 3 || v.split(/\s+/).length < 2) ? 'Zadejte jméno i příjmení.' : '',
    'access-phone': (v) => { const d = v.replace(/\D/g, ''); return (!/^\+?[\d\s()/-]{6,30}$/.test(v) || d.length < 9 || d.length > 15) ? 'Zadejte platné telefonní číslo.' : ''; },
    'access-email': (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? '' : 'Zadejte platný e-mail.',
    'access-capital': (v) => v ? '' : 'Vyberte investiční kapitál.',
    'access-consent': (_, el) => el.checked ? '' : 'Bez souhlasu nemůžeme žádost zpracovat.'
  };
  function check(el) {
    const msg = rules[el.id] ? rules[el.id](el.value.trim(), el) : '';
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const err = accessForm.querySelector(`[data-error-for="${el.id}"]`);
    if (err) err.textContent = msg;
    return !msg;
  }
  accessForm.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') check(e.target); });
  accessForm.addEventListener('change', (e) => { if (rules[e.target.id]) check(e.target); });

  // ---- Odeslání leadu do CRM ----
  function utm() {
    const q = new URLSearchParams(location.search);
    const u = {};
    ['source', 'medium', 'campaign', 'content', 'term'].forEach((k) => { u[k] = q.get('utm_' + k) || ''; });
    return u;
  }
  async function sendLead(data) {
    if (!CRM.siteKey) throw new Error('not-configured');
    const q = new URLSearchParams(location.search);
    const body = {
      k: CRM.siteKey,
      name: data.name, email: data.email, phone: data.phone,
      consent: true,
      formular: data.formular || CRM.formName,
      message: data.message || ('Investiční kapitál: ' + data.capital),
      company_website: data.hp,
      u: utm(), p: location.pathname, h: location.host,
      lp: location.pathname, rf: document.referrer || '',
      gc: q.get('gclid') || '', fc: q.get('fbclid') || '',
      dv: innerWidth < 768 ? 'm' : innerWidth < 1100 ? 't' : 'd'
    };
    // text/plain + no-cors: požadavek dojde do CRM i bez CORS hlaviček (odpověď prohlížeč nepřečte).
    await fetch(CRM.origin + '/api/t/lead', {
      method: 'POST', mode: 'no-cors', keepalive: true,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body)
    });
  }

  accessForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = ['access-name', 'access-phone', 'access-email', 'access-capital', 'access-consent'].map((id) => $('#' + id));
    const ok = fields.map(check).every(Boolean);
    if (!ok) { const bad = accessForm.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }
    const btn = accessForm.querySelector('.a-submit');
    btn.disabled = true;
    statusEl.textContent = 'Odesílám…';
    statusEl.className = 'a-status';
    try {
      await sendLead({
        name: $('#access-name').value.trim(),
        phone: $('#access-phone').value.trim(),
        email: $('#access-email').value.trim(),
        capital: $('#access-capital').value,
        hp: accessForm.company_website.value
      });
      cardBody.innerHTML = `
        <h2 id="access-title">Děkujeme</h2>
        <p class="a-thanks">Žádost o přístup jsme přijali. Posoudíme ji a ozveme se vám na uvedený telefon nebo e-mail.</p>
        <button type="button" class="a-submit a-done" data-close-card>Zavřít</button>`;
      cardBody.querySelector('.a-done').focus();
    } catch (err) {
      btn.disabled = false;
      statusEl.className = 'a-status is-error';
      statusEl.textContent = err.message === 'not-configured'
        ? 'Odesílání zatím není propojené s CRM. Zkuste to prosím později.'
        : 'Žádost se nepodařilo odeslat. Zkontrolujte připojení a zkuste to znovu.';
    }
  });

  // ---- Kontaktní formulář (zpráva + preferovaný čas spojení) → CRM ----
  content.addEventListener('submit', async (e) => {
    if (e.target.id !== 'contact-form') return;
    e.preventDefault();
    const f = e.target;
    const v = (id) => $('#' + id).value.trim();
    const errs = {
      'contact-name': v('contact-name').split(/\s+/).length < 2 ? 'Zadejte jméno i příjmení.' : '',
      'contact-phone': (() => { const d = v('contact-phone').replace(/\D/g, ''); return (d.length < 9 || d.length > 15) ? 'Zadejte platné telefonní číslo.' : ''; })(),
      'contact-email': /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('contact-email')) ? '' : 'Zadejte platný e-mail.',
      'contact-message': v('contact-message').length < 3 ? 'Napište nám prosím zprávu.' : '',
      'contact-consent': $('#contact-consent').checked ? '' : 'Bez souhlasu nemůžeme zprávu zpracovat.'
    };
    let first = null;
    Object.entries(errs).forEach(([id, msg]) => {
      const el = $('#' + id); el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const out = f.querySelector(`[data-error-for="${id}"]`); if (out) out.textContent = msg;
      if (msg && !first) first = el;
    });
    if (first) { first.focus(); return; }
    const st = $('#contact-status');
    const btn = f.querySelector('button[type=submit]');
    const day = v('contact-day'), time = v('contact-time');
    const pref = day || time ? `${day || 'kterýkoli pracovní den'}${time ? ', ' + time : ''}` : 'kdykoli (po–pá 9:00–19:00)';
    btn.disabled = true; st.textContent = 'Odesílám…';
    try {
      await sendLead({
        name: v('contact-name'), phone: v('contact-phone'), email: v('contact-email'),
        formular: 'Kontakt',
        message: v('contact-message') + '\n\nPreferovaný čas spojení: ' + pref,
        hp: f.company_website.value
      });
      content.innerHTML = `<h2 id="dialog-title">Děkujeme za zprávu</h2>
        <p>Ozveme se vám ${day || time ? 'v termínu: <strong>' + pref + '</strong>' : 'co nejdříve'}.</p>
        <div class="success-actions"><button type="button" class="cta secondary-btn" data-dismiss="true">Zavřít</button></div>`;
    } catch (err) {
      btn.disabled = false;
      st.textContent = err.message === 'not-configured'
        ? 'Odesílání zatím není propojené s CRM. Zkuste to prosím později.'
        : 'Zprávu se nepodařilo odeslat. Zkontrolujte připojení a zkuste to znovu.';
    }
  });

  // ---- Login (přihlášení členů zatím není spuštěné) ----
  content.addEventListener('submit', (e) => {
    if (e.target.id !== 'login-form') return;
    e.preventDefault();
    const st = $('#login-status');
    const email = $('#login-email'), pass = $('#login-password');
    if (!email.value.trim() || !pass.value) { st.textContent = 'Vyplňte e-mail a heslo.'; (email.value.trim() ? pass : email).focus(); return; }
    st.textContent = '';
    closeDialog();
    setMember(true, true);
  });

  // ---- Kliknutí a klávesy ----
  document.addEventListener('click', (e) => {
    const cardBtn = e.target.closest('[data-open-card]');
    if (cardBtn) { e.preventDefault(); openCard(cardBtn); return; }
    if (e.target.closest('[data-close-card]')) { closeCard(); return; }
    const scrollBtn = e.target.closest('[data-scroll]');
    if (scrollBtn) { e.preventDefault(); closeMenu(); const t = document.getElementById(scrollBtn.dataset.scroll); if (t && !t.hidden) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const trigger = e.target.closest('[data-open]');
    if (trigger && trigger.dataset.open === 'logout') { e.preventDefault(); setMember(false); return; }
    if (trigger) { e.preventDefault(); openDialog(trigger.dataset.open); return; }
    if (e.target.closest('[data-dismiss]')) { closeDialog(); return; }
    if (!menu.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!layer.hidden) closeDialog();
      else if (!card.hidden) closeCard();
      else closeMenu();
      return;
    }
    if (e.key !== 'Tab' || layer.hidden) return;
    const controls = Array.from(panel.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]'));
    if (!controls.length) return;
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
    document.body.classList.toggle('sheet-open', !card.hidden && isSheet());
  });

  try { if (localStorage.getItem(MEMBER_KEY) === '1') setMember(true, false); } catch (e) { /* storage blocked */ }

  // Animace: bloky klubu se objeví při scrollování
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const items = document.querySelectorAll('.m-closing, .m-intro, .m-pillar, .m-step');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el, i) => {
      el.classList.add('reveal');
      if (el.classList.contains('m-pillar')) el.style.transitionDelay = (i % 3) * 0.12 + 's';
      io.observe(el);
    });
    // Pojistka: kontrola i při scrollování / změně velikosti a po přihlášení
    const check = () => items.forEach((el) => {
      if (el.classList.contains('is-visible')) return;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight - 40 && r.height) el.classList.add('is-visible');
    });
    addEventListener('scroll', check, { passive: true });
    addEventListener('resize', check);
    setTimeout(check, 300);
    window.__icRevealCheck = check;
  }

  // Pro budoucí skutečné přihlášení členů.
  window.investorsClub = { unlockMenu, setMember };
})();
