# Development and deployment

## Architecture

`src/main.jsx` mounts the application with React Strict Mode and BrowserRouter. `src/App.jsx` contains the homepage composition, the about/contact and project detail routes, navigation, shared footer, and scroll reveals. `src/components/HeroParticles.jsx` connects the accessible scene controls to the standalone Canvas 2D renderer in `src/lib/particleStage.js`.

Project details resolve from the `id` in `src/constants/data.js`. Unknown project IDs and unknown routes show a recovery link. The contact form requests an emailed code and submits verified messages through the standalone Node/SMTP service in `contact-api/`. See [email verification setup](EMAIL-VERIFICATION.md).

The renderer samples five procedural masks into a reusable particle pool. It uses perspective projection, depth shading, spring attraction, cursor repulsion, drag rotation, curved staggered morphs, and velocity trails. The cycle advances every three seconds of active animation time; manual selection restarts that interval. The full-hero drawing surface prevents the illustration column from clipping trails.

Rendering runs through `requestAnimationFrame`, caps display resolution at 2�, pauses offscreen and in hidden tabs, and disconnects observers and listeners on unmount. Reduced-motion visitors receive a still graphic with manual scene controls. Motion preferences also disable reveal transitions.

## Content and styling

Most structured content is in `src/constants/data.js`. Hero and section presentation copy also lives in `src/App.jsx`. Typography and layout are defined in `src/index.css`, using Outfit, Figtree, and JetBrains Mono from Google Fonts.

The current design has one light theme with green accents, rounded surfaces, and a floating navigation bar. It has no theme-switcher, chat assistant, authentication, database, or portfolio data API. The separate contact backend only handles email-code verification and notifications.

## Manual verification

After a meaningful interaction or layout change:

- Check the homepage at a desktop width and a phone width (for example, 390 px).
- Open and close the phone menu; follow each section anchor.
- Check toolkit arrow-key navigation, expanding capability panels, and the FAQ.
- Open `/about` and `/contact`.
- Open each project page and reload a deep link such as `/project/TrueVoice`.
- Return to the project list and check the next-project link.
- Check all five hero scene buttons, click-to-change, cursor repulsion, drag rotation, and the three-second cycle. Scroll away and return, and resize the window.
- Check keyboard focus, the skip link, and reduced-motion behavior.
- Open the résumé and marksheet links.
- Submit an empty contact form and confirm field validation. Only test actual delivery with an inbox and SMTP sender you control.
- Run `npm run check`.

The automated checks cover formatting, lint, contact verification tests, and production compilation. Browser and delivery checks are manual.

## Deployment

The current production site is [veshwikjain.embarko.app](https://veshwikjain.embarko.app/).

Embarko builds the Vite source and serves its output. Upload source with `package.json` at the root; exclude `.git`, `node_modules`, `dist`, and `.env` files. No Dockerfile or custom Node server is needed. Follow the [Embarko quickstart](https://embarko.ai/docs/quickstart.md) for the current API contract.

`embarko.json` identifies this existing app so updates reach the same deployment. A fork must remove that identity and deploy under its own app name. Keep deploy credentials outside the repository and authenticate both deployment and status requests.

The GitHub Actions workflow is **validation only**. It does not deploy to Embarko. A GitHub deployment record links a verified Embarko release to its source commit; registering that record does not publish code. After a manual release, check the live site before marking its deployment successful.

The included Netlify and Vercel configuration files provide SPA fallback routing if the project is hosted there. Build with `npm run build`; publish `dist/`. A host must route non-file paths back to `index.html` for client-side project routes.

## Dependency maintenance

Dependabot opens grouped npm updates and GitHub Actions updates weekly. Review update notes and run the checks before merging. Do not use forced major-version security upgrades without checking compatibility.
