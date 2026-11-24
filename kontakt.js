/* Select Club — stránka Kontakt: zpráva + preferovaný čas spojení (po–pá, 9:00–19:00 po 30 min) → CRM. */
(() => {
  'use strict';

  const card = document.getElementById('q-card');
  const arrow = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>';
  const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
  const emailOk = (v) => EMAIL_RE.test(v) && !v.includes('..') && !v.startsWith('.') && !v.split('@')[0].endsWith('.');

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

  card.innerHTML = `
    <p class="q-eyebrow">Select Club</p>
    <h1 class="q-title">Kontakt</h1>
    <p class="q-text">Napište nám zprávu a zvolte, kdy se vám máme ozvat.</p>
    <form id="contact-form" class="k-form" novalidate>
      <div class="k-field"><label for="contact-name">Jméno a příjmení *</label><input id="contact-name" name="name" type="text" autocomplete="name" maxlength="120" required><small data-error-for="contact-name" aria-live="polite"></small></div>
      <div class="k-row">
        <div class="k-field"><label for="contact-phone">Telefon *</label>
          <div class="k-phone"><select id="contact-prefix" aria-label="Předvolba"><option value="+420">CZ +420</option><option value="+421">SK +421</option></select><input id="contact-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="9" placeholder="9 číslic" required></div>
          <small data-error-for="contact-phone" aria-live="polite"></small></div>
        <div class="k-field"><label for="contact-email">E-mail *</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="jmeno@domena.cz" required><small data-error-for="contact-email" aria-live="polite"></small></div>
      </div>
      <div class="k-field"><label for="contact-message">Zpráva *</label><textarea id="contact-message" name="message" maxlength="2000" rows="5" required></textarea><small data-error-for="contact-message" aria-live="polite"></small></div>
      <fieldset class="k-pref">
        <legend>Preferovaný čas spojení</legend>
        <div class="k-row">
          <div class="k-field"><label for="contact-day">Den (po–pá)</label><select id="contact-day" name="day"><option value="">Kdykoli</option>${days.join('')}</select></div>
          <div class="k-field"><label for="contact-time">Čas</label><select id="contact-time" name="time"><option value="">Kdykoli</option>${times.map((t) => `<option value="${t}">${t}</option>`).join('')}</select></div>
        </div>
      </fieldset>
      <input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="q-nav"><button type="submit" class="cta q-next">Odeslat zprávu ${arrow}</button></div>
      <p class="k-status" id="contact-status" role="status" aria-live="polite"></p>
    </form>`;

  const $ = (s) => document.querySelector(s);
  const form = $('#contact-form');
  const v = (id) => $('#' + id).value.trim();

  // Telefon: jen číslice, max. 9
  $('#contact-phone').addEventListener('input', (e) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 9);
    if (clean !== e.target.value) e.target.value = clean;
  });
  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true') {
      e.target.setAttribute('aria-invalid', 'false');
      const out = form.querySelector(`[data-error-for="${e.target.id}"]`); if (out) out.textContent = '';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errs = {
      'contact-name': v('contact-name').split(/\s+/).length < 2 ? 'Zadejte jméno i příjmení.' : '',
      'contact-phone': /^\d{9}$/.test(v('contact-phone')) ? '' : 'Zadejte 9 číslic telefonního čísla.',
      'contact-email': emailOk(v('contact-email')) ? '' : 'Zadejte celý e-mail ve tvaru jmeno@domena.cz.',
      'contact-message': v('contact-message').length < 3 ? 'Napište nám prosím zprávu.' : ''
    };
    let first = null;
    Object.entries(errs).forEach(([id, msg]) => {
      const el = $('#' + id); el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const out = form.querySelector(`[data-error-for="${id}"]`); if (out) out.textContent = msg;
      if (msg && !first) first = el;
    });
    if (first) { first.focus(); first.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const st = $('#contact-status');
    const btn = form.querySelector('button[type=submit]');
    const day = v('contact-day'), time = v('contact-time');
    const pref = day || time ? `${day || 'kterýkoli pracovní den'}${time ? ', ' + time : ''}` : 'kdykoli (po–pá 9:00–19:00)';
    btn.disabled = true; st.textContent = 'Odesílám…';
    try {
      await window.IC_CRM.sendLead({
        name: v('contact-name'), phone: v('contact-prefix') + ' ' + v('contact-phone'), email: v('contact-email'),
        formular: 'Kontakt',
        message: v('contact-message') + '\n\nPreferovaný čas spojení: ' + pref,
        hp: form.company_website.value
      });
      card.innerHTML = `
        <p class="q-eyebrow">Select Club</p>
        <h1 class="q-title">Děkujeme za zprávu</h1>
        <p class="q-text">Ozveme se vám ${day || time ? 'v termínu: <strong>' + pref + '</strong>' : 'co nejdříve'}.</p>
        <div class="q-nav"><a class="cta q-next" href="index.html">Zpět na web ${arrow}</a></div>`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      btn.disabled = false;
      st.textContent = err.message === 'not-configured'
        ? 'Odesílání zatím není propojené s CRM. Zkuste to prosím později.'
        : 'Zprávu se nepodařilo odeslat. Zkuste to prosím znovu nebo napište na info@selectclub.cz.';
    }
  });
})();
