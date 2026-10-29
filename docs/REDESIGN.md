# Light-and-green portfolio redesign

29 October 2026

The new visual direction takes inspiration from [Potadot](https://potadot.com.my/): a light background, green accents, floating pill navigation, geometric headings, soft surfaces, and dot-based motion. The portfolio uses its own content, graphics, and layout adaptations rather than copied agency text, brand artwork, or customer claims.

## Shipped design

- New hero with Outfit headings, a procedural rotating dot torus, local time, availability, and project/contact calls to action.
- New About composition, profile ribbon, keyboard-accessible toolkit tabs, process cards, journey timeline, academic card, milestone grid, contact layout, and footer.
- Preserved pinned project interaction: desktop scrolling advances through full previews with details beside them. Narrow/short screens use a swipeable layout.
- Consistent restyling for project detail pages, unknown-route recovery, form controls, favicon, and social preview.
- Updated SecureCrypt preview to the current workbench and refreshed GitHub screenshots and documentation.

## Interaction and content checks

- Desktop and 390px phone layout checks, including contained page width.
- Toolkit mouse and arrow-key navigation; mobile menu opens and closes on navigation.
- Scroll-driven projects remain pinned at the new header offset; project detail navigation works.
- Résumé, three marksheet links, semester subjects, grades, and milestone content retained.
- Empty contact form displays validation without sending data. Live message delivery was not exercised.
- Reduced-motion branch keeps the canvas static and removes slide/reveal animation. Canvas rendering pauses offscreen and cleans up on unmount.
- Formatting, lint, and production compilation run through the existing CI workflow.

The redesign changes presentation and interaction. It does not add authentication, analytics, a database, or new contact-delivery services.
