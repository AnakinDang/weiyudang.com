# Design system: Mobius company website

Latest direction: global ambition, quantum particles, Möbius loops and continuous evolution. The founder judged the earlier point-field candidate rough and requested deeper study of Distyl and Apple. No metallic material and no regional brand framing. After reviewing the local optimization, the founder authorized publication on2026-11-10.

## Reference observations and interpretation

- Distyl: compact navigation, serif display with sans body, 32px outer hero framing and a carefully finished dimensional artifact. Its technology area uses eight clear directions, a strong common hierarchy and richer descriptions. The statement chapter combines precise structural graphics with progressive focus.
- Apple: the inspected product hero gives large, carefully lit imagery a distinct area from its lower-left headline. Later chapters change scale and density, with a restrained local navigation. Not every lazy-loaded video played in the inspection environment, so this is not a claim of a complete animation audit.
- Our application: asymmetric particle-art hero; local Chinese display font; a quiet horizontal business rail; distinct quantum illustrations and full direction pages; open delivery sequence; a global mission at the close. These are our design choices rather than either brand's published design doctrine.

## Tokens and typography

- Space #07090e; ink #f4f4f2; supporting #b3bdcd; pale blue #c5d5ed. Light chapters use #f6f7f8, ink #111621, supporting #525e6d and link #275486. Main variables use exact OKLCH equivalents.
- Display: Noto Serif SC 500, locally hosted as Mobius Serif. The v2 WOFF2 subset is 74,404 bytes and covers 435 characters, including the new scenario headings. Source and SIL OFL license are in public/company/fonts. Update the subset when changing display characters.
- Body/UI: local Chinese system sans. Main desktop headline up to64px, section headings32–50px, body17–20px, restrained native labels.
- Headlines and short leads use deliberate wrapping. The global headline has a purposeful three-line phone arrangement. Detailed page headings balance naturally on phones.
- 1280px maximum content width; 24–80px gutters. Fine borders, open layouts and rectangular outline actions. No card grid, fake interface, hero metric or repetitive decorative eyebrow.
- Astryx-informed refinement: a 4px/rem spacing scale, 175ms feedback/exit and 410ms expansion tokens. Desktop capability and solution workflow body text is16px; phone workflow text remains15px. Diagram controls use14px text and a minimum44px target. The site keeps its own native components, fonts, palette and particle renderer rather than adding the Astryx component library.

## Art and motion

- Hero production asset: public/company/quantum-ribbon-v3.webp. Original generated particle/filament probability cloud, with sharp and out-of-focus depths. It is not a metal surface. The poster anchors visual quality.
- A native WebGL texture pass adds very small wave movement, changing light and camera response to scrolling/pointer position. This is motion of generated artwork, not a claim of a physically simulated3D quantum field.
- One full-screen triangle pass, pixel density capped1.5, at most60 render attempts/sec, no React state per frame. Rendering pauses when the scene is mostly outside the viewport or the document is hidden. The poster remains useful with reduced motion, no JavaScript, or unavailable WebGL.
- Platform art: public/company/knowledge-orbits-v3.webp, four orbital probability planes with native labels and a subtle path tracer. Seven companion illustrations in public/company/directions use the same icy-blue particle and filament material: braided agent flows, connected knowledge constellations, a rectilinear semantic lattice, voice waves, relational satellites, expertise trajectories and a closed feedback cycle.
- Homepage tabs and all eight detail pages share DirectionArtwork and its exhaustive direction mapping. Each direction has its own production illustration; the generic repeated flowchart is removed. Illustrations are explanatory metaphors, with native captions and accessible descriptions. They are not screenshots of an operating product.
- Each illustration now has a WebGL field pass and 288 independent moving photons, following precomputed guides specific to its geometry. The original image retains the fine material; the field moves light and filaments while actual points travel along the guides. It is not a CSS rotation of the bitmap. The platform's former single SVG tracer is removed.
- Direction motion caps pixel density at1.5 and render attempts at60/sec, or30/sec when narrower than440px. It starts when visible, pauses offscreen or in a hidden document, and releases its buffers/programs on unmount. The active clock excludes pauses. These are code limits, not a measured device-frame-rate promise.
- Every diagram has a native pause/play control. Reduced motion, loading, missing WebGL and texture failure show the original poster. Native text and labels remain outside the canvas.
- Header withdraws on downward scrolling and reappears when moving up or focusing it. Deep anchor loads initialize the header background correctly. Reduced motion keeps navigation still.
- Header marks the current chapter with a fine underline and aria-current=location. The reading line is the header height plus32px, so the adjacent about/contact columns remain distinguishable. Section measurements share the existing scroll animation frame; React state changes only when the chapter changes.
- The founder requested an icon-only upper-left brand on2026-11-10. The shared header shows only the loop symbol on both home and detail pages, with a minimum44×44px link and its accessible home label. Footer and page metadata retain the project identity.
- Business changes use a small, brief focus/position transition with native content. Eight detailed pages use the same coherent article system; no animation blocks reading.

## Content and interaction

- Home H1: 让 AI，重塑世界的运行方式。
- Homepage overview and eight detailed pages: platform, agents, knowledge, semantics, voice, personalization, capture, improvement.
- All controls, labels, captions and copy are native. Artwork is an independent image asset. Every direction has a working detail link; detail pages have their own canonical and shared navigation.
- Global vision is aspirational. Specific delivery remains project-defined. Vendor outcomes and proprietary readiness are not adopted.
- Contact is a visible mailto link, not a fictitious submission form.
- A dark, open solution list follows the light technology area. Six native details disclosures cover retail, finance, supply chain, video/brand content, operations and customer service. Each contains a system introduction, three concrete workflow phases and a topic-specific contact link. One opens at a time. No fictional client logos, achieved metrics or fabricated product screens.
- The solution section follows the generated section concept: left-aligned serif heading, fine row dividers, category/title pairs and an open two-column expanded area with a three-phase light trace. Phones stack the phases beside a vertical trace. The homepage navigation adds a solution anchor; phones retain compact business, solution and contact links.
- Solution disclosures retain native details semantics and keyboard operation. Supporting browsers interpolate the content height with a410ms expansion and175ms exit; other browsers retain native immediate disclosure. Reduced motion explicitly removes both open and closed transitions. Expansion no longer adds a separate blur/position effect to the body.

## Concept fidelity

Four coordinated concepts cover hero, capabilities, delivery/contact and detail template. The founder's later instructions explicitly change visible copy to a global narrative, remove geographical language, and expand detail content. These authorized changes explain copy and resulting vertical-density differences from the concept images. Native type, asset material, geometry, spacing rhythm and interaction remain the reference.

See docs/company-website/EVIDENCE.md for the current verification and docs/company-website/REFINEMENT-2026-11-10.md for source observations and asset prompts.

## 四项演示与连续叙事

2026-11-10：首页加入同一WebGL画面中的知识、协作、行动、反馈四阶段；正式粒子图片在阶段间混合，480个光点沿相应轨迹连续变形。原首屏与八方向图形保留。手机图形固定在阅读区上方；导航定位到原生标题，支持暂停和减少动画的静态降级。

演示目录使用四条开放作品行。定制智能体以配置、群聊和最终报表连接完整任务；财务与供应链保留可复核计算依据；剪辑使用原生HTML场景、时间线、字幕与控件，按创始人指令移除了示例视频。详情使用简洁标题和工作台，不重复铺设莫比乌斯首屏图。新增宋体子集v3覆盖649字形，113948字节。详细交互合同、概念差异与证据见 docs/company-website/WORK-DEMO-DESIGN.md。

## AI Native terminology — 2026-11-11

Use AI and Agent consistently across native copy, metadata and exports. Technical labels mix familiar industry terms with Chinese explanations: AI Native, Context Engineering, Workflow, Ontology, Voice AI and Evals. Preserve the quantum visual identity and icon-only header. The v4 display subset covers754 characters,135348 bytes, including Latin letters and the new Chinese headings; it has a new asset URL so existing font caches remain valid. Validate mixed-language headings and navigation at desktop, tablet and phone widths.
