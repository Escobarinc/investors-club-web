/* Select Club — souhlas s cookies (převzato z Dluhopisového Radaru, stejný provozovatel). */
/* COOKIES – dvouvrstvá lišta souhlasu (Nastavení soukromí), záložka a odkaz „Nastavení cookies“
   Pravidla: nepovinné technologie až po souhlasu; analytické a marketingové zvlášť; záznam verze, kategorií a času;
   po odvolání smazat vlastní nepovinné identifikátory. Odmítnutí nijak neomezuje formuláře. */
(()=>{
 const KEY='select-cookies',VERZE='2026-11-24',PLATNOST=365*864e5;
 /* Inventář technologií – vyplňovat jen skutečně nasazené (název, poskytovatel, účel, doba platnosti). */
 const INVENTAR={
  nezbytne:[
   ['select-cookies','9394 Group s.r.o.','Uložení nastavení soukromí, zvolených kategorií, verze a času rozhodnutí.','12 měsíců platnosti volby; lokální úložiště prohlížeče.'],
   ['ic-member','9394 Group s.r.o.','Zapamatování přihlášení člena klubu.','Do odhlášení; lokální úložiště prohlížeče.'],
   ['ic-investicni-profil','9394 Group s.r.o.','Uložení odpovědí z investičního dotazníku v prohlížeči člena.','Do smazání; lokální úložiště prohlížeče.']
  ],
  analyticke:[
   ['clx_v, clx_ft','CLARIX CRM (9394 Group s.r.o.)','Měření návštěvnosti webu a přiřazení poptávky k návštěvě.','clx_v do smazání; clx_ft po dobu relace.'],
   ['_ga','Google Analytics','Rozlišení uživatelů webu.','2 roky'],
   ['_ga_*','Google Analytics','Uchování stavu návštěvy a relace uživatele.','2 roky']
  ],
  marketingove:[
   ['_fbp','Meta','Identifikace prohlížeče pro reklamní měření a optimalizaci reklamy.','90 dní'],
   ['_fbc','Meta','Přiřazení návštěvy nebo konverze ke kliknutí na reklamu.','90 dní']
  ]
 };
 const read=()=>{try{const c=JSON.parse(localStorage.getItem(KEY)||'null');if(!c||c.verze!==VERZE||Date.now()-Date.parse(c.cas)>PLATNOST)return null;return c}catch(e){return null}};
 const OPTIONAL=/^(_ga|_gid|_gat|_gcl|_fbp|_fbc|_clck|_clsk)/;
 const wipe=()=>{document.cookie.split(';').map(v=>v.split('=')[0].trim()).filter(n=>OPTIONAL.test(n)).forEach(n=>{const h=location.hostname.split('.');for(let i=0;i<h.length;i++){const d=h.slice(i).join('.');document.cookie=`${n}=; Max-Age=0; path=/; domain=${d}`}document.cookie=`${n}=; Max-Age=0; path=/`})};
 const apply=(c,prev)=>{
  window.selectConsent=c;
  if(typeof window.gtag==='function')window.gtag('consent','update',{analytics_storage:c&&c.analyticke?'granted':'denied',ad_storage:c&&c.marketingove?'granted':'denied',ad_user_data:c&&c.marketingove?'granted':'denied',ad_personalization:c&&c.marketingove?'granted':'denied'});
  if(prev&&((prev.analyticke&&!c.analyticke)||(prev.marketingove&&!c.marketingove)))wipe();
  if(c&&c.analyticke&&typeof window.loadCrmTracking==='function')window.loadCrmTracking();
  document.dispatchEvent(new CustomEvent('select:consent',{detail:c}));
 };
 const save=(a,m)=>{const prev=window.selectConsent;const c={verze:VERZE,nezbytne:true,analyticke:!!a,marketingove:!!m,cas:new Date().toISOString()};try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}apply(c,prev)};
 const rows=list=>list.length?`<table class="ck-tech"><thead><tr><th>Název</th><th>Poskytovatel</th><th>Účel</th><th>Doba platnosti</th></tr></thead><tbody>${list.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`:'<p class="ck-none">Na webu zatím nepoužíváme žádnou technologii této kategorie.</p>';
 const cat=(id,title,text)=>`<div class="ck-cat"><div class="ck-cat-head">${id==='nezbytne'?'<span class="ck-always">Vždy aktivní</span>':`<label class="ck-switch"><input type="checkbox" data-ck="${id}"><i aria-hidden="true"></i><span class="sr-only">Povolit: ${title}</span></label>`}<div><b>${title}</b><small>${text}</small></div></div><details class="ck-details"><summary>Seznam technologií</summary>${rows(INVENTAR[id])}</details></div>`;
 const LINKS='<a href="zasady-cookies.html">Zásadách používání cookies</a> a <a href="zasady-ochrany-osobnich-udaju.html">Zásadách ochrany osobních údajů</a>';
 const bar=document.createElement('section');
 bar.className='ck-bar';bar.hidden=true;bar.setAttribute('role','dialog');bar.setAttribute('aria-labelledby','ck-title');
 bar.innerHTML=`<div class="ck-inner">
  <div class="ck-l1"><h2 id="ck-title">Nastavení soukromí</h2><p>Na tomto webu používáme nezbytné technologie pro jeho fungování. S vaším souhlasem využíváme také analytické a marketingové cookies a podobné technologie pro měření návštěvnosti a účinnosti reklam. Podrobnosti najdete v ${LINKS}.</p></div>
  <div class="ck-l2" hidden><div class="ck-grid">${cat('nezbytne','Nezbytné','Základní funkčnost, bezpečnost a uložení volby souhlasu. Bez souhlasu, jen v zákonném nezbytném rozsahu.')}${cat('analyticke','Analytické','Statistiky návštěvnosti, používání stránek a konverzí. Pouze se souhlasem.')}${cat('marketingove','Marketingové','Měření účinnosti reklam, přiřazení konverzí a případné reklamní publikum. Pouze se souhlasem.')}</div><p class="ck-docs">Podrobnosti v ${LINKS}.</p></div>
  <div class="ck-actions"><button type="button" class="ck-btn" data-ck-act="none">Odmítnout vše</button><button type="button" class="ck-btn" data-ck-act="settings">Nastavení</button><button type="button" class="ck-btn" data-ck-act="save" hidden>Uložit nastavení</button><button type="button" class="ck-btn" data-ck-act="all">Přijmout vše</button></div>
  <button type="button" class="ck-handle" aria-label="Skrýt nastavení soukromí" hidden></button></div>`;
 const tab=document.createElement('button');
 tab.type='button';tab.className='ck-tab';tab.hidden=true;tab.setAttribute('aria-label','Nastavení cookies');
 tab.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 3 3 0 0 1-3.5-3A3 3 0 0 1 14 5.5 3 3 0 0 1 12 3z"/><circle cx="8.5" cy="10.5" r=".9"/><circle cx="12" cy="15.5" r=".9"/><circle cx="16" cy="13" r=".9"/></svg>Cookies';
 document.body.append(bar,tab);
 const $=s=>bar.querySelector(s);
 const layer=two=>{$('.ck-l2').hidden=!two;$('[data-ck-act="settings"]').hidden=two;$('[data-ck-act="save"]').hidden=!two};
 const open=(two)=>{const c=window.selectConsent||{};bar.querySelectorAll('[data-ck]').forEach(b=>b.checked=!!c[b.dataset.ck]);layer(!!two);$('.ck-handle').hidden=!window.selectConsent;bar.hidden=false;tab.hidden=true;requestAnimationFrame(()=>bar.classList.add('is-open'))};
 const close=()=>{bar.classList.remove('is-open');setTimeout(()=>{bar.hidden=true;tab.hidden=false},250)};
 bar.addEventListener('click',e=>{
  if(e.target.closest('.ck-handle')){close();return}
  const act=e.target.closest('[data-ck-act]')?.dataset.ckAct;if(!act)return;
  if(act==='settings'){layer(true);return}
  if(act==='all')save(true,true);
  else if(act==='none')save(false,false);
  else save($('[data-ck="analyticke"]').checked,$('[data-ck="marketingove"]').checked);
  close();
 });
 tab.addEventListener('click',()=>open(true));
 document.addEventListener('click',e=>{if(e.target.closest('[data-open-cookies]')){e.preventDefault();open(true)}});
 const inv=document.querySelector('[data-ck-inventory]');
 if(inv)inv.innerHTML=[['nezbytne','Nezbytné'],['analyticke','Analytické'],['marketingove','Marketingové']].map(([k,t])=>`<h3>${t}</h3>${rows(INVENTAR[k])}`).join('');
 const c=read();
 if(c){apply(c,null);tab.hidden=false}else{window.selectConsent=null;open(false)}
})();
