# Investors Club — REPLICA specification

Reference: user-provided image, crop `(19, 22, 1289, 860)`, screenshot content 1270×838.
Reference viewport: **1440px**; target height: **950px** (838/1270×1440 ≈ 950.17px).

## Classification
B. PRESENTATION MOCKUP. The screenshot is embedded in a light rounded presentation frame. The wrapper was cropped off; only the internal dark website is binding.

## Geometry / hard values
- MODE: REPLICA
- CONTAINER_MAX: 1440px
- GUTTER: 84px on 1440px
- GRID: header brand/links/CTA with flex; feature band four equal columns, 0px gap
- HEADER: height 126px, transparent over shared hero photograph
- HERO: height 632px, continuation of shared hero photograph
- FEATURES: height 192px, full width, four equal columns
- FOOTER: height 0px; semantic/screen-reader only to avoid inventing unseen visual material
- TOTAL: 950px.
- Photo shell: 758px high, background position center 59%, image overlay darkens left ~60%.
- Hero headline region: left x84px, top y~245px (within hero top ~119px), width 720px.
- Hero left padding: 84px; top padding: 84px (eyebrow appears around y210px).
- H1 exact line breaks: `Klub pro investory` / `od 1 mil. Kč`
- Hero CTA: 335×70px, radius 10px, gold background, black text.
- Header CTA: 217×56px, radius 10px.
- Feature icons: 42px; labels ~20px centered, 2 lines where shown.
- Logo: custom 3-bar inline SVG icon 44×44px, text 40px (Baskerville).

## Typography (1440px)
- Character: classic editorial serif for logo/headline, clean modern sans for labels.
- Headline stack: Baskerville, Iowan Old Style, Georgia, Times New Roman, serif.
- Sans stack: Arial, Helvetica Neue, Helvetica, sans-serif.
- h1: 77px / 400 / lh 0.99 / tracking -1.8px; body: 22px / 400 / lh 1.42; eyebrow: 19px / 600, uppercase, tracking 2.8px.
- Header nav: 17px; features: 20px / lh1.33; header logo: 40px.
- h1/body size ratio 3.5.

## Colors (approximated by sampling user image)
- text #f7f4f3; muted #e0dcd9; background #0c0d12;
- hero overlay #090b11; features surface #161313; divider #55453d;
- accent #d7b674; CTA #e4c486 → #cfa567; CTA text #191a1b.

## Sections, in order
1. `<header class="site-header">` 126px — logo, nav `O klubu`, `Vybrané projekty`, `Členství`, `Kontakt`, top membership CTA.
2. `<section id="hero">` 632px — eyebrow, headline, exact paragraph and membership CTA. One single photograph extends behind header+hero.
3. `<section id="features">` 192px — four vertically centered cards without card backgrounds, separators, golden line icons, visible text.
4. `<footer class="site-footer">` 0px — semantic only; screenshot shows no footer material.

## Visible copy, faithfully transcribed
- INVESTORS CLUB
- Klub pro investory / od 1 mil. Kč
- Přístup k vybraným projektům, odborným analýzám / a investičním příležitostem, které nejsou veřejně dostupné.
- Požádat o členství
- Exkluzivní / projekty
- Odborný servis / a osobní přístup
- Detailní podklady / a analýzy
- Diskrétnost / a soukromí

## CSS root tokens
```css
:root {
  --content-width:1440px; --gutter:84px;
  --header-height:126px; --hero-height:632px; --features-height:192px; --footer-height:0px;
  --font-serif:Baskerville,"Iowan Old Style",Georgia,"Times New Roman",serif;
  --font-sans:Arial,"Helvetica Neue",Helvetica,sans-serif;
  --text:#f7f4f3; --muted:#e0dcd9; --bg:#0c0d12; --surface:#161313;
  --divider:#55453d; --accent:#d7b674; --cta-start:#e4c486; --cta-end:#cfa567;
  --cta-text:#191a1b; --cta-radius:10px;
  --logo-size:40px; --h1-size:77px; --h1-lh:.99; --body-size:22px;
  --eyebrow-size:19px; --nav-size:17px; --feature-label-size:20px;
  --hero-cta-width:335px; --hero-cta-height:70px; --header-cta-width:217px; --header-cta-height:56px;
}
```
