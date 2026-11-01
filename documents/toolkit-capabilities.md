# Distinct Toolkit and Capabilities

2 November 2026. Replaces the shared four-category service tabs and repeated mock diagrams while retaining the portfolio's light surfaces, green accents, dark-green cards, existing section anchors, and shared entrance motion.

## Toolkit: the actual stack

The new grid has five categories: Languages, Interface, Backend & APIs, Data, and Build & delivery. All categories appear initially. Filters support click/touch and Left/Right/Home/End keys with selected state, focus management, an announced result count, and a labelled focusable panel. Labels remain visible beside local SVG icons; no network icon service, proficiency scores, or years of expertise are introduced.

Java, JavaScript, Kotlin, React, HTML, CSS, Spring Boot, REST APIs, Node.js, Express, SQL, Git, and GitHub are owner-confirmed skills. PostgreSQL, JDBC, Flyway, Maven, and GitHub Actions are evidenced by CountCheck's repository. Repository use establishes a tool's presence, not a claim of proficiency. The owner has not confirmed personal proficiency in every technology associated with every project; those technologies are not automatically added here.

At desktop widths the five cards form a three/two grid, moving to two columns on tablets and one on phones. Filters and technology labels wrap; controls reserve at least 44 pixels of touch height. Interface and Build & delivery use dark green, while Languages, Backend & APIs, and Data use light surfaces.

## Capabilities: outcomes and evidence

The independent disclosure layout describes three practical outcomes rather than repeating technology names:

| Outcome                                     | Evidence                                                                                                                                                                               |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business workflows people can complete      | CountCheck's searchable catalog, manual count observations, notes, history, differences filter, and CSV export; Civic Issue Reporter's image/location submissions and status workflow. |
| Interfaces that make complex tasks clearer  | Secure-Crypt's explicit modes, input/results workspace, keyboard support, copy and download actions; this portfolio's responsive project browsing and navigation.                      |
| Account and form flows that handle mistakes | CountCheck's private workspaces, idempotent count submissions and one-time recovery codes; the portfolio's validated email-code contact flow.                                          |

These examples were checked against local repository documentation and relevant implementation/templates. Civic Issue Reporter's actual implementation is Flask/SQLite; this change makes no claim that it uses the owner's Java stack. Secure-Crypt is an educational workbench, not evidence of an independent security audit. CountCheck's observations do not automatically adjust inventory. No new employment, contribution, accuracy, scalability, or proficiency claims are made.

The first outcome opens initially. Each native button supports keyboard activation, reports expanded state, and controls a labelled region; closed content is hidden from navigation and assistive technology. Each outcome may be collapsed. Existing project screenshots serve as small evidence previews, and links lead to the project's existing detail route or the portfolio feature itself.

## Motion and maintenance

Both sections reuse the existing viewport reveal component, which honors reduced motion. Capability bodies add a short opacity/translation entrance only when reduced motion is not requested. Hover effects use color/border feedback; no scroll listeners, animation loops, or additional dependencies were added. Removed obsolete service-panel styles, mock scenes, local state, and the unused old skill catalog.

Content lives in `code/src/constants/experience.js`; behavior lives in `Toolkit.jsx` and `Capabilities.jsx`, with their styles in `components/experience.css`. The hero renderer, global cursor, contact form/backend, project grid, navigation targets, and Journey/How I Work content remain outside this change.

## Validation

Interaction checks cover initial full-stack visibility, actual labels/icons, pointer and keyboard filtering, light/dark category surfaces, outcome expansion/collapse, hidden content, evidence destinations, and opening the CountCheck case study. Existing navigation, hero, cursor, contact, project, reduced-motion, and route-recovery checks remain in the suite.

Local validation passed formatting, lint, all 34 tests (8 backend and 26 UI/component checks), production compilation, and whitespace checks. Browser visual QA is not available in this session, so automated DOM and build checks do not establish rendered spacing or animation quality at desktop/phone viewports.
