# Design system: Mobius company website

User direction (2026-11-10): own universe, Möbius loop and cycles of time; quantum particles, explicitly no metallic ribbon. Latest review asks for the visual quality and animation discipline seen on Distyl and Apple. Keep this revision local; publication is deferred.

## Visual direction

- Scene: an enterprise owner or information team in Shaanxi explores the business on a laptop, tablet or phone. Native Chinese content and a clear contact action remain the main task.
- Observed references: Distyl's generous negative space, compact navigation, clear headline hierarchy and live sculptural hero; Apple's large product focus, restrained typography and chapters revealed through scrolling. These are observations of the current sites, not a statement of either company's formal design rules. See docs/company-website/SOURCES.md.
- Apply those patterns through our own black particle scene and cool-white business chapter. Do not copy logos, proprietary product names, customer evidence or Apple product media.
- Palette: #03060b space, #f5f6f8 text, #a6aaba supporting text, #b9d9f4 accent. The business chapter uses #f8f9fb with dark blue-black type and thin blue-gray relationship lines. Root tokens use OKLCH.
- Type: local system Chinese sans, with no runtime font downloads. Desktop H1 max 76px, chapter headings 32–58px, body 18–21px. Avoid an all-caps English decorative layer.
- Layout: compact 64px fixed header; one centered hero; one scroll narrative; a light business chapter with eight native tabs and shared detail; a sparse four-stage delivery cycle; company/contact/footer. Gutters scale from 24 to 96px, content caps at 1280px.

## Signature motion

- One 220svh desktop / 190svh phone sequence follows native scrolling. No wheel interception or timed navigation.
- Native WebGL renders a half-twisted particle ribbon around a three-dimensional infinity centerline: cool-white/blue points, slow flow and shimmer. No solid metallic surface or lighting material.
- Desktop scrolling repositions and turns the field before the second statement becomes fully visible. The second statement has clear space on the right. Phones retain the particle field below the text while the statement changes above it.
- The scene uses one GPU draw call per frame, fixed buffers, capped pixel density and imperative refs. It pauses outside the scene or while the document is hidden. There are no per-frame React state updates or added rendering dependencies.
- Text fades are short; invisible interactive layers become inert. Business tab changes use a small 240ms transition. The delivery loop has a slow trace; no repeated scroll reveals across every section.
- Reduced-motion uses the generated particle poster and normal sequential text, with the canvas and trace hidden. GPU initialization failure or context loss uses the same readable fallback. A noscript layout exposes the statements and all eight business descriptions.

## Interaction and assets

- White primary action, restrained outline contact action, visible focus and keyboard-operated business tabs (arrows, Home, End).
- Native SVG business relationships change with the selected direction. A separate compact layout keeps phone labels readable; neither layout repeats the hero artwork.
- Optimized particle WebP remains the static fallback. The earlier wide particle asset is retained for recovery but no longer repeats within the page. No metallic concept asset is shipped.
- Concept references are generated images outside the repository. Browser screenshots are the evidence of the actual implementation; see EVIDENCE.md for the comparison and limits.
