# Aarav Sharma — Portfolio

A premium, fully responsive personal portfolio built with **React (Vite)**, **Tailwind CSS v4**, **Framer Motion**, and **React Icons**. The design leans into a code-editor visual language (file-path section labels, a status bar, terminal-styled hero) rather than generic gradients or glassmorphism — see [Design notes](#design-notes) below.

## Tech stack

- **React 19 + Vite** — app shell and dev tooling
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — styling, using CSS-variable-based design tokens for instant light/dark theme switching
- **Framer Motion** — scroll reveals, page/section transitions, micro-interactions
- **React Icons** — iconography (`react-icons/fi`)
- **React Router** — client-side routing (home + 404)
- **GSAP** is installed and available if you want to add a bespoke animation later, but the current build achieves everything with Framer Motion alone to keep the bundle lean.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

Other scripts:

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build locally
npm run lint      # oxlint (fast ESLint-compatible linter)
```

## Folder structure

```
src/
  components/     Reusable UI: Navbar, Button, Modal, Cursor, StatusBar, ContactForm, etc.
  sections/       One file per homepage section (Hero, About, Skills, Projects, ...)
  pages/          Route-level components (Home, NotFound)
  hooks/          useTheme, useActiveSection, useTypingEffect
  constants/      data.js — all site copy lives here
  animations/     Shared Framer Motion variants
  utils/          Reserved for future helpers (currently empty)
  assets/         Images you add (project screenshots, resume, etc.)
public/
  favicon.svg
  robots.txt
  resume.pdf      ← add your real résumé PDF here (see below)
```

## Customizing your content

**Everything you're likely to want to edit lives in `src/constants/data.js`:** your name, roles, bio, education timeline, skills, projects, achievements, and contact details. There's no content scattered across components — edit that one file and the whole site updates.

To add your résumé: drop a `resume.pdf` file into `/public` (replacing the placeholder note). The Résumé section's "View" button will preview it in a modal and "Download" will save it directly.

To add real project screenshots: replace `ProjectVisual` usage in `src/components/ProjectCard.jsx` with an `<img>` pointing at a file you add under `src/assets/`, or keep the generated code-window visuals — they're intentional, not a stand-in you're expected to remove.

## Design notes

The brief explicitly ruled out gradients-everywhere, floating blobs, neon/cyberpunk, and glassmorphism — the common tells of an AI-generated portfolio. Instead:

- **Signature element:** a fixed status bar at the bottom of the viewport, styled after a code editor's, showing the current section, theme, and a small "available for internships" indicator. It's both a wayfinding aid and the one deliberately distinctive idea in the design.
- **Structural motif:** every section is introduced with a `$ cd ~/section-name` label instead of a numbered eyebrow — meaningful for a backend developer's portfolio rather than decorative.
- **Texture:** a barely-there dot-grid ("graph paper") replaces gradient backgrounds; hairline 1px dividers replace heavy card shadows.
- **Typography:** Space Grotesk (display), Inter (body), and JetBrains Mono (labels, code-styled UI) — the mono face is what gives the site its identity.
- **Color:** exactly the two palettes specified in the brief, wired up as CSS custom properties that flip instantly when `.dark` is toggled on `<html>`, with a 300ms transition on background/text colors.

## Theming

Theme state lives in `src/hooks/useTheme.js`. It:

1. Reads `localStorage.getItem('portfolio-theme')` on first load, falling back to the OS-level `prefers-color-scheme`.
2. Toggles a `dark` class on `<html>`, which flips every CSS variable defined in `src/index.css`.
3. Persists the choice back to `localStorage` on every change.

All colors in components are written as Tailwind utilities like `bg-bg`, `text-text`, `bg-card`, `text-primary` — these are semantic aliases (see the `@theme` block in `src/index.css`) that resolve through CSS variables, so no component ever needs to know which theme is active.

## Accessibility

- Visible focus rings on every interactive element (`:focus-visible`)
- `prefers-reduced-motion` is respected globally — animations collapse to near-instant
- Form fields have associated `<label>`s, `aria-invalid`, and `aria-describedby` error messaging
- The custom cursor and boot-sequence loading screen are skipped automatically on touch devices / reduced-motion preference (cursor)
- Semantic landmarks (`<header>`, `<main>`/section `id`s, `<footer>`) and a real focus-trapped, `Escape`-to-close modal

## Deployment

### Vercel

1. Push this project to a GitHub repository.
2. In Vercel, **Add New Project** → import the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy — no environment variables are required.

Or via CLI:

```bash
npm install -g vercel
vercel
```

### Netlify

1. Push this project to a GitHub repository.
2. In Netlify, **Add new site → Import an existing project**.
3. Build command: `npm run build`. Publish directory: `dist`.
4. This repo includes a `netlify.toml` with a SPA redirect rule so client-side routes (like the 404 page) work correctly on refresh.

Or via CLI:

```bash
npm install -g netlify-cli
netlify deploy --build --prod
```

## Contact form

The contact form validates on the client (required fields, email format, minimum message length) and currently **simulates** a send so it's fully demonstrable without a backend. To make it actually deliver messages, swap the `setTimeout` in `src/components/ContactForm.jsx` for a real request — e.g. to [Formspree](https://formspree.io), [Resend](https://resend.com), or your own API route.

---

Built by hand, section by section — no page-builder, no template.
