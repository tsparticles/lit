# Architecture Research

**Domain:** Project Research - Architecture dimension for tsParticles Lit wrapper modernization
**Researched:** 2026-04-10
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Workspace Orchestration                  │
├─────────────────────────────────────────────────────────────┤
│  pnpm workspace  lerna tasks  nx graph/cache  CI workflow  │
│         │             │              │             │        │
├─────────┴─────────────┴──────────────┴─────────────┴────────┤
│                      Package Boundaries                     │
├─────────────────────────────────────────────────────────────┤
│  components/lit (publishable library)  <---->  apps/lit    │
│       src/ -> lib/ + types + exports            demo app   │
├─────────────────────────────────────────────────────────────┤
│                     Runtime Integration                     │
│  app bootstrap -> engine loader -> <lit-particles> element │
│  element props (id/options/url) -> tsParticles.load()      │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Workspace root (`package.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`) | Defines package graph, build orchestration, CI entrypoints | pnpm + Nx/Lerna tasks, cacheable build targets |
| `components/lit` package | Owns public API and runtime wrapper around tsParticles for Lit consumers | ESM-first TypeScript source, explicit exports, generated declarations |
| `apps/lit` package | Owns demo-only bootstrap, validation scenarios, and manual regression checks | Browser entry + local dev server, consumes library as dependency |
| Build artifacts (`lib/`) | Provides compiled JS and `.d.ts` used by demo and downstream users | Per-package TypeScript output aligned to package exports |

## Recommended Project Structure

```text
.
├── components/
│   └── lit/
│       ├── src/                    # Canonical component source
│       │   ├── lit-tsparticles.ts  # Public custom element entry
│       │   └── internal/           # Future private helpers/controllers
│       ├── lib/                    # Build output only (generated)
│       ├── package.json            # Exports/types/files/peer deps boundary
│       └── tsconfig.json           # Library compile boundary
├── apps/
│   └── lit/
│       ├── src/                    # Demo bootstrap and scenarios
│       ├── dev/                    # HTML host for browser validation
│       ├── lib/                    # Demo build output only (generated)
│       └── package.json            # Demo-only deps and scripts
└── root workspace files            # Cross-package orchestration only
```

### Structure Rationale

- **`components/lit/`:** Keep all publishable runtime logic isolated so package exports and semver surface stay controlled during migration.
- **`apps/lit/`:** Keep integration/demo logic separate to validate runtime behavior without leaking app concerns into the reusable wrapper.
- **`lib/` outputs:** Treat as disposable generated artifacts to reduce hand-edited divergence and regression risk.
- **root orchestration:** Keep dependency and build graph ownership centralized for deterministic phased rollouts.

## Architectural Patterns

### Pattern 1: Contract-First Package Boundary Hardening

**What:** Stabilize the library boundary before deep runtime changes by making imports/exports and dependency ownership explicit.
**When to use:** Phase 1-2 when modernizing module/build patterns in a brownfield monorepo.
**Trade-offs:** Slight upfront refactor cost, but major reduction in hidden coupling and accidental breakage.

**Example:**
```typescript
// components/lit/src/lit-tsparticles.ts
// Public surface is intentionally narrow and export-controlled.
export class LitParticles extends LitElement {
  // ...public API only...
}

// components/lit/package.json (concept)
// "exports": {
//   ".": {
//     "types": "./lib/lit-tsparticles.d.ts",
//     "import": "./lib/lit-tsparticles.js"
//   }
// }
```

### Pattern 2: Parallel Build Streams with One-Way Dependency

**What:** Build library first, then demo against built library output; never reverse dependency direction.
**When to use:** Any phase where build tooling or module format changes can invalidate runtime wiring.
**Trade-offs:** Slightly longer CI pipeline, but failures become localized and diagnosable.

**Example:**
```typescript
// Flow intent (not implementation code):
// 1) build components/lit
// 2) build apps/lit (depends on components/lit artifact/API)
// 3) run demo smoke validation
```

### Pattern 3: Strangler Migration by Compatibility Envelope

**What:** Introduce modern ESM/build configuration in incremental envelopes while preserving a stable runtime API (`<lit-particles>` + properties).
**When to use:** Multi-phase modernization where consumers must keep working across intermediary commits.
**Trade-offs:** Temporary dual-config or compatibility shims, but avoids high-risk big-bang rewrites.

## Data Flow

### Request Flow

```text
Browser loads demo page
    ↓
apps/lit/dev/index.html imports app module
    ↓
apps/lit/src/index.ts initializes tsParticles engine capabilities
    ↓
<lit-particles> custom element is defined and rendered
    ↓
Component validates props (id + options/url) and calls tsParticles.load()
    ↓
Container instance is created/updated in component state
```

### State Management

```text
Component Properties (id/options/url)
    ↓ (Lit reactive update)
LitParticles lifecycle methods
    ↓
tsParticles runtime container state
    ↓
DOM canvas/render output
```

### Key Data/Build Flows

1. **Build flow (must remain directional):** root orchestrator -> `components/lit` compile -> `apps/lit` compile -> demo runtime verification.
2. **Runtime flow (must remain stable):** demo bootstrap -> engine load -> component registration -> property-driven particle load.
3. **Release flow (must remain bounded):** source in `components/lit/src` -> generated `lib/` + types -> package export map consumption.

## Migration Architecture: Phased Build Order

### Phase 1: Baseline and Boundary Freeze

- Snapshot current working build/test behavior in CI and local scripts.
- Declare strict ownership: library code only in `components/lit`, demo integration only in `apps/lit`.
- Make explicit API contract for component public surface (`id`, `options`, `url`, element name).

### Phase 2: Package Boundary Modernization

- Modernize `components/lit/package.json` first (exports/types/files/engines as needed).
- Align TypeScript config for ESM-friendly output in library package.
- Keep runtime behavior unchanged; prove no demo regressions after library-only changes.

### Phase 3: Library Build Output Modernization

- Migrate library output shape (ESM-first, declarations, source maps) and verify consumer import path stability.
- Validate that demo consumes package through declared boundary, not internal paths.
- Gate on successful standalone `components/lit` build before touching demo build.

### Phase 4: Demo Runtime Integration Realignment

- Update `apps/lit` bootstrap to tsParticles v4 beta package/API expectations.
- Ensure engine/plugin loading strategy matches v4 while preserving component invocation contract.
- Use demo as regression harness for runtime behavior under modern module outputs.

### Phase 5: Workspace Orchestration and CI Hardening

- Update root scripts/Nx-Lerna task graph to codify dependency order (`components/lit` -> `apps/lit`).
- Enforce CI sequence: install -> library build -> demo build -> smoke run.
- Add cache/task boundaries so failures are isolated by package.

### Phase 6: Cleanup and Removal of Transitional Paths

- Remove temporary compatibility shims once v4 + modern build path is stable.
- Ensure no cross-package deep imports or legacy output assumptions remain.
- Freeze resulting architecture as the new baseline for roadmap implementation phases.

## Build-Order Implications (Actionable)

| Order | Action | Why this order minimizes regressions | Exit Criteria |
|------:|--------|--------------------------------------|---------------|
| 1 | Establish baseline checks and lock API contract | Prevents accidental behavior drift while internals change | Current demo behavior reproducible from clean install |
| 2 | Modernize `components/lit` package metadata/config | Boundary correctness must precede consumer adjustments | Library builds with modern config and same public API |
| 3 | Modernize library output artifacts | Consumer breakage is easier to detect before demo changes | Demo still imports library without internal path hacks |
| 4 | Update `apps/lit` runtime integration for v4 | Runtime changes should happen only after stable library boundary | Demo renders particles with v4 loader path |
| 5 | Rewire workspace build graph and CI | Codifies proven order and prevents future accidental inversion | CI enforces deterministic package dependency build order |
| 6 | Remove migration shims and dead configs | Finalizes modernization and reduces maintenance overhead | No transitional flags/files required for successful build |

## Anti-Patterns

### Anti-Pattern 1: Big-Bang Monorepo Migration

**What people do:** Change package boundaries, module formats, and runtime APIs in one PR.
**Why it's wrong:** Failure source becomes ambiguous; rollback cost spikes.
**Do this instead:** Sequence boundary -> build output -> runtime integration with phase gates.

### Anti-Pattern 2: Demo-Coupled Library Internals

**What people do:** Let demo import non-exported `components/lit/src/*` internals.
**Why it's wrong:** Masks packaging issues and breaks consumers after publish.
**Do this instead:** Consume only published entrypoints declared in `components/lit/package.json`.

## Integration Points

### External Services/Packages

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| `@tsparticles/engine` / v4 beta packages | Library and demo import via explicit package dependencies | Version alignment must be pinned across workspace during migration |
| `lit` | Component runtime dependency | Keep as component-layer concern, not demo-owned runtime primitive |
| pnpm + Nx/Lerna + CI | Root-level orchestration | Must encode one-way build dependency from component package to demo app |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `components/lit` <-> `apps/lit` | Package import via declared exports | No relative/deep source imports across package boundary |
| Root workspace <-> package builds | Script/task invocation | Root orchestrates; packages own compile details |

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STRUCTURE.md`

---
*Architecture research for: tsParticles Lit v4 modernization*
*Researched: 2026-04-10*
