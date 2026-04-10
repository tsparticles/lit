# Codebase Concerns

**Analysis Date:** 2026-04-10

## Tech Debt

**Generated artifact drift in published component package:**
- Issue: Source and built outputs are inconsistent, indicating stale committed artifacts and API drift between versions.
- Files: `components/lit/src/lit-tsparticles.ts`, `components/lit/lib/lit-tsparticles.js`, `components/lit/lib/lit-tsparticles.d.ts`
- Impact: Consumers can receive behavior/type signatures that do not match source intent, especially around tsParticles engine API calls (`load` signature differences and package import path differences).
- Fix approach: Treat `components/lit/lib/*` as reproducible build output and enforce fresh generation in CI before release; fail CI when `src` → `lib` diff is detected.

**Workspace orchestration duplication:**
- Issue: Monorepo build orchestration is split across both Lerna and Nx with overlapping build targets.
- Files: `package.json`, `lerna.json`, `nx.json`
- Impact: Build and release behavior is harder to reason about, and subtle differences in task execution/caching can create non-reproducible CI/local outcomes.
- Fix approach: Standardize on a single orchestrator for build graph execution and keep the other only if required for versioning, with clearly separated responsibilities.

**Documentation and script drift:**
- Issue: Workspace docs still instruct npm-era commands and references to starter-template scripts not aligned to current package scripts.
- Files: `README.md`, `apps/lit/README.md`, `apps/lit/package.json`
- Impact: New contributors follow incorrect commands (`npm run build:watch`, `npm test`) and lose time diagnosing setup failures.
- Fix approach: Align README command blocks with actual scripts and package manager (`pnpm`), and remove outdated starter-template guidance.

## Known Bugs

**Commit hook argument handling appears broken:**
- Symptoms: Commit message linting hook invokes commitlint without the commit message file path argument.
- Files: `.husky/commit-msg`
- Trigger: Any git commit that runs the `commit-msg` hook.
- Workaround: Manually run commitlint from CLI on commit message text until hook uses `$1`.

**TypeDoc project naming mismatch:**
- Symptoms: Generated docs metadata names this project as Angular instead of Lit.
- Files: `components/lit/typedoc.json`
- Trigger: Running TypeDoc generation.
- Workaround: None in current config; requires correcting the `name` field.

## Security Considerations

**Dev server root exposed to repository root:**
- Risk: Local development server serves from monorepo root, increasing accidental exposure of non-demo files during local/network testing.
- Files: `apps/lit/web-dev-server.config.mjs`
- Current mitigation: Local-dev scope only; no explicit hardening flags are present in this config.
- Recommendations: Scope `rootDir` to the app package where possible, or restrict served paths via explicit middleware/allowlist in dev-server configuration.

## Performance Bottlenecks

**Particle engine load invoked from every Lit update cycle:**
- Problem: Component performs `tsParticles.load(...)` in `update(...)` without checking whether relevant props changed.
- Files: `components/lit/src/lit-tsparticles.ts`
- Cause: `update(changedProperties)` currently ignores `changedProperties` and always executes load logic when `options` or `url` exists.
- Improvement path: Gate loads to changes in `id`, `options`, or `url`; avoid reinitialization when inputs are unchanged.

**Full engine preset loaded at demo startup:**
- Problem: Demo initializes the full tsParticles bundle on app boot.
- Files: `apps/lit/src/index.ts`
- Cause: `loadFull(tsParticles)` loads all features regardless of scenario.
- Improvement path: Load a slimmer preset/plugin set for demo behavior to reduce startup cost.

## Fragile Areas

**Lifecycle and error behavior in core component:**
- Files: `components/lit/src/lit-tsparticles.ts`
- Why fragile: Throwing inside `update(...)` (`throw new Error("No options or url provided")`) can break host rendering, and there is no explicit teardown strategy for container lifecycle.
- Safe modification: Introduce guarded no-op/placeholder rendering when unconfigured, add deterministic init/cleanup hooks, and keep `update(...)` idempotent.
- Test coverage: No test files detected for this package (`**/*.{test,spec}.{ts,tsx,js,jsx}` returned none).

**Legacy rollup config appears disconnected from actual app entry points:**
- Files: `apps/lit/rollup.config.js`, `apps/lit/src/index.ts`
- Why fragile: Rollup input/output references `my-element.js` artifacts that are not aligned to current source entrypoint naming.
- Safe modification: Either remove unused rollup pipeline or realign it with actual entrypoints and include it in CI validation.
- Test coverage: No automated checks detected that execute this bundling path.

## Scaling Limits

**Single-component design with no abstraction layer for multiple particle instances:**
- Current capacity: One exported Lit component implementation in `components/lit/src/lit-tsparticles.ts`.
- Limit: As usage scenarios grow (multiple instances, dynamic reconfiguration, complex lifecycle), behavior centralization in one class becomes harder to evolve safely.
- Scaling path: Introduce controller/service abstraction (already documented in `components/lit/CONTROLLER_PATTERN.md`) into production code and split responsibilities.

## Dependencies at Risk

**Major-version edge and package-name mismatch risk around tsParticles engine:**
- Risk: Dependency declarations and generated output reference different package naming/versions (`@tsparticles/engine` vs `tsparticles-engine`) across source and built artifacts.
- Files: `components/lit/package.json`, `components/lit/src/lit-tsparticles.ts`, `components/lit/lib/lit-tsparticles.js`, `components/lit/lib/lit-tsparticles.d.ts`
- Impact: Runtime/type breakage risk during install or downstream compilation when transitive resolution differs.
- Migration plan: Regenerate distributable artifacts from current source and enforce a single canonical engine package import path/version policy.

## Missing Critical Features

**Automated test suite for component behavior is absent:**
- Problem: No unit/integration/e2e tests are present for the Lit component and demo packages.
- Blocks: Safe refactoring of lifecycle behavior, regression detection for API upgrades, and confidence in release automation.

## Test Coverage Gaps

**Core rendering and lifecycle behavior untested:**
- What's not tested: `update(...)` branching for `options`/`url`, error path behavior, and repeated update reinitialization effects.
- Files: `components/lit/src/lit-tsparticles.ts`
- Risk: Regressions in initialization and rendering surface only at runtime.
- Priority: High

**Build/release compatibility paths untested:**
- What's not tested: Consistency between TypeScript source output and committed `lib` artifacts, and CI compatibility between tool versions.
- Files: `components/lit/lib/lit-tsparticles.js`, `components/lit/lib/lit-tsparticles.d.ts`, `.github/workflows/nodejs.yml`, `package.json`
- Risk: Broken package publications or CI-only failures.
- Priority: High

---

*Concerns audit: 2026-04-10*
