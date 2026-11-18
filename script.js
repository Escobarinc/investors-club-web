'use strict';

// Functional browser-only demo: no network, no external dependencies, no data persistence.
const $ = (selector) => document.querySelector(selector);
const byId = (id) => document.getElementById(id);
const menu = byId('mobileNav');
const toggleMenu = byId('mobileMenuToggle');
const dialog = byId('infoDialog');
const initial = byId('formInitial');
const verify = byId('formVerify');
const success = byId('formSuccess');
const fields = {
  name: byId('fullName'),
  phone: byId('phone'),
  email: byId('email'),
  capital: byId('capital')
};
const errors = {
  name: byId('nameError'),
  phone: byId('phoneError'),
  email: byId('emailError'),
  capital: byId('capitalError')
};

const info = {
  club: {
    title: 'O klubu',
    text: 'Investors Club nabízí přístup k vybraným investičním projektům od 1 milionu Kč. Přístup do klubu podléhá individuálnímu schválení.'
  },
  projects: {
    title: 'Vybrané projekty',
    text: 'Projekty mají různé výnosy, podmínky a formy zajištění. Konkrétní nabídky nejsou v dodaném podkladu uvedeny a v tomto demu nejsou zveřejněny.'
  },
  how: {
    title: 'Jak to funguje',
    text: 'Zájemce vyplní žádost o přístup. V reálném provozu následuje ověření telefonního čísla a individuální posouzení žádosti. Tento web pouze ukazuje průchod formulářem; neposílá SMS ani žádost.'
  }
};

function closeMenu() {
  menu.hidden = true;
  toggleMenu.setAttribute('aria-expanded', 'false');
  toggleMenu.setAttribute('aria-label', 'Otevřít nabídku');
}

toggleMenu.addEventListener('click', () => {
  const open = menu.hidden;
  menu.hidden = !open;
  toggleMenu.setAttribute('aria-expanded', String(open));
  toggleMenu.setAttribute('aria-label', open ? 'Zavřít nabídku' : 'Otevřít nabídku');
});

const ACCESS_KEY = 'ic-access-granted';
function unlockMenu() {
  document.body.classList.remove('access-locked');
}
try { if (localStorage.getItem(ACCESS_KEY) === '1') unlockMenu(); } catch (e) {}

function focusApplication() {
  closeMenu();
  if (dialog.open) dialog.close();
  const card = byId('applicationCard');
  if (card.hidden) {
    card.hidden = false;
    card.classList.add('is-revealed');
  }
  byId('applicationCard').scrollIntoView({behavior: 'smooth', block: 'center'});
  if (!initial.hidden) window.setTimeout(() => fields.name.focus({preventScroll:true}), 200);
}

byId('requestAccess').addEventListener('click', focusApplication);
byId('dialogApply').addEventListener('click', focusApplication);

for (const link of document.querySelectorAll('[data-info]')) {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    closeMenu();
    const data = info[link.dataset.info];
    byId('dialogTitle').textContent = data.title;
    byId('dialogText').textContent = data.text;
    dialog.showModal();
  });
}

for (const link of document.querySelectorAll('[data-action="contact"]')) {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    focusApplication();
  });
}
byId('closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

function validate(id) {
  const element = fields[id];
  let error = '';
  const value = element.value.trim();
  if (id === 'name') {
    if (value.length < 3 || value.split(/\s+/).length < 2) error = 'Zadejte jméno i příjmení.';
  } else if (id === 'phone') {
    const phoneDigits = value.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 15) error = 'Zadejte platné telefonní číslo.';
  } else if (id === 'email') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Zadejte platný e-mail.';
  } else if (id === 'capital') {
    if (!value) error = 'Vyberte investiční kapitál.';
  }
  element.closest('.field').classList.toggle('invalid', Boolean(error));
  element.setAttribute('aria-invalid', String(Boolean(error)));
  element.setAttribute('aria-describedby', id + 'Error');
  errors[id].textContent = error;
  return !error;
}

for (const [id, element] of Object.entries(fields)) {
  element.addEventListener('input', () => {
    if (element.closest('.field').classList.contains('invalid')) validate(id);
  });
  element.addEventListener('change', () => validate(id));
}

byId('applicationForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const results = Object.keys(fields).map((id) => [id, validate(id)]);
  const invalid = results.find(([,valid]) => !valid);
  if (invalid) {
    fields[invalid[0]].focus();
    return;
  }
  initial.hidden = true;
  verify.hidden = false;
  success.hidden = true;
  byId('verificationCode').value = '';
  byId('verifyError').hidden = true;
  byId('verificationCode').focus();
});

function demoVerify() {
  const good = byId('verificationCode').value.trim() === '123456';
  byId('verifyError').hidden = good;
  if (good) {
    verify.hidden = true;
    success.hidden = false;
    unlockMenu();
    try { localStorage.setItem(ACCESS_KEY, '1'); } catch (e) {}
    byId('restartButton').focus();
  } else {
    byId('verificationCode').focus();
  }
}
byId('verifyButton').addEventListener('click', demoVerify);
byId('verificationCode').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') demoVerify();
});
byId('verificationCode').addEventListener('input', () => {
  byId('verifyError').hidden = true;
});
byId('backButton').addEventListener('click', () => {
  verify.hidden = true;
  initial.hidden = false;
  fields.phone.focus();
});
byId('restartButton').addEventListener('click', () => {
  byId('applicationForm').reset();
  for (const [id, element] of Object.entries(fields)) {
    element.closest('.field').classList.remove('invalid');
    element.removeAttribute('aria-invalid');
    errors[id].textContent = '';
  }
  success.hidden = true;
  initial.hidden = false;
  fields.name.focus();
});
