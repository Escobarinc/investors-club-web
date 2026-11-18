/* Investors Club — functional offline demo interactions. */
(() => {
  'use strict';
  const layer = document.getElementById('dialog-layer');
  const panel = document.getElementById('dialog-panel');
  const content = document.getElementById('dialog-content');
  const closeButton = document.getElementById('dialog-close');
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('main-nav');
  let previousFocus = null;

  const ACCESS_KEY = 'ic-access-granted';
  const DEMO_CODE = '123456';
  const unlockMenu = () => document.body.classList.remove('access-locked');
  try { if (localStorage.getItem(ACCESS_KEY) === '1') unlockMenu(); } catch (e) { /* storage blocked */ }

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
      <ul class="facts"><li>Vyplníte žádost o přístup.</li><li>Telefonní číslo ověříme SMS kódem.</li><li>Každou žádost individuálně posuzujeme.</li></ul>`,
    access: `
      <h2 id="dialog-title">Žádost o přístup</h2>
      <form id="access-form" class="form-grid" novalidate>
        <div class="field"><label for="access-name">Jméno a příjmení</label><input id="access-name" name="name" type="text" autocomplete="name" maxlength="100" required><small data-error-for="access-name" aria-live="polite"></small></div>
        <div class="field"><label for="access-phone">Telefonní číslo</label><input id="access-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="40" required><small data-error-for="access-phone" aria-live="polite"></small></div>
        <div class="field"><label for="access-email">E-mail</label><input id="access-email" name="email" type="email" autocomplete="email" maxlength="200" required><small data-error-for="access-email" aria-live="polite"></small></div>
        <div class="field"><label for="access-capital">Investiční kapitál</label><select id="access-capital" name="capital" required><option value="">Zvolit možnost</option><option value="1-3">1–3 mil. Kč</option><option value="3-5">3–5 mil. Kč</option><option value="5-10">5–10 mil. Kč</option><option value="10+">Více než 10 mil. Kč</option></select><small data-error-for="access-capital" aria-live="polite"></small></div>
        <button type="submit" class="cta dialog-submit">Pokračovat k ověření <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg></button>
        <p class="form-disclaimer">Telefonní číslo ověříme SMS kódem. Každou žádost individuálně posuzujeme. Odeslání žádosti nezaručuje přijetí do klubu.</p>
      </form>`,
    verify: `
      <h2 id="dialog-title">Ověření čísla</h2>
      <div class="demo-notice">Ukázkový režim: SMS se zatím neposílá. Pro vyzkoušení zadejte kód ${DEMO_CODE}.</div>
      <form id="verify-form" class="form-grid" novalidate>
        <div class="field"><label for="verify-code">Ověřovací kód</label><input id="verify-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required><small data-error-for="verify-code" aria-live="polite"></small></div>
        <button type="submit" class="cta dialog-submit">Ověřit kód</button>
        <button type="button" class="secondary-btn" data-open="access">Zpět k údajům</button>
      </form>`,
    granted: `
      <h2 id="dialog-title">Přístup udělen</h2>
      <p>Děkujeme, ověření proběhlo. V horní liště je teď dostupné menu klubu.</p>
      <div class="success-actions"><button type="button" class="cta secondary-btn" data-dismiss="true">Pokračovat na web</button></div>`,
    contact: `
      <h2 id="dialog-title">Kontakt</h2>
      <p class="dialog-intro">Pro dotazy k Investors Club můžete připravit zprávu.</p>
      <div class="demo-notice">Funkční ukázka bez napojení na e-mail. Neuvádíme neověřenou kontaktní adresu.</div>
      <form id="contact-form" class="form-grid" novalidate>
        <div class="field"><label for="contact-name">Jméno a příjmení *</label><input id="contact-name" name="name" type="text" autocomplete="name" maxlength="100" required><small data-error-for="contact-name" aria-live="polite"></small></div>
        <div class="field"><label for="contact-email">E-mail *</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="200" required><small data-error-for="contact-email" aria-live="polite"></small></div>
        <div class="field"><label for="contact-message">Zpráva *</label><textarea id="contact-message" name="message" maxlength="3000" required></textarea><small data-error-for="contact-message" aria-live="polite"></small></div>
        <button type="submit" class="cta dialog-submit">Připravit zprávu</button>
      </form>`
  };

  function closeMenu() {
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label','Otevřít navigaci');
  }
  function openDialog(type) {
    if (!Object.hasOwn(dialogs,type)) return;
    if (layer.hidden) previousFocus = document.activeElement;
    closeMenu();
    content.innerHTML = dialogs[type];
    layer.hidden = false;
    document.body.classList.add('modal-open');
    panel.focus();
  }
  function closeDialog() {
    if (layer.hidden) return;
    layer.hidden = true;
    document.body.classList.remove('modal-open');
    content.replaceChildren();
    if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
    previousFocus = null;
  }
  function formFeedback(form) {
    let valid = true;
    const fields = Array.from(form.querySelectorAll('input[required], textarea[required], select[required]'));
    fields.forEach((input) => {
      const error = form.querySelector(`[data-error-for="${input.id}"]`);
      const value = input.value.trim();
      let message = '';
      if (!value) message = input.tagName === 'SELECT' ? 'Vyberte prosím možnost.' : 'Vyplňte prosím toto pole.';
      else if (input.type === 'email' && !input.validity.valid) message = 'Zadejte platnou e-mailovou adresu.';
      else if (input.type === 'tel') { const d = value.replace(/\D/g, ''); if (d.length < 9 || d.length > 15) message = 'Zadejte platné telefonní číslo.'; }
      else if (input.name === 'name' && value.split(/\s+/).length < 2) message = 'Zadejte jméno i příjmení.';
      else if (input.name === 'code' && value !== DEMO_CODE) message = 'Nesprávný kód.';
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (error) error.textContent = message;
      if (message) valid = false;
    });
    if (!valid) {
      const first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
    }
    return valid;
  }
  function finishDemo(kind) {
    const label = kind === 'membership' ? 'Žádost je připravená' : 'Zpráva je připravená';
    content.innerHTML = `<h2 id="dialog-title">${label}</h2>
      <p class="success-title">Kontrola údajů proběhla úspěšně.</p>
      <p>Jde o lokální ukázku webu. <strong>Nic nebylo odesláno</strong> ani uloženo na server. Pro skutečné žádosti je potřeba připojit e-mail nebo CRM.</p>
      <div class="success-actions"><button type="button" class="secondary-btn" id="return-form">Upravit novou žádost</button><button type="button" class="cta secondary-btn" id="close-success">Zavřít</button></div>`;
    const back = content.querySelector('#return-form');
    back.textContent = kind === 'membership' ? 'Nová žádost' : 'Nová zpráva';
    back.addEventListener('click', () => openDialog(kind));
    content.querySelector('#close-success').addEventListener('click',closeDialog);
    panel.focus();
  }
  document.addEventListener('click',(event) => {
    const trigger = event.target.closest('[data-open]');
    if (trigger) {
      event.preventDefault();
      openDialog(trigger.dataset.open);
      return;
    }
    if (event.target.closest('[data-dismiss]')) closeDialog();
  });
  content.addEventListener('submit',(event) => {
    const form = event.target;
    if (!form.matches('form')) return;
    event.preventDefault();
    if (!formFeedback(form)) return;
    if (form.id === 'access-form') { openDialog('verify'); const code = content.querySelector('#verify-code'); if (code) code.focus(); return; }
    if (form.id === 'verify-form') {
      unlockMenu();
      try { localStorage.setItem(ACCESS_KEY, '1'); } catch (e) { /* storage blocked */ }
      openDialog('granted');
      return;
    }
    finishDemo('contact');
  });
  content.addEventListener('input',(event) => {
    const input = event.target;
    if (!input.matches('input,textarea,select')) return;
    input.setAttribute('aria-invalid','false');
    const feedback = content.querySelector(`[data-error-for="${input.id}"]`);
    if (feedback) feedback.textContent = '';
  });
  closeButton.addEventListener('click',closeDialog);
  menuToggle.addEventListener('click',() => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label',open?'Zavřít navigaci':'Otevřít navigaci');
  });
  document.addEventListener('keydown',(event) => {
    if (event.key === 'Escape') {
      if (!layer.hidden) closeDialog();
      else closeMenu();
      return;
    }
    if (event.key !== 'Tab' || layer.hidden) return;
    const controls = Array.from(panel.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]'));
    if (!controls.length) return;
    const first = controls[0],last = controls[controls.length-1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('click',(event) => {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize',() => { if (window.innerWidth > 820) closeMenu(); });
})();
