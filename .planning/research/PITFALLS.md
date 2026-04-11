# Pitfalls Research

**Domain:** tsParticles Lit wrapper modernization (v4 beta migration)
**Researched:** 2026-04-10
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Mixed tsParticles package names and beta versions across source and build artifacts

**What goes wrong:**
Source files target one engine package/import path while committed `lib` outputs and type files reference another (`@tsparticles/engine` vs `tsparticles-engine`), creating install and runtime/type mismatches.

**Why it happens:**
During major-beta migration, maintainers update `src` quickly but forget to regenerate/revalidate distributables before commit/release.

**How to avoid:**
Define one canonical engine package policy for v4 beta, update all imports/dependencies together, regenerate `components/lit/lib/*` from current source in CI, and fail CI if generated artifacts differ.

**Warning signs:**
- `git diff` repeatedly shows drift between `components/lit/src/*` and `components/lit/lib/*`.
- Downstream users report type errors that cannot be reproduced from source builds.
- Lockfile contains both legacy and new tsParticles engine package names.

**Phase to address:**
Phase 1 - Dependency and package alignment baseline.

---

### Pitfall 2: Breaking API changes hidden behind "same behavior" assumptions

**What goes wrong:**
Wrapper code compiles but calls outdated v3-style APIs/signatures (for `load`, options shape, or engine init flow), causing runtime failures in demo/consumer apps.

**Why it happens:**
Migration treats v4 beta as a rename-only upgrade rather than an API contract shift.

**How to avoid:**
Create an explicit v3-to-v4 API mapping checklist for every engine interaction (`load`, init callback, options/url paths), then verify wrapper and demo against that checklist before moving to syntax cleanup.

**Warning signs:**
- Type assertions/`any` usage increase near engine calls to "make it compile".
- Demo renders but logs container initialization errors.
- Frequent small fixes around the same wrapper lifecycle methods.

**Phase to address:**
Phase 2 - API contract migration in component + demo.

---

### Pitfall 3: Reinitializing particles on every Lit update cycle

**What goes wrong:**
`tsParticles.load(...)` runs on unrelated reactive updates, causing repeated teardown/recreate cycles, performance regressions, and flaky behavior.

**Why it happens:**
Migration focuses on compatibility first and leaves existing `update(...)` logic unchanged even though it ignores `changedProperties`.

**How to avoid:**
Gate initialization to meaningful prop changes (`id`, `options`, `url`), make update path idempotent, and add deterministic cleanup for container lifecycle.

**Warning signs:**
- CPU spikes and visible animation resets during unrelated host rerenders.
- Multiple container instances for the same DOM id in debug logs.
- "Works once, breaks after state changes" bug reports.

**Phase to address:**
Phase 3 - Lifecycle hardening and performance stabilization.

---

### Pitfall 4: Modernizing tooling while keeping conflicting orchestrators active

**What goes wrong:**
Lerna and Nx both appear authoritative for build graph/release flow, causing inconsistent local vs CI behavior and hard-to-debug cache/task differences.

**Why it happens:**
Tooling modernization is incremental, but ownership boundaries between orchestrators are never formalized.

**How to avoid:**
Choose one primary build orchestrator for task execution, document remaining tool responsibility (if retained for versioning only), and enforce scripts through a single entrypoint.

**Warning signs:**
- Same package builds differently depending on command path.
- Contributors use different script families for identical outcomes.
- CI fixes require "run the other tool" workarounds.

**Phase to address:**
Phase 1 - Workspace tooling convergence.

---

### Pitfall 5: Shipping a migration without restoring test safety nets

**What goes wrong:**
Major changes land with no executable test suite, so regressions are discovered only after publish or manual demo checks.

**Why it happens:**
Test setup is treated as optional debt while migration pressure prioritizes dependency bumps and build green status.

**How to avoid:**
Add a minimum migration safety suite early: component lifecycle unit tests, one integration smoke test for demo initialization, and a CI check that validates generated artifacts are fresh.

**Warning signs:**
- PR validation relies on screenshots/manual verification only.
- Repeated "fix follow-up" commits after each migration PR.
- No command exists to run tests or coverage in workspace scripts.

**Phase to address:**
Phase 2 (minimum guardrails) and Phase 4 (expanded regression coverage).

---

### Pitfall 6: ESM/TypeScript modernization creates publish-time interop breaks

**What goes wrong:**
Package builds locally with modern TS/ESM config but breaks consumer bundlers due to mismatched exports, type paths, or module resolution assumptions.

**Why it happens:**
Modern syntax/config changes are applied without validating actual published package contract (`exports`, `types`, entrypoint compatibility).

**How to avoid:**
Treat publish output as API: validate `package.json` entrypoints, run a consumer-style import smoke check, and verify `d.ts` paths resolve in a clean install.

**Warning signs:**
- Local workspace linking works, fresh install consumer reproduction fails.
- TypeScript resolution errors reference missing/incorrect declaration paths.
- Bundlers complain about mixed CJS/ESM expectations at import time.

**Phase to address:**
Phase 3 - Packaging contract verification.

---

### Pitfall 7: Demo succeeds while package release path remains broken

**What goes wrong:**
Migration appears complete because the app demo runs, but release artifacts/docs/scripts are stale, causing downstream install/use failures.

**Why it happens:**
Validation scope is biased to runtime demo success instead of full maintainer workflow (build, type output, docs/scripts, release automation).

**How to avoid:**
Use a release-readiness checklist that includes demo run, package build, artifact freshness, script/docs alignment, and CI workflow pass in a clean environment.

**Warning signs:**
- README commands differ from real scripts/package manager.
- Generated docs metadata still references old project identity.
- Release failures occur despite "demo works" sign-off.

**Phase to address:**
Phase 4 - Release workflow and documentation hardening.

## "Looks Done But Isn't" Checklist

- [ ] **Dependency migration:** all tsParticles imports/deps use one canonical v4 beta naming/version policy.
- [ ] **API migration:** every wrapper engine call validated against v4 contract checklist (not only compile success).
- [ ] **Lifecycle stability:** component avoids unconditional reloads and includes cleanup behavior.
- [ ] **Build reliability:** generated `lib` artifacts are reproducible and CI-enforced.
- [ ] **Tooling clarity:** single authoritative build path documented and used in CI/local.
- [ ] **Release readiness:** docs/scripts/package exports verified from clean install workflow.

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Mixed package names/versions across artifacts | Phase 1 | CI fails on `src` vs generated `lib` drift and duplicate engine package policy violations |
| Hidden API contract breaks | Phase 2 | Migration checklist completed for all engine interaction points plus demo/component smoke pass |
| Reload on every Lit update | Phase 3 | Tests prove no reload on unrelated prop changes; perf smoke check stable |
| Conflicting orchestrators | Phase 1 | One documented build entrypoint produces same output locally and in CI |
| No migration safety tests | Phase 2 / Phase 4 | Test command exists and runs in CI; regression cases captured for lifecycle and packaging |
| ESM/TS publish interop breaks | Phase 3 | Clean consumer install can import package/types without path/resolution errors |
| Demo-only validation bias | Phase 4 | Release checklist passes including docs/scripts/artifacts/CI workflow |

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`
- tsParticles Lit repository migration context and existing v4 beta modernization scope

---
*Pitfalls research for: tsParticles Lit v4 modernization*
*Researched: 2026-04-10*
