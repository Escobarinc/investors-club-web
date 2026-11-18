/* Investors Club — interakce: karta Žádost o přístup (lead do CLARIX CRM), Login, menu pro členy. */
(() => {
  'use strict';

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

  // Menu je jen pro přihlášené členy. Přihlášení členů zatím není spuštěné, proto zůstává skryté.
  const unlockMenu = () => document.body.classList.remove('access-locked');

  const dialogs = {
    about: `
      <h2 id="dialog-title">O klubu</h2>
      <p>Investors Club nabízí přístup k vybraným investičním projektům od 1 mil. Kč. Přístup do klubu podléhá individuálnímu schválení.</p>
      <ul class="facts"><li>Vybrané projekty</li><li>Investiční příležitosti</li><li>Detailní podklady</li><li>Schvalovaný přístup</li></ul>`,
    projects: `
      <h2 id="dialog-title">Vybrané projekty</h2>
      <p>Projekty mají různé výnosy, podmínky a formy zajištění. Konkrétní nabídky zatím nejsou zveřejněné.</p>`,
    how: `
      <h2 id="dialog-title">Jak to funguje</h2>
      <ul class="facts"><li>Vyplníte žádost o přístup.</li><li>Každou žádost individuálně posuzujeme.</li><li>Po schválení získáte přihlášení do klubu.</li></ul>`,
    contact: `
      <h2 id="dialog-title">Kontakt</h2>
      <p>Pro dotazy k Investors Club nám pošlete žádost o přístup, ozveme se vám.</p>`,
    login: `
      <h2 id="dialog-title">Přihlášení členů</h2>
      <form id="login-form" class="form-grid" novalidate>
        <div class="field"><label for="login-email">E-mail</label><input id="login-email" name="email" type="email" autocomplete="username" maxlength="254" required></div>
        <div class="field"><label for="login-password">Heslo</label><input id="login-password" name="password" type="password" autocomplete="current-password" maxlength="200" required></div>
        <button type="submit" class="cta dialog-submit">Přihlásit se</button>
        <p class="login-status" id="login-status" role="status" aria-live="polite"></p>
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
    content.innerHTML = dialogs[type];
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
      formular: CRM.formName,
      message: 'Investiční kapitál: ' + data.capital,
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

  // ---- Login (přihlášení členů zatím není spuštěné) ----
  content.addEventListener('submit', (e) => {
    if (e.target.id !== 'login-form') return;
    e.preventDefault();
    const st = $('#login-status');
    const email = $('#login-email'), pass = $('#login-password');
    if (!email.value.trim() || !pass.value) { st.textContent = 'Vyplňte e-mail a heslo.'; (email.value.trim() ? pass : email).focus(); return; }
    st.textContent = 'Přihlášení členů připravujeme. Přístup získáte po schválení žádosti.';
  });

  // ---- Kliknutí a klávesy ----
  document.addEventListener('click', (e) => {
    const cardBtn = e.target.closest('[data-open-card]');
    if (cardBtn) { e.preventDefault(); openCard(cardBtn); return; }
    if (e.target.closest('[data-close-card]')) { closeCard(); return; }
    const trigger = e.target.closest('[data-open]');
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

  // Pro budoucí přihlášení členů.
  window.investorsClub = { unlockMenu };
})();
