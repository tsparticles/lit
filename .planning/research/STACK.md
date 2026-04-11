# Stack Research

**Domain:** Project Research - Stack dimension for tsParticles Lit wrapper modernization
**Researched:** 2026-04-10
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Node.js | 22 LTS (runtime baseline), test 20 LTS + 22 LTS in CI | Build/test runtime for monorepo and published package validation | 22 LTS is the most stable modern baseline in 2026, while keeping Node 20 in CI catches downstream consumer compatibility regressions during beta migration | HIGH |
| TypeScript | 5.9.x baseline (primary), 6.0.x compatibility lane | Source compile, type emit, package contract validation | Lit recommends experimental decorators for production output quality; TS 5.9 is low-risk for migration while a TS 6 lane future-proofs without forcing immediate compiler churn | HIGH |
| Lit | 3.3.x track (`^3.3.2`) | Web component framework for `lit-tsparticles` | Aligns with current Lit 3 docs and keeps wrapper on the actively maintained line; avoids dual-major support complexity during tsParticles v4 beta migration | HIGH |
| tsParticles engine stack | **Exact pin** `4.0.0-beta.11` for all `@tsparticles/*` and `tsparticles` packages | Particle runtime API and plugin ecosystem | Beta migration safety requires one canonical version across every tsParticles package; exact pin prevents silent beta drift and mixed API surfaces | HIGH |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| `@tsparticles/engine` | `4.0.0-beta.11` (peer + dev) | Wrapper dependency and shared `tsParticles` instance types | Always in the library package; keep as peer dependency for consumers and exact dev dependency for local build/tests | HIGH |
| `@tsparticles/slim` | `4.0.0-beta.11` | Demo/default loader for lower bundle cost than full | Use for default demo and smoke tests; only switch to full bundle for examples requiring plugins not in slim | HIGH |
| `tsparticles` | `4.0.0-beta.11` | Full loader for parity/compat demos | Keep only in demo/examples where full feature parity is explicitly required | HIGH |
| `@changesets/cli` | `^2.30.0` | Versioning/release notes for beta cadence | Use if replacing ad-hoc release flow; helps manage repeated beta bumps with clear changelog intent | MEDIUM |

### Development Tools

| Tool | Purpose | Notes | Confidence |
|------|---------|-------|------------|
| `pnpm` | Workspace package management | Keep current `10.x` line and use `overrides` to enforce single tsParticles beta version policy | HIGH |
| `nx` | Single build/test orchestration authority | Keep Nx as execution authority; de-scope Lerna from task orchestration to avoid split build graph behavior | MEDIUM |
| `vite` | Demo/dev server + ESM-native build ergonomics | Move demo from aging `@web/dev-server` config to Vite 8 for faster ESM iteration and cleaner TS/ESM defaults | MEDIUM |
| `vitest` + `playwright` | Fast unit tests + real-browser smoke tests | Vitest for lifecycle/unit checks, Playwright for "component loads and initializes tsParticles" smoke validation | MEDIUM |
| `eslint` + `@typescript-eslint` + `prettier` | Static quality gates | Upgrade to current major lines together to avoid parser/plugin skew | HIGH |

## Installation

```bash
# Core runtime
pnpm add lit@^3.3.2 @tsparticles/engine@4.0.0-beta.11

# Demo/runtime loaders
pnpm add -F lit-tsparticles-demo @tsparticles/slim@4.0.0-beta.11
pnpm add -F lit-tsparticles-demo tsparticles@4.0.0-beta.11

# Dev dependencies
pnpm add -D typescript@^5.9.0 vite@^8.0.8 vitest@^4.1.4 playwright@^1.59.1 eslint@^10.2.0 @typescript-eslint/parser@^8.58.1 @typescript-eslint/eslint-plugin@^8.58.1 prettier@^3.8.2
pnpm add -D @changesets/cli@^2.30.0
```

## Dependency Strategy (Prescriptive)

- Use one tsParticles version policy for the entire monorepo: exact `4.0.0-beta.11` (no `^` for beta packages).
- Enforce that policy at workspace root with `pnpm.overrides` for `@tsparticles/*` and `tsparticles`.
- Keep `@tsparticles/engine` as a `peerDependency` in `components/lit`, and mirror exact pinned version in `devDependencies` for local compile/test reproducibility.
- Split loader intent in demo: default to `@tsparticles/slim`, add explicit "full" example using `tsparticles` to document tradeoff.
- Treat generated `lib/*` as release artifacts validated in CI (build + diff check) to prevent source/artifact drift during beta bumps.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Nx as primary task runner | Keep Nx + Lerna both active for execution | Only if org-level tooling requires Lerna for publish/version workflows; even then, keep execution in one authority to avoid divergence |
| Vite 8 for demo/tooling | Stay on `@web/dev-server` + Rollup scripts | Acceptable for minimal churn, but weaker long-term DX and more manual config burden for modern ESM testing |
| TS 5.9 baseline + TS 6 CI lane | Immediate TS 6-only migration | Use TS 6-only if all downstream toolchain plugins are already validated; otherwise increases migration risk without direct v4 value |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Mixed tsParticles versions (`3.x` + `4.0.0-beta`) | Creates API/type mismatches and non-reproducible runtime behavior | Exact monorepo-wide `4.0.0-beta.11` policy via `pnpm.overrides` |
| Legacy package naming drift (`tsparticles-engine` style references) | Causes dependency duplication and broken import expectations against current scoped packages | Canonical `@tsparticles/engine` and scoped v4 package family |
| Caret ranges on beta dependencies | Pulls unvalidated pre-release updates implicitly, increasing break risk mid-milestone | Exact beta pins and intentional bump PRs |
| Simultaneous Lerna+Nx execution ownership | Inconsistent local/CI outcomes and unclear troubleshooting path | Single orchestrator authority (Nx), optional Lerna only for versioning/release metadata |
| Unconditional `tsParticles.load(...)` on every Lit update | Triggers reinit loops, perf regressions, and flaky behavior during reactive updates | Idempotent update strategy keyed to meaningful prop diffs (`id`, `options`, `url`) |

## Stack Patterns by Variant

**If goal is migration safety (default):**
- Use exact pinned tsParticles beta versions + `@tsparticles/slim` in demo.
- Because it minimizes moving parts while validating v4 API compatibility.

**If goal is ecosystem parity showcase:**
- Add a separate full-loader demo path using `tsparticles` (not as default).
- Because it preserves feature coverage demos without forcing full bundle cost on baseline usage.

## Version Compatibility

| Package A | Compatible With | Notes | Confidence |
|-----------|-----------------|-------|------------|
| `lit@^3.3.2` | `typescript@^5.9` (primary) and TS 6 compatibility lane | Keep Lit experimental decorators config (`experimentalDecorators: true`, `useDefineForClassFields: false`) for current best output profile | HIGH |
| `@tsparticles/engine@4.0.0-beta.11` | `@tsparticles/*@4.0.0-beta.11`, `tsparticles@4.0.0-beta.11` | All tsParticles packages should share the same beta number to avoid plugin/engine contract drift | HIGH |
| `vite@^8.0.8` | Node 20+ and modern ESM TS configs | Good fit for demo app; do not use its `bundler` module resolution as the sole validator of published library contract | MEDIUM |
| `typescript@^5.9` | `moduleResolution: nodenext` (library), `moduleResolution: bundler` (demo app) | Separate TS config intent: npm-library correctness vs app-bundler ergonomics | HIGH |

## Sources

- https://www.npmjs.com/package/@tsparticles/engine (dist-tags and beta availability verified with `npm view`)
- https://www.npmjs.com/package/tsparticles (dist-tags and dependency graph verified with `npm view`)
- https://www.npmjs.com/package/lit (current latest tag verified)
- https://lit.dev/docs/components/decorators/ (decorator mode guidance and compiler output considerations)
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html (module resolution and ESM emit flags; 6.0 line availability confirmed via npm tags)
- https://www.npmjs.com/package/vite (current major availability verified via `npm view`)
- https://www.npmjs.com/package/vitest (current major availability verified via `npm view`)
- https://www.npmjs.com/package/playwright (current major availability verified via `npm view`)
- Local codebase context: `.planning/PROJECT.md`, `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`

---
*Stack research for: tsParticles Lit v4 modernization*
*Researched: 2026-04-10*
