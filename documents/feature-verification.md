# Project links and feature verification

1 November 2026.

## Link corrections

The old TrueVoice Vercel and Civic Issue Reporter Render URLs returned 404. Their successful GitHub deployment records supplied these replacements, and direct HTTPS checks confirmed the expected application titles:

| Project                 | Public website                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| TrueVoice               | https://veshwik-truevoice.embarko.app/                                                               |
| Secure-Crypt            | https://veshwik-secure-crypt.embarko.app/                                                            |
| Civic Issue Reporter    | https://veshwik-civic-reporter.embarko.app/                                                          |
| FlowFund / RupeeRakshak | No public deployment, confirmed by the owner. Source: https://github.com/VJ-veshwikjain2215/FlowFund |

Project cards now provide separate live-site and source-code actions alongside their case-study links. Projects without a live URL show an explicit availability message on both the card and detail page.

## Automated verification

`cd code` then `npm run check` passed formatting, lint, 8 backend tests, 16 DOM interaction tests, and the production build.

- Correct live links, canonical FlowFund source link, source-only fallback, external-link safety, home anchors, résumé and marksheet links.
- Keyboard toolkit tabs, capability panels, navigation menu state, and about/contact navigation.
- Native FAQ disclosure, project detail routes including encoded spaces, next-project navigation, and unknown-route recovery.
- Hero scene controls, reduced-motion configuration, back-to-top behavior, and engine cleanup.
- Contact validation, code request, cooldown, incomplete-code rejection, verified submission, form reset, changed-email invalidation, failure retry, and expired-code recovery.
- Existing API tests cover code expiry/replay, wrong-code attempts, resend limits, concurrent submission, provider failure, origin/JSON/body restrictions, and a local HTTP round trip.

DOM tests use jsdom. Canvas drawing is mocked; these tests check controls and lifecycle rather than actual particle rendering. Contact tests use mocked fetch or an in-memory mailer and send no real email.

`node ops/verify-live.mjs` checks the published JavaScript destinations, correct project identities, SPA deep-link responses, image/CSS/JS/public assets, actual PDF signatures, contact health, CORS, and empty-payload rejection without sending messages. All 39 checks passed against the published release.

## Published release

- Portfolio: https://veshwikjain.embarko.app/ (existing claimed app).
- Source release: `0bbe82c9b49dbcb4c1f5c9db8d68e08d514086ea`, merged through [PR #22](https://github.com/VJ-veshwikjain2215/Veshwik-Jain-portfolio/pull/22).
- Required [GitHub CI](https://github.com/VJ-veshwikjain2215/Veshwik-Jain-portfolio/actions/runs/41334199686) passed all 24 tests and quality/build checks.
- Embarko reported live, then `node ops/verify-live.mjs` passed all 39 live checks. Correct destinations are present in the served JavaScript; obsolete URLs are absent.
- The live checker initially expected generic `invalid` for empty contact payloads. The documented email validation correctly returns `email`; corrected the checker and reran the complete check successfully. No backend change was needed.
- Source-only upload excluded the separate contact backend, tests, credentials, dependencies, build output and local tooling. Existing SMTP settings and contact backend deployment were preserved. No real email was sent.
- Published a successful GitHub deployment record for the verified source commit.

## Limits

The browser access host was unavailable, and native Google Chrome control returned “Computer Use was not approved to use Google Chrome.” No alternative browser automation was used to bypass that restriction. Desktop/phone visual layout, actual Canvas animation/drag/automatic cycling, browser console errors, focus visibility, PDF viewer behavior, and real inbox delivery were not reverified in this session. SMTP health indicates configuration, not delivery. No claim of a complete accessibility audit is made.
