# Contact email verification setup

Prepared 30 October 2026. The verification backend is deployed; the portfolio frontend stays on its existing live form until sender setup and a real delivery check are complete.

## What is prepared

- Backend: `https://veshwikjain-contact.embarko.app` (claimed Embarko app).
- Health: `/health` returns `emailConfigured: false` until all SMTP settings exist. It does not expose credentials.
- The new contact form first requests a six-digit code, then submits the code and message together. Only a correct, unused code for the same email permits notification to the owner.
- Codes expire after ten minutes and are stored as keyed hashes. Five incorrect guesses invalidate a challenge. Resending waits 60 seconds, permits three requests per address per hour, and replaces the previous challenge.
- A backend-wide budget limits SMTP attempts to 100 per process per UTC day. Request bodies and in-memory maps are bounded. Origins are explicitly allowed; SMTP credentials and codes are never returned by the API or logged.
- Google app passwords are entered only in backend hosting secrets. No SMTP setting belongs in a `VITE_` variable, public source, screenshot, issue, or chat.

## Complete Gmail setup

The existing Gmail address is prepared as the default sender and recipient; another SMTP provider can be substituted before activation.

1. In the sender's Google Account, enable 2-Step Verification if needed. The account owner must perform sign-in and security changes themselves.
2. Open [Google App Passwords](https://myaccount.google.com/apppasswords). Create a dedicated app password for the portfolio. Some accounts cannot use app passwords; see [Google's requirements](https://support.google.com/accounts/answer/185833). Do not use the normal Google password.
3. Open the [contact backend's environment settings](https://embarko.ai/app/projects/cmvtxvphv05xl7blwr35tylx8/environment). Add `SMTP_PASS` with that app password and apply/restart. The other non-secret Gmail settings have already been prepared.
4. Check `/health` and a real code delivery to an inbox you own. Enter that code in the new form and confirm the owner receives one message with the verified sender as Reply-To. A healthy status or successful SMTP connection alone does not verify delivery.
5. After those checks, merge and deploy the portfolio frontend using the prepared API address in `src/config.js`.
6. Disable the old Formspree form `xnjedlpn` in its dashboard after cutover. That previously public endpoint cannot be protected by the new backend and should not remain as an alternative submission path.

Google recommends OAuth where an application supports it. This small SMTP service uses a dedicated app password; revoke it when no longer needed. [Google app-password guidance](https://support.google.com/accounts/answer/185833).

## Backend configuration

| Key                       | Purpose                                                 |
| ------------------------- | ------------------------------------------------------- |
| `SMTP_HOST`               | SMTP server, prepared as `smtp.gmail.com`               |
| `SMTP_PORT`               | TLS port, prepared as `465`; `587` requires STARTTLS    |
| `SMTP_USER`               | Sender account, prepared as the portfolio Gmail address |
| `SMTP_PASS`               | Secret app password, deliberately unset                 |
| `CONTACT_FROM`            | Authorized sender address                               |
| `CONTACT_TO`              | Owner inbox for verified messages                       |
| `CONTACT_ALLOWED_ORIGINS` | Comma-separated exact allowed frontend origins          |

`contact-api/package.json` starts a standalone Node service. Deploy that directory on its own, excluding `.env*`, dependencies, and test files. Its own `embarko.json` preserves the backend app identity; the root identity still points to the portfolio frontend.

## Local development

The Vite dev server proxies `/api/contact` to port 5184. Run the backend separately with SMTP settings in an ignored local environment file, and include the exact Vite origin in `CONTACT_ALLOWED_ORIGINS`. Use `node --env-file=contact-api/.env contact-api/index.js` if using a local file. Do not test against strangers' inboxes.

`npm run test` uses an in-memory mailer and sends no real messages. It covers correct and incorrect codes, expiry, email mismatch, replay, resend cooldown, missing SMTP, provider failure, daily budget, concurrent delivery, origin restrictions, JSON limits, and an HTTP code/message round trip. Browser checks use a local-only test mailbox outside the deployment source.

## Operational limits

Challenges and limits are in memory and support one backend process. Restarting invalidates pending codes and resets counters; the form can request a fresh code. No contact messages are stored in a database. Multi-instance deployment needs a shared challenge/rate-limit store. SMTP acceptance does not prove inbox delivery: the recipient must enter the delivered code. A delivery timeout may be ambiguous; do not promise exactly-once delivery across provider failures.
