# Browser demo implementation plan

Goal: expose the existing panel on GitHub Pages, including local PDF/identifier tools and synthetic drafts/events that reset on reload.
Architecture: explicit data-demo-mode=browser in the exported panel; browser-only Web Crypto store in src/browser-demo.mjs. The opt-in loopback demo keeps its existing HTTP behavior. Export an explicit whitelist of frontend modules, never server/SQL.
Stack: native ES modules, Web Crypto, Node tests and Chromium/Playwright.
Scope approved by user: publish panel and adapt drafts to a browser simulation; no identity, signatures, uploads or persistent storage.

- [x] Add failing tests for synthetic templates, country validation, limits, cancellation, independent state, snapshots and event integrity; implement serialized asynchronous browser store.
- [x] Update export contract tests to require the panel/modules; wire explicit browser mode while preserving local HTTP demo. Make landing entry point say “Probar el panel”.
- [x] Run full Node suite and build. Exercise published-folder routing at a project subpath in Chromium: navigation, create/cancel/events, reload reset, PDF hash/comparison, invalid PDF, identifier format and mobile menu. Assert no API requests or console errors.
- [ ] Review changes, preserve source branch for review, deploy only built artifacts to gh-pages, verify live routes and interactions.

Review focus: double clicks/concurrent mutations; untrusted template keys; state copies; subpath module URLs; private artifacts excluded. Failure paths must preserve store state. No real personal data in tests.

Verification: 44/44 Node tests; Chromium workflow passed at a project subpath, no API requests or JavaScript errors. Independent review found no blocking issues. The reviewer noted the disabled top-level request button; the exported panel now offers “Borrador de prueba” navigation and an export regression plus browser test covers it.
