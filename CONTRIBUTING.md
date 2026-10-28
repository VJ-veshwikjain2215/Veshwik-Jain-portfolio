# Contributing

Thanks for taking a look. This is a personal portfolio, so changes should improve the visitor experience without changing the owner's identity or making unsupported claims.

## Before you start

- Search existing issues before opening a new one.
- Open an issue first for a large redesign or new dependency.
- Keep pull requests focused on one problem.
- Do not edit personal documents, grades, contact information, or project claims unless correcting a verified mistake with the owner's agreement.

## Local workflow

1. Fork the repository and create a branch for your change.
2. Use Node.js 22.12+ and run `npm ci`.
3. Run `npm run dev` while working.
4. Run `npm run format`, then `npm run check` before submitting.
5. Check the affected flow in a browser at desktop and phone widths. Include keyboard and reduced-motion behavior when changing interactions.

For visual changes, include before/after screenshots and the viewport sizes you checked. For bugs, describe the trigger, previous behavior, and corrected behavior.

## Contact form and personal assets

Do not submit test messages to the live Formspree endpoint. Use an endpoint you control for delivery testing. Never commit deployment tokens, `.env` files, or credentials.

Code contributions use the MIT license. Only contribute assets you have the right to share, and explain their source and license.
