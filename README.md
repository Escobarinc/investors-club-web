# Investors Club — světlá verze

Statická landing page podle podkladu „Vybrané projekty. Nové investiční možnosti.“ (světlý design, formulář Žádost o přístup v úvodní části).

Živě: https://escobarinc.github.io/investors-club-web/

## Spuštění

Otevřete `index.html` v prohlížeči, případně spusťte lokální server ve složce webu. Není potřeba build ani instalace.

## Co je funkční

- Na začátku je vidět jen úvod s tlačítkem „Požádat o přístup k projektům“, bez menu a bez formuláře.
- Kliknutí na tlačítko otevře formulář Žádost o přístup (kontrola jména, telefonu, e-mailu a investičního kapitálu).
- Ukázkový krok ověření SMS kódem (demo kód `123456`, žádná SMS se neposílá).
- Po udělení přístupu se zobrazí menu (O klubu, Vybrané projekty, Jak to funguje, Kontakt). Prohlížeč si přístup pamatuje (localStorage `ic-access-granted`).
- Mobilní menu a responzivní rozložení.

## Co není připojené

Formulář nic neodesílá ani neukládá. Chybí napojení na CRM, SMS bránu a právní texty (zpracování osobních údajů).

Předchozí tmavá verze webu je v historii gitu (commit `304e847`).
