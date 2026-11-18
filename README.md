# Investors Club — responzivní replika

## Spuštění

Rozbalte ZIP a otevřete `index.html` přímo v prohlížeči. Není potřeba instalace, internet ani build.

## Co je funkční

- Původní tmavá grafika s texty „Vybrané projekty. Nové investiční možnosti.“ a výhodami Vybrané projekty, Investiční příležitosti, Detailní podklady, Schvalovaný přístup.
- Návštěvník nejdřív nevidí menu, jen tlačítko „Požádat o přístup k projektům“. To otevře formulář Žádost o přístup (jméno, telefon, e-mail, investiční kapitál).
- Ukázkové ověření SMS kódem (demo kód `123456`, žádná SMS se neposílá). Po ověření se zobrazí menu (O klubu, Vybrané projekty, Jak to funguje, Kontakt); prohlížeč si přístup pamatuje (localStorage `ic-access-granted`).
- Počítačová i mobilní verze, klávesnice (Tab, Enter, Escape).

## Co není připojené

Z důvodu chybějícího API, e-mailu a CRM se žádosti skutečně neodesílají. Dialog to viditelně sděluje. Vybrané projekty, výnosy ani kontaktní údaje se nevymýšlejí.

`SPEC.md` a `geometry.json` obsahují závazné rozměry. `assets.json` obsahuje manifest fotografického pozadí a `ASSUMPTIONS.md` výslovně uvádí odhady.
