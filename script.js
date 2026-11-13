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

  const dialogs = {
    about: `
      <h2 id="dialog-title">O Investors Club</h2>
      <p>Klub pro investory od 1 mil. Kč. Přístup k vybraným projektům, odborným analýzám a investičním příležitostem, které nejsou veřejně dostupné.</p>
      <ul class="facts"><li>Exkluzivní projekty</li><li>Odborný servis a osobní přístup</li><li>Detailní podklady a analýzy</li><li>Diskrétnost a soukromí</li></ul>
      <button type="button" class="cta dialog-action" data-open="membership">Požádat o členství</button>`,
    projects: `
      <h2 id="dialog-title">Vybrané projekty</h2>
      <p>V předloze nejsou uvedeny konkrétní investiční projekty, jejich podmínky ani výnosy. Proto je zde neuvádíme bez ověřených podkladů.</p>
      <p>Pro podrobnosti o možnostech členství otevřete nezávaznou žádost.</p>
      <button type="button" class="cta dialog-action" data-open="membership">Informace o členství</button>`,
    membership: `
      <h2 id="dialog-title">Požádat o členství</h2>
      <p class="dialog-intro">Vyplňte nezávaznou žádost o informace k členství v Investors Club.</p>
      <div class="demo-notice">Funkční ukázka formuláře. Propojení na e-mail nebo CRM není nastavené; údaje se nikam neodesílají.</div>
      <form id="membership-form" class="form-grid" novalidate>
        <div class="field"><label for="member-name">Jméno a příjmení *</label><input id="member-name" name="name" type="text" autocomplete="name" maxlength="100" required><small data-error-for="member-name" aria-live="polite"></small></div>
        <div class="field"><label for="member-email">E-mail *</label><input id="member-email" name="email" type="email" autocomplete="email" maxlength="200" required><small data-error-for="member-email" aria-live="polite"></small></div>
        <div class="field"><label for="member-phone">Telefon (nepovinné)</label><input id="member-phone" name="phone" type="tel" autocomplete="tel" maxlength="40"></div>
        <div class="field"><label for="member-volume">Předpokládaná výše investice</label><select id="member-volume" name="volume"><option value="">Zvolit možnost</option><option value="1–3 mil. Kč">1–3 mil. Kč</option><option value="3–10 mil. Kč">3–10 mil. Kč</option><option value="10+ mil. Kč">Více než 10 mil. Kč</option></select></div>
        <button type="submit" class="cta dialog-submit">Pokračovat</button>
      </form>`,
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
    const fields = Array.from(form.querySelectorAll('input[required], textarea[required]'));
    fields.forEach((input) => {
      const error = form.querySelector(`[data-error-for="${input.id}"]`);
      let message = '';
      if (!input.value.trim()) message = 'Vyplňte prosím toto pole.';
      else if (input.type === 'email' && !input.validity.valid) message = 'Zadejte platnou e-mailovou adresu.';
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
    finishDemo(form.id === 'membership-form' ? 'membership' : 'contact');
  });
  content.addEventListener('input',(event) => {
    const input = event.target;
    if (!input.matches('input,textarea')) return;
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
