/* Select Club — hlavička na podstránkách: menu pro členy, Login / Odhlásit, mobilní menu. */
(() => {
  'use strict';
  let member = false;
  try { member = localStorage.getItem('ic-member') === '1'; } catch (e) { /* storage blocked */ }
  document.body.classList.toggle('access-locked', !member);
  document.body.classList.toggle('is-member', member);

  const btn = document.getElementById('sub-login');
  if (btn && member) {
    btn.querySelector('span').textContent = 'Odhlásit';
    btn.setAttribute('href', 'index.html');
    btn.addEventListener('click', () => { try { localStorage.removeItem('ic-member'); } catch (e) { /* storage blocked */ } });
  }

  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('main-nav');
  if (toggle && menu) {
    const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Otevřít navigaci'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Zavřít navigaci' : 'Otevřít navigaci');
    });
    document.addEventListener('click', (e) => { if (!menu.contains(e.target) && !toggle.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }
})();
