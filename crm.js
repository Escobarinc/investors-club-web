/* Investors Club — napojení na CLARIX CRM (sdílené: žádost o přístup, kontakt). */
(() => {
  'use strict';
  // ---- Napojení na CLARIX CRM ----
  // siteKey = klíč webu z CRM (Nastavení → Weby a měření). Bez klíče formulář nic neodešle a řekne to.
  const CRM = {
    origin: 'https://clarix-crm.onrender.com',
    siteKey: '',
    formName: 'Žádost o přístup'
  };

  function utm() {
    const q = new URLSearchParams(location.search);
    const u = {};
    ['source', 'medium', 'campaign', 'content', 'term'].forEach((k) => { u[k] = q.get('utm_' + k) || ''; });
    return u;
  }
  CRM.sendLead = async function sendLead(data) {
    if (!CRM.siteKey) throw new Error('not-configured');
    const q = new URLSearchParams(location.search);
    const body = {
      k: CRM.siteKey,
      name: data.name, email: data.email, phone: data.phone,
      ...(data.consent !== undefined ? { consent: data.consent } : {}),
      formular: data.formular || CRM.formName,
      message: data.message || ('Orientační výše plánované investice: ' + data.capital),
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
  };
  window.IC_CRM = CRM;
})();
