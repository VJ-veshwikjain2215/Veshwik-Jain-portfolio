# Light-and-green design and motion refinement

2 November 2026. The owner selected refinement of the existing light-and-green design with smoother motion.

## Changes

- Keep the existing typography, colors, particle artwork, section layout, content and project order, including CountCheck's actual screenshot.
- Give the hero a short staggered entrance, followed by the call to action and availability badge. Make the internship badge easier to distinguish with a dark green label, pale green fill and status dot.
- Use consistent 180/320/560 ms timings and a shared easing curve. Shorten scroll reveals to 560 ms with a smaller 18 px offset and an 80 ms offset for alternating project cards.
- Use restrained project-frame lift, faster screenshot zoom and an arrow color/rotation response on hover. Keep CountCheck's full screenshot contained. Give keyboard focus the same visible arrow color response.
- Add animated mobile-menu opening and closing, a viewport-bounded scrollable menu, Escape dismissal with focus returned to the toggle, outside-click dismissal, and explicit navigation control/current-location semantics.
- Increase hero scene-control hit areas while preserving the existing five scenes, selection states, cycle timing, drag interaction and particle renderer.
- Animate toolkit copy and page introductions briefly when they appear.
- Move scroll statements into a focused component. Observe visibility, attach passive scroll/resize listeners only near the viewport, coalesce measurements into one pending frame, update React state only at word boundaries, and release listeners/frames on exit or unmount.

## Accessibility and verification

CSS entrances run only without a reduced-motion preference. Reduced motion disables reveals and hover/press movement; statements show all words immediately and schedule no scroll animation. Existing keyboard tabs, form behavior, project routes and external links remain covered by the normal checks. The menu test now also covers Escape, focus return and outside-click dismissal. Dedicated statement tests cover frame coalescing, reveal progress, offscreen cancellation, cleanup and reduced motion.

The browser access host remains unavailable in this chat. Desktop/phone visual playback and actual Canvas interaction cannot be freshly verified here; DOM and source checks do not substitute for a browser animation review. No browser permission was bypassed or changed.

Local validation passed formatting, lint, all 28 tests (8 backend and 20 DOM/component checks), production compilation, and whitespace checks. Browser playback remains the explicit verification limit above.
