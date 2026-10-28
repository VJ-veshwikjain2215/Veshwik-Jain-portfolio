# Development and deployment

## Architecture

`src/main.jsx` mounts the application with React Strict Mode and BrowserRouter. `src/App.jsx` contains the homepage composition, the project detail route, navigation, shared footer, scroll reveals, and a procedural Canvas 2D hero.

Project details resolve from the `id` in `src/constants/data.js`. Unknown project IDs and unknown routes show a recovery link. The contact form validates input and posts to Formspree; it does not host a server in this repository.

The canvas runs through `requestAnimationFrame`, throttles its draw rate, and cancels its frame when unmounted. Reduced-motion visitors receive a still graphic. Motion preferences also disable the moving text band and reveal transitions.

## Content and styling

Most structured content is in `src/constants/data.js`. Hero and section presentation copy also lives in `src/App.jsx`. Typography and layout are defined in `src/index.css`, using Barlow Condensed, Inter, and IBM Plex Mono from Google Fonts.

The current design has one monochrome theme. It has no theme-switcher, chat assistant, authentication, database, or backend API.

## Manual verification

After a meaningful interaction or layout change:

- Check the homepage at a desktop width and a phone width (for example, 390 px).
- Open and close the phone menu; follow each section anchor.
- Open each project page and reload a deep link such as `/project/TrueVoice`.
- Return to the project list and check the next-project link.
- Check keyboard focus, the skip link, and reduced-motion behavior.
- Open the résumé and marksheet links.
- Submit an empty contact form and confirm field validation. Only test delivery with a Formspree endpoint you control.
- Run `npm run check`.

The automated checks cover formatting, lint, and production compilation. Browser and delivery checks are manual.

## Deployment

The current production site is [veshwik-jain-portfolio.embarko.app](https://veshwik-jain-portfolio.embarko.app/).

Embarko builds the Vite source and serves its output. Upload source with `package.json` at the root; exclude `.git`, `node_modules`, `dist`, and `.env` files. No Dockerfile or custom Node server is needed. Follow the [Embarko quickstart](https://embarko.ai/docs/quickstart.md) for the current API contract.

`embarko.json` identifies this existing app so updates reach the same deployment. A fork must remove that identity and deploy under its own app name. Keep deploy credentials outside the repository and authenticate both deployment and status requests.

The GitHub Actions workflow is **validation only**. It does not deploy to Embarko. A GitHub deployment record links a verified Embarko release to its source commit; registering that record does not publish code. After a manual release, check the live site before marking its deployment successful.

The included Netlify and Vercel configuration files provide SPA fallback routing if the project is hosted there. Build with `npm run build`; publish `dist/`. A host must route non-file paths back to `index.html` for client-side project routes.

## Dependency maintenance

Dependabot opens grouped npm updates and GitHub Actions updates weekly. Review update notes and run the checks before merging. Do not use forced major-version security upgrades without checking compatibility.
