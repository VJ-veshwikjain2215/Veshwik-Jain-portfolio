# Security policy

## Reporting a vulnerability

Do not put secrets, personal records, or exploit details into a public issue.

Report security concerns privately to **Veshwikjain07@gmail.com**. Include the affected page or file, reproduction steps, impact, and any suggested fix. Do not send real user data as evidence.

This is a personal project; there is no guaranteed response deadline or bug bounty.

## Scope

The current `main` branch is maintained. The website is a browser application; project backends linked from it are separate repositories.

- All files in `public/` are publicly accessible when deployed.
- Frontend bundles are public; do not place secrets in source or frontend environment variables.
- The Formspree endpoint is a public form identifier, not a secret. Form service settings control spam protection and delivery.
- Embarko credentials belong outside the checkout, in the local credential file or an appropriately scoped CI secret.
