# Investors Club — rekonstrukce dodaného screenshotu

MODE = REPLICA
SOURCE = CLARIX_klub_1mil_titulka_varianta_1.png, 1536×1024, čistý screenshot; žádný ořez
REFERENCE_WIDTH = 1440px (měření násobeno 0.9375 oproti zdroji)
CONTAINER_MAX = 1320px; GUTTER = 44px; GRID = 2 sloupce (62.6%/37.4%)

## Typografie (1440px)
Primary serif: Georgia, 'Times New Roman', serif — screenshot má kontrastní moderní serif
Sans: Arial, Helvetica, sans-serif
Hero H1 66px /700 /1.03 / tracking -1.2px; body 25px /400 /1.34; kicker 22px /700 /1.2 / letter-spacing 2px
Form H2 44px /700 /1.12; navigation 22px /400 /1.2; feature titles 26px /700 /1.12
Headline exact breaks: "Vybrané projekty." / "Nové investiční možnosti."

## Colors (sampled/estimated from reference)
text #101010; muted #393331; bg #fbf7f3; surface #fffdfb; border #b5aaa2; accent #9b640f; cta_bg #d6a250; cta_text #0d0a07
CTA gradient #f0c37e → #b98325, radius 10px

## Sections
S1 header.site-header — 89px at reference width, translucent #fffaf6; logo at x=112, nav x=630-1330
S2 section#hero — 871px; full-bleed photograph with light blank reading area left, glass skyline right; hero copy at x=113, y=70 relative to hero; access form on right
No additional content below screenshot's fold; no invented sections, except visually quiet footer only if later requested.
Total page height 960px at 1440px.

## Hero detail
Hero copy: width 730px; offset x=113px y=68px
Kicker: "VYBRANÉ INVESTIČNÍ PŘÍLEŽITOSTI OD 1 MIL. KČ"; amber underline 63px
H1: "Vybrané projekty." / "Nové investiční možnosti." (2 lines); first black, second bronze
H1 width 780px; body width 590px
CTA label "POŽÁDAT O PŘÍSTUP K PROJEKTŮM"; 480×64px, radius 10px
Form panel: x=952px, y=64px, width=447px, h=546px at reference; white translucent panel, radius 21px, thin double gold border, padded 34px
Fields: name, phone, email, capital; each ~49px tall; card CTA 377×63px
Benefit bar: x=44px, y=688px (hero-relative), width=1352px, height=152px; white translucent rounded 20px; 4 equal features
Features: "Vybrané projekty", "Investiční příležitosti", "Detailní podklady", "Schvalovaný přístup"

## Asset manifest geometry
hero_photo: photographic penthouse space behind UI, width 1440px, height 871px, object-fit cover, object-position 50% 50%; subject backdrop composited as separate image, no UI/text.

## Token contract
:root {
  --header-h:89px; --hero-h:871px; --container-max:1320px; --gutter:44px;
  --ink:#101010; --muted:#393331; --bg:#fbf7f3; --surface:#fffdfb;
  --border:#b5aaa2; --accent:#9b640f; --cta:#d6a250; --cta-text:#0d0a07;
  --serif:Georgia,'Times New Roman',serif; --sans:Arial,Helvetica,sans-serif;
  --h1:66px; --h1-leading:1.03; --body:25px; --body-leading:1.34;
  --panel-radius:21px; --button-radius:10px;
}

### Verified vs inferred
Measurements manually derived from the single PNG. Font family is an approximation; no font files or brand manual supplied. Form must demonstrate local validation without implying real SMS verification, membership approval, or a back-end integration.
