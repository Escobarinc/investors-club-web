/* Investors Club — Investiční profil (dotazník pro členy).
   Zadání: „Investiční profily obou investorských klubů“, varianta 01 Investiční klub od 1 mil. Kč.
   Pravidla: jedna odpověď (01–04, 06–11), max. dvě (05), více odpovědí (12–15);
   „Zatím bez zkušeností“ (12) a „Bez preference“ (14, 15) vylučují ostatní volby.
   Odpovědi se zatím ukládají jen v prohlížeči (napojení na CRM je samostatný krok). */
(() => {
  'use strict';

  const STORE = 'ic-investicni-profil';
  const card = document.getElementById('q-card');

  const blocks = [
    {
      title: 'Váš investiční kapitál',
      intro: 'Nejprve si nastavíme základní parametry vašich investičních možností.',
      questions: [
        { id: 'q01', text: 'Jaký objem kapitálu aktuálně zvažujete investovat?', type: 'single',
          options: ['1–2 mil. Kč', '2–3 mil. Kč', '3–5 mil. Kč', '5–10 mil. Kč', 'Nad 10 mil. Kč'] },
        { id: 'q02', text: 'Jak plánujete rozdělit svůj investiční kapitál?', type: 'single',
          options: ['Do jednoho investičního projektu', 'Mezi dva až tři projekty', 'Mezi čtyři a více projektů', 'Rozhodnu se podle konkrétních příležitostí'] },
        { id: 'q03', text: 'Kdy předpokládáte první investici?', type: 'single',
          options: ['Ihned', 'Do 30 dnů', 'Do 3 měsíců', 'Do 6 měsíců', 'Později'] }
      ]
    },
    {
      title: 'Vaše investiční cíle',
      intro: 'Zajímá nás, co od investování očekáváte a které parametry jsou pro vás důležité.',
      questions: [
        { id: 'q04', text: 'Jaký je hlavní účel vašich investic?', type: 'single',
          options: ['Pravidelný příjem', 'Růst kapitálu', 'Ochrana kupní síly', 'Diverzifikace', 'Financování budoucích potřeb'] },
        { id: 'q05', text: 'Co je pro vás při výběru investice nejdůležitější?', type: 'max', max: 2, hint: 'Vyberte maximálně dvě priority.',
          options: ['Výnos', 'Riziko ztráty', 'Zajištění', 'Likvidita', 'Délka investice', 'Emitent', 'Konkrétní projekt'] },
        { id: 'q06', text: 'Jaký způsob získávání výnosu preferujete?', type: 'single',
          options: ['Pravidelná výplata', 'Výplata při splatnosti', 'Reinvestování', 'Bez preference'] },
        { id: 'q07', text: 'Jaké roční zhodnocení očekáváte od investic tohoto typu?', type: 'single',
          options: ['Do 5 %', '5–7 %', '7–9 %', '9–11 %', 'Více než 11 %', 'Nemám pevné očekávání'] }
      ]
    },
    {
      title: 'Horizont a přístup k riziku',
      intro: 'Délka investice, dostupnost kapitálu a investiční rizika jsou důležitou součástí každého rozhodnutí.',
      questions: [
        { id: 'q08', text: 'Jakou dobu investice preferujete?', type: 'single',
          options: ['Do 12 měsíců', '1–2 roky', '2–3 roky', '3–5 let', 'Více než 5 let'] },
        { id: 'q09', text: 'V jaké fázi realizace projektu preferujete investovat?', type: 'single',
          options: ['V přípravné fázi projektu', 'Po získání potřebných povolení', 'Během realizace projektu', 'Ve fázi dokončování nebo po dokončení', 'Fáze projektu pro mě není rozhodující'] },
        { id: 'q10', text: 'Jakou míru investičního rizika jste ochoten podstoupit?', type: 'single',
          options: ['Velmi nízkou', 'Nízkou', 'Střední', 'Vyšší', 'Vysokou'] },
        { id: 'q11', text: 'Jakým způsobem chcete dlouhodobě pracovat se svým investičním kapitálem?', type: 'single',
          options: ['Pravidelně reinvestovat výnosy', 'Postupně navyšovat investovaný kapitál', 'Kombinovat pravidelný příjem s růstem kapitálu', 'Udržovat stabilní objem investic', 'Rozhodovat podle aktuálních příležitostí'] }
      ]
    },
    {
      title: 'Vaše investiční preference',
      intro: 'Pomozte nám lépe pochopit, jaké investiční nástroje a projekty vás zajímají.',
      questions: [
        { id: 'q12', text: 'S jakými investičními nástroji máte zkušenosti?', type: 'multi', hint: 'Lze vybrat více možností.', exclusive: 'Zatím bez zkušeností',
          options: ['Dluhopisy', 'Fondy', 'FKI', 'Akcie', 'ETF', 'Nemovitosti', 'Podnikatelské podíly', 'Úvěrové investice', 'Zatím bez zkušeností'] },
        { id: 'q13', text: 'O jaké formy investování máte zájem?', type: 'multi', hint: 'Lze vybrat více možností.',
          options: ['Korporátní dluhopisy', 'Zajištěné dluhopisy', 'Investiční fondy', 'FKI', 'Úvěrové financování', 'Přímé projektové investice', 'Majetkové podíly'] },
        { id: 'q14', text: 'Jaké typy projektů vás zajímají?', type: 'multi', hint: 'Lze vybrat více možností.', exclusive: 'Bez preference',
          options: ['Rezidenční development', 'Komerční nemovitosti', 'Průmysl', 'Energetika', 'Infrastruktura', 'Bez preference'] },
        { id: 'q15', text: 'Jaké formy zajištění preferujete?', type: 'multi', hint: 'Lze vybrat více možností.', exclusive: 'Bez preference',
          options: ['Nemovitostní zástava', 'Zástava obchodního podílu', 'Ručení další osoby', 'Kombinace', 'Bez preference'] }
      ]
    }
  ];

  let answers = {};
  try { answers = JSON.parse(localStorage.getItem(STORE) || '{}').answers || {}; } catch (e) { answers = {}; }
  const save = (done) => { try { localStorage.setItem(STORE, JSON.stringify({ answers, done: !!done, updated: new Date().toISOString() })); } catch (e) { /* storage blocked */ } };

  let isMember = false;
  try { isMember = localStorage.getItem('ic-member') === '1'; } catch (e) { isMember = false; }

  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const arrow = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>';
  const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

  function show(html) {
    card.classList.remove('is-in');
    card.innerHTML = html;
    void card.offsetWidth;
    card.classList.add('is-in');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const h = card.querySelector('h1, h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  function renderLocked() {
    show(`
      <p class="q-eyebrow">Investiční klub od 1 mil. Kč</p>
      <h1 class="q-title">Dotazník je určen členům klubu.</h1>
      <p class="q-text">Pro vyplnění investičního profilu se nejprve přihlaste do klubu.</p>
      <div class="q-nav"><a class="cta q-next" href="index.html">Přejít na přihlášení ${arrow}</a></div>`);
  }

  const allQuestions = blocks.flatMap((b) => b.questions);

  function questionHtml(q) {
    const sel = answers[q.id] || [];
    const inputType = q.type === 'single' ? 'radio' : 'checkbox';
    const opts = q.options.map((o) => `
      <label class="q-opt">
        <input type="${inputType}" name="${q.id}" value="${esc(o)}" ${sel.includes(o) ? 'checked' : ''}>
        <span class="q-box">${check}</span><span class="q-opt-label">${esc(o)}</span>
      </label>`).join('');
    return `
      <fieldset class="q-question" data-q="${q.id}">
        <legend><span class="q-num">${q.id.slice(1)}</span>${esc(q.text)}</legend>
        ${q.hint ? `<p class="q-hint">${esc(q.hint)}</p>` : ''}
        <div class="q-opts">${opts}</div>
        <p class="q-error" role="alert"></p>
      </fieldset>`;
  }

  function countDone() {
    const n = allQuestions.filter((q) => (answers[q.id] || []).length).length;
    const el = card.querySelector('.q-count');
    if (el) el.textContent = `Zodpovězeno ${n} z ${allQuestions.length}`;
    const bar = card.querySelector('.q-bar span');
    if (bar) bar.style.width = `${(n / allQuestions.length) * 100}%`;
  }

  // Vše na jedné stránce: úvod, 15 otázek, odeslání.
  function renderForm() {
    show(`
      <p class="q-eyebrow">Váš investiční profil</p>
      <h1 class="q-title">Příležitosti, které odpovídají <span class="q-accent">vašim představám.</span></h1>
      <p class="q-text">Každý investor má odlišné cíle, zkušenosti a požadavky na využití svého kapitálu. Proto nechceme všem členům představovat stejné investiční nabídky.</p>
      <p class="q-text">Prostřednictvím krátkého investičního profilu nám pomůžete lépe porozumět vašim preferencím, požadovanému horizontu, očekávanému výnosu i přístupu k riziku.</p>
      <p class="q-text">Na základě těchto informací budeme moci cíleněji představovat investiční projekty a jejich podmínky, které odpovídají vašim deklarovaným zájmům.</p>
      <p class="q-motto">Váš kapitál. Vaše preference. Váš výběr.</p>
      <p class="q-small">Vyplnění probíhá jednoduše, výběrem odpovědí. Nevyžadujeme žádné finanční dokumenty a své preference budete moci později aktualizovat.</p>
      <div class="q-progress q-sticky"><span class="q-count"></span><span class="q-bar"><span></span></span></div>
      <form class="q-form" novalidate>
        ${allQuestions.map(questionHtml).join('')}
        <div class="q-nav">
          <button type="submit" class="cta q-next">Dokončit investiční profil ${arrow}</button>
        </div>
      </form>`);
    countDone();
  }

  function renderDone() {
    show(`
      <div class="q-done-icon">${check}</div>
      <p class="q-eyebrow">Investiční profil dokončen</p>
      <h1 class="q-title">Váš investiční profil je připraven.</h1>
      <p class="q-text">Děkujeme za vyplnění. Vaše odpovědi nám pomohou lépe porozumět vašim preferencím a zaměřit následné představení investičních projektů na relevantní oblasti.</p>
      <p class="q-small">Konkrétní nabídky a jejich podmínky budou posuzovány samostatně.</p>
      <div class="q-nav">
        <button type="button" class="q-prev" data-edit>Upravit odpovědi</button>
        <a class="cta q-next" href="index.html#klub">Zpět do klubu ${arrow}</a>
      </div>`);
  }

  // Výběr odpovědí: limit u „max“, vylučující volba u „multi“.
  card.addEventListener('change', (e) => {
    const input = e.target;
    if (!input.matches('.q-opt input')) return;
    const fs = input.closest('.q-question');
    const q = blocks.flatMap((b) => b.questions).find((x) => x.id === fs.dataset.q);
    const boxes = Array.from(fs.querySelectorAll('input'));
    if (q.type === 'max' && input.checked && boxes.filter((b) => b.checked).length > q.max) {
      input.checked = false;
      fs.querySelector('.q-error').textContent = `Vyberte maximálně ${q.max === 2 ? 'dvě' : q.max} možnosti.`;
      return;
    }
    if (q.exclusive && input.checked) {
      if (input.value === q.exclusive) boxes.forEach((b) => { if (b !== input) b.checked = false; });
      else boxes.forEach((b) => { if (b.value === q.exclusive) b.checked = false; });
    }
    answers[q.id] = boxes.filter((b) => b.checked).map((b) => b.value);
    fs.querySelector('.q-error').textContent = '';
    fs.classList.remove('is-missing');
    save(false);
    countDone();
  });

  card.addEventListener('submit', (e) => {
    const form = e.target.closest('.q-form');
    if (!form) return;
    e.preventDefault();
    let firstMissing = null;
    allQuestions.forEach((q) => {
      const fs = form.querySelector(`[data-q="${q.id}"]`);
      const ok = (answers[q.id] || []).length > 0;
      fs.classList.toggle('is-missing', !ok);
      fs.querySelector('.q-error').textContent = ok ? '' : 'Vyberte prosím odpověď.';
      if (!ok && !firstMissing) firstMissing = fs;
    });
    if (firstMissing) { firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    save(true);
    renderDone();
  });

  card.addEventListener('click', (e) => {
    if (e.target.closest('[data-edit]')) { e.preventDefault(); renderForm(); }
  });

  if (isMember) renderForm(); else renderLocked();
})();
