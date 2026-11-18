# Assumptions and limitations

- Reference is a presentation mockup. Crop used: (19, 22, 1289, 860), removing light exterior and rounded presentation frame.
- Screenshot is only the visible fold. No below-fold sections, invented projects, fabricated investment results, or contact addresses were added.
- Body text is legible and transcribed as displayed. Minor letter-spacing, typeface and pixel measurements are estimated; exact proprietary font and original photographic source are unknown.
- Hero photograph: generative image tool repeatedly rendered a whole webpage despite requesting a photo-only asset. Final photo-only decorative file was reconstructed from an **AI-generated** image by cropping away the top interface, inpainting leftover text, dark-masking the remaining text-bearing left area, and padding the photograph vertically; no pixels from the user-provided screenshot are included. Source asset is not a photo of an actual specific property or office.
- Visual site has no visible footer in the source; semantic zero-height footer included.
- No actual membership backend, actual club representatives, contact address or investment inventory were supplied. Membership/contact forms implement genuine browser validation and local demo saving; they clearly say no real message is sent.
- The top nav actions not represented as sections in the screenshot open accessible overlays instead of introducing nonexistent visual sections; "O klubu" scrolls to the benefit band.
- Photo framing, font stack and colors are approximated; an original photo source would be needed for pixel-accurate identity. Local Chromium navigation was blocked by the testing environment, so browser testing inlined the exact local HTML/CSS/JS and asset contents; separately, the supplied verify.py checked the relative filesystem paths.
