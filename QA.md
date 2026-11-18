# Visual QA — 13 November 2026

Reference image: user upload, cropped 1270×838 at (19,22,1289,860).
Browser screenshot: 1440×950 (Chromium), plus 390×844 and 768×1024.

## Round 1 comparison and adjustments

1. **Hero composition:** The AI generator repeatedly produced webpage mockups instead of photo-only. Extracted only the newly generated physical lounge scene, removed all UI remnants, then adjusted the chair scale by padding the image to a better background ratio. **Residual difference:** sunset framing and chair are not identical to source, with slight smoothing artifacts in the skyline.
2. **Page proportions:** Header 126px, hero 632px, feature band 192px, total 950px at 1440px. Matched by browser measurements and the supplied verifier.
3. **Type:** Reference uses a delicate serif. Local Baskerville / Iowan / Georgia stack approximates this; exact original font unavailable. **Residual difference:** small line-height and glyph-shape variations.
4. **Content:** All visible text reproduced. No unshown investment projects, external statistics or invented contacts.
5. **Feature strip:** Four evenly spaced columns with golden line icons and accurate Czech labels; positions and section height match source within visual tolerance.

## Browser interaction QA

- Chromium ran HTML/CSS/JS with locally inlined exact file contents (administrator policies blocked navigation to both file:// and localhost). Testing the direct local URL in this sandbox is therefore **NOT_DONE**; internal-link existence separately **VERIFIED** by supplied verify.py.
- Desktop 1440×950: screenshot rendered; measured body height 950px, horizontal overflow absent.
- Mobile 390×844: layout 390px wide, no horizontal overflow; mobile menu opens and closes, project dialog opens and Escape closes it.
- Tablet 768×1024: layout 768px wide, no horizontal overflow; menu and dialog work.
- Both forms: required field validation and confirmation states executed. No network submission is claimed.
- Browser JavaScript console errors: `[]`.

## Result

`VERIFIED`: website files / asset manifest / geometry, browser rendering of inlined local assets, desktop + tablet + mobile interaction smoke tests.
`ASSUMED`: exact photo, proprietary font, precise colors and spacing inferred from the reference.
`NOT_DONE`: production backend, true membership submissions, production URL/deployment, actual file:// navigation in restricted sandbox.
