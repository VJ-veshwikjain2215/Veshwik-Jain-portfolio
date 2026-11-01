# Cursor, project cards, section motion and Toolkit

2 November 2026. Implements the owner's five requested refinements within the current design.

The later [distinct Toolkit and Capabilities refinement](toolkit-capabilities.md) supersedes item 5 and its section-specific verification details below. The cursor, project-grid, navigation, and Journey/How I Work refinements remain applicable.

## Behavior

1. A single black CLICK circle lives in a body portal and tracks the pointer across all routes, the navbar, footer and forms. Desktop native cursors are hidden only after the custom cursor is positioned. The overlay ignores pointer events. Touch/coarse devices keep native behavior; Tab, window exit/blur and cleanup restore it. Pointer movement uses refs and at most one pending frame, with immediate tracking under reduced motion. The hero renderer keeps its scenes, cycle, drag and repulsion behavior; only its cursor overlay ownership changed.
2. Projects keep their order in stable pairs, including the final unpaired card. With a fine hover pointer and at least 1000 CSS pixels, the active card transitions to the existing 7-part large proportion while all other cards use the 5-part small proportion. Hover and keyboard focus both select a card. Preview slots reserve the large-image height and the copy/actions have reserved rows, so hovering does not reorder cards or push later sections down. Images remain at their existing aspect ratio; CountCheck keeps contain sizing. Tablet/mobile, coarse pointers and reduced motion use the existing static responsive layout. Full descriptions and live/source actions remain present.
3. Journey headings and all existing timeline/achievement rows reveal subtly with a short stagger. How I Work adds an introduction reveal, a one-time connector-line entrance and staggered principles. The shared Reveal component honors reduced motion.
4. Navbar order and targets are Home → About → Toolkit → Capabilities → Projects → Journey → Contact, pointing to the existing sections and contact route.
5. Each capability declares a shared light/dark theme. Backend Systems and Data & Storage stay light; Web Applications and Developer Workflow use dark green in both selected Toolkit styling/preview and Capabilities. Technology labels use local SVG icons from the already-installed react-icons package, readable 14 px labels, 19 px icons and wrapping spacing. All existing technology labels remain available, including the full workflow list. Preview text is larger, dark surfaces use readable light text, and expanded desktop panels have room for the larger labels.

## Verification

The existing navigation, routes, hero controls, contact verification and scroll-statement checks remain in the suite. Added checks exercise every project as active, stable row/order membership, hover/focus interaction, cursor positioning/frame coalescing and cleanup, touch/coarse and reduced-motion behavior, navbar order/targets, and Toolkit/Capabilities themes and technology icons. No new dependencies were installed.

The browser access host is unavailable in this chat. Build and DOM/component checks can verify source behavior but cannot prove rendered resize smoothness, absence of visual layout shifts, or desktop/phone clipping. A browser review should sweep hover across all five cards, resize across the 1000/760 px breakpoints, test each Toolkit tab and capability panel, then check touch emulation, reduced motion, keyboard focus, the hero drag controls and the contact form. No alternate browser automation or permission bypass was used.

Local validation passed formatting, lint, 8 backend tests and 25 DOM/component tests (33 total), production compilation and whitespace checks. The unchanged particle-renderer source, contact components and project data were also checked against the starting commit.
