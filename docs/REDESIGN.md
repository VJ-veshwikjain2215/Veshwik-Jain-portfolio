# Reference-matched portfolio redesign

29 October 2026

This update replaces the first light/green interpretation with a much closer implementation of [Potadot](https://potadot.com.my/). It follows the reference’s actual section order, font families, color values, pill navigation, raised surfaces, spacing, and interaction patterns, using Veshwik’s own content. It does not reuse the agency’s brand, client claims, copy, or proprietary image assets.

## What changed

- Fixed first-screen hero composition with Outfit at the measured desktop scale, Figtree body text, JetBrains Mono labels, background particles, and a six-scene Canvas 2D graphic. Shapes morph automatically and can be selected manually.
- Large scroll-revealed introduction, followed by a split skills section with keyboard-accessible tabs and illustrative application previews.
- Four expanding horizontal capability panels, including alternating dark teal panels. Phone layouts use vertical panels.
- Staggered two-column project grid with application screenshots, labels, summaries, and case-study routes. The previous pinned horizontal carousel has been removed to follow the new reference.
- Full-width dark teal values section, connected numbered circles, six-item journey grid, large moving typography, location illustration, FAQ, rounded call to action, and multi-column footer.
- Dedicated `/about` and `/contact` pages. The about page retains the full biography and all four achievements; the homepage retains semester records, subjects, and marksheets.
- Restyled project pages, form controls, social preview, and responsive navigation.

## Validation

Formatting, lint, and production compilation run through the existing CI workflow. Manual checks cover desktop and phone layout, contained page width, toolkit arrow keys, all four capability panels, project navigation, FAQ disclosure, mobile navigation, and empty-form validation. Contact-message delivery is not exercised.

The reduced-motion branch disables automatic scene rotation, uses static particles, and removes reveal and marquee animation. Canvas rendering pauses offscreen and cancels pending animation frames on unmount.

## Scope and limits

The page is closely matched to the reference’s design system and layout; its wording, graphics, subject matter, project imagery, and page lengths differ because this is a personal developer portfolio. No analytics, authentication, database, or new messaging service is added.

## Particle motion update � 31 October 2026

Replaced the flat six-scene morph with a new perspective particle renderer following the supplied Potadot recording. The five scenes are the personal mark, backend monitor, storefront, phone, and website layout. Particles use a staggered lattice, depth shading, spring motion, a left-to-right transition wave, curved lift, and velocity trails. Clicking changes scenes, moving the pointer repels nearby particles, and dragging rotates the illustration before it eases back. Pulse rings mark completed transitions.

The prior three-second automatic timing is retained. The canvas covers the full hero rather than clipping animation to the illustration column. Scene controls have accessible names and pressed states; reduced-motion visitors get static scenes with manual selection. Rendering pauses outside the viewport and in hidden tabs. The renderer and masks are implemented in this repository, using the portfolio's own branding and labels.
