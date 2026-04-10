# Architecture

**Analysis Date:** 2026-04-10

## Pattern Overview

**Overall:** Monorepo package architecture with a publishable Lit component package and a separate demo application package.

**Key Characteristics:**
- Workspace orchestration is centralized at the root in `package.json`, `pnpm-workspace.yaml`, `lerna.json`, and `nx.json`.
- Runtime UI logic is concentrated in the Lit custom element in `components/lit/src/lit-tsparticles.ts`.
- Demo bootstrapping is isolated in `apps/lit/src/index.ts` and rendered through `apps/lit/dev/index.html`.

## Layers

**Workspace Orchestration Layer:**
- Purpose: Define package boundaries and cross-package build orchestration.
- Location: `package.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`.
- Contains: Workspace declarations, root build scripts, task caching defaults.
- Depends on: `pnpm`, `lerna`, and `nx` declared in `package.json`.
- Used by: CI in `.github/workflows/nodejs.yml` and local development commands.

**Component Library Layer:**
- Purpose: Implement and export the reusable `<lit-particles>` web component.
- Location: `components/lit/src/lit-tsparticles.ts` with package metadata in `components/lit/package.json`.
- Contains: LitElement class, reactive properties, tsParticles load invocation.
- Depends on: `lit` and `@tsparticles/engine` from `components/lit/package.json`.
- Used by: Demo app import in `apps/lit/src/index.ts` and downstream consumers of `lit-tsparticles`.

**Demo Application Layer:**
- Purpose: Initialize tsParticles engine and host the component in a runnable page.
- Location: `apps/lit/src/index.ts`, `apps/lit/dev/index.html`, and `apps/lit/web-dev-server.config.mjs`.
- Contains: Bootstrapping IIFE, engine plugin loading, browser demo entry HTML.
- Depends on: `lit-tsparticles`, `tsparticles`, and `@tsparticles/engine` in `apps/lit/package.json`.
- Used by: Developer preview workflows and documentation/demo usage.

**Build Artifact Layer:**
- Purpose: Ship compiled JS and type declarations for each package.
- Location: `components/lit/lib/lit-tsparticles.js`, `components/lit/lib/lit-tsparticles.d.ts`, `apps/lit/lib/index.js`, `apps/lit/lib/index.d.ts`.
- Contains: TypeScript compiler outputs from each package `tsconfig.json`.
- Depends on: Source files in `components/lit/src/` and `apps/lit/src/`.
- Used by: Browser demo script loading (`apps/lit/dev/index.html`) and package consumers.

## Data Flow

**Demo Runtime Flow:**

1. Browser loads the module script defined in `apps/lit/dev/index.html` (`../lib/index.js`).
2. `apps/lit/src/index.ts` imports `lit-tsparticles` to register the custom element and runs `loadFull(tsParticles)`.
3. Custom element definition from `components/lit/src/lit-tsparticles.ts` binds `<lit-particles>` via `@customElement("lit-particles")`.
4. Lit update cycle in `components/lit/src/lit-tsparticles.ts` reads `id`, `options`, and `url` properties.
5. Component calls `tsParticles.load({ id, options })` or `tsParticles.load({ id, url })` in `components/lit/src/lit-tsparticles.ts` to create the particle container.

**State Management:**
- State is component-local and property-driven in `components/lit/src/lit-tsparticles.ts` (`id`, `options`, `url`, `container`).
- Global engine state bootstrap is handled in demo startup code at `apps/lit/src/index.ts`.

## Key Abstractions

**LitParticles Web Component:**
- Purpose: Declarative wrapper that maps element properties to tsParticles initialization.
- Examples: `components/lit/src/lit-tsparticles.ts`, generated output `components/lit/lib/lit-tsparticles.js`.
- Pattern: LitElement class with decorator-based reactive properties and `render()` template.

**Workspace Package Boundaries:**
- Purpose: Separate reusable library code from demo application code.
- Examples: `components/lit/package.json`, `apps/lit/package.json`, workspace declarations in `pnpm-workspace.yaml`.
- Pattern: Multi-package monorepo using `apps/*` for runnable samples and `components/*` for distributable packages.

## Entry Points

**Root Build Entry:**
- Location: `package.json`.
- Triggers: `pnpm run build`, `pnpm run build:ci`, `pnpm run build:lerna`, `pnpm run build:nx`.
- Responsibilities: Orchestrate package-level builds through Lerna/Nx.

**Demo Script Entry:**
- Location: `apps/lit/src/index.ts`.
- Triggers: TypeScript compilation output imported by `apps/lit/dev/index.html`.
- Responsibilities: Load full tsParticles feature set and ensure engine readiness.

**Component Runtime Entry:**
- Location: `components/lit/src/lit-tsparticles.ts`.
- Triggers: `<lit-particles>` element creation and Lit update lifecycle.
- Responsibilities: Validate options source and call tsParticles loader API.

## Error Handling

**Strategy:** Fail-fast at component level when required particle configuration is absent.

**Patterns:**
- Explicit thrown error in `components/lit/src/lit-tsparticles.ts` when both `options` and `url` are undefined.
- No centralized error boundary/service in active source files; errors propagate to consumer context from `components/lit/src/lit-tsparticles.ts`.

## Cross-Cutting Concerns

**Logging:** No runtime logging in active source files (`components/lit/src/lit-tsparticles.ts`, `apps/lit/src/index.ts`).
**Validation:** Minimal runtime validation in `components/lit/src/lit-tsparticles.ts` (`options`/`url` presence check).
**Authentication:** Not applicable for this frontend component/demo codebase (`apps/lit/src/index.ts`, `components/lit/src/lit-tsparticles.ts`).

---

*Architecture analysis: 2026-04-10*
