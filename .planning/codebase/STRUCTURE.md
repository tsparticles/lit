# Codebase Structure

**Analysis Date:** 2026-04-10

## Directory Layout

```text
lit/
├── apps/                     # Runnable application packages (demo)
│   └── lit/                  # Lit demo app package
├── components/               # Publishable component packages
│   └── lit/                  # Lit tsParticles component package
├── .github/workflows/        # CI workflows
├── .husky/                   # Git hooks
├── package.json              # Workspace scripts and root deps
├── pnpm-workspace.yaml       # Workspace package discovery
├── lerna.json                # Lerna package/build config
└── nx.json                   # Nx target defaults/cache config
```

## Directory Purposes

**`apps/lit/`:**
- Purpose: Demo application package used for local preview and examples.
- Contains: App entry TS, dev HTML shell, app-local build/dev configs, compiled output.
- Key files: `apps/lit/src/index.ts`, `apps/lit/dev/index.html`, `apps/lit/web-dev-server.config.mjs`, `apps/lit/package.json`.

**`components/lit/`:**
- Purpose: Source and package metadata for the reusable Lit component.
- Contains: Component source, package exports, TS config, generated library artifacts, architecture notes.
- Key files: `components/lit/src/lit-tsparticles.ts`, `components/lit/package.json`, `components/lit/tsconfig.json`, `components/lit/CONTROLLER_PATTERN.md`.

**`apps/lit/src/` and `components/lit/src/`:**
- Purpose: Canonical source directories for TypeScript code.
- Contains: Runtime logic only; compilation targets `lib/` via each package `tsconfig.json`.
- Key files: `apps/lit/src/index.ts`, `components/lit/src/lit-tsparticles.ts`.

**`apps/lit/lib/` and `components/lit/lib/`:**
- Purpose: TypeScript compiler outputs consumed by browsers/publish tooling.
- Contains: `.js`, `.d.ts`, and source-map files.
- Key files: `apps/lit/lib/index.js`, `components/lit/lib/lit-tsparticles.js`.

## Key File Locations

**Entry Points:**
- `apps/lit/src/index.ts`: Demo bootstrap and tsParticles initialization.
- `components/lit/src/lit-tsparticles.ts`: Custom element definition and runtime behavior.
- `apps/lit/dev/index.html`: Browser entry page that imports built JS.

**Configuration:**
- `package.json`: Root scripts and workspace-level dependencies.
- `pnpm-workspace.yaml`: Workspace package globs (`apps/*`, `components/*`).
- `lerna.json`: Lerna package list and versioning/build conventions.
- `nx.json`: Task cache defaults for `build` and `build:ci` targets.
- `apps/lit/tsconfig.json`, `components/lit/tsconfig.json`: Package-level compile boundaries.
- `apps/lit/web-dev-server.config.mjs`: Demo dev-server root and app index setup.

**Core Logic:**
- `components/lit/src/lit-tsparticles.ts`: Property-driven tsParticles load logic.
- `apps/lit/src/index.ts`: Engine full-feature loader invocation.

**Testing:**
- No committed active test files detected under `apps/lit/` or `components/lit/` by current file scan.
- Test tooling exists in `apps/lit/package.json` (`@open-wc/testing`, `karma`, `mocha`) but test source paths are not present.

## Naming Conventions

**Files:**
- Source TypeScript uses lowercase or kebab-style filenames (for example `apps/lit/src/index.ts`, `components/lit/src/lit-tsparticles.ts`).
- Compiled output mirrors source names in `lib/` (for example `components/lit/lib/lit-tsparticles.js`).
- Root and package configs use conventional names (`package.json`, `tsconfig.json`, `web-dev-server.config.mjs`).

**Directories:**
- Workspace package grouping follows top-level domain directories: `apps/` and `components/`.
- Package names are short lowercase directory names under each group (`apps/lit`, `components/lit`).

## Where to Add New Code

**New Feature:**
- Primary code: add reusable component behavior in `components/lit/src/` and expose via `components/lit/package.json` exports if needed.
- Demo wiring: add showcase/bootstrap code in `apps/lit/src/` and usage markup in `apps/lit/dev/index.html`.
- Tests: place new test files under package-local test paths (for example `apps/lit/test/`), then wire scripts in `apps/lit/package.json`.

**New Component/Module:**
- Implementation: create new source module under `components/lit/src/` with kebab-style filename, then compile to `components/lit/lib/` via `tsc`.

**Utilities:**
- Shared helpers within component package: add under `components/lit/src/` and import relatively from `components/lit/src/lit-tsparticles.ts`.
- Demo-only helpers: add under `apps/lit/src/` to keep package boundaries clear.

## Special Directories

**`.github/workflows/`:**
- Purpose: CI automation for install and build checks.
- Generated: No.
- Committed: Yes (`.github/workflows/nodejs.yml`).

**`.husky/`:**
- Purpose: Commit-msg hook integration.
- Generated: No (maintained configuration).
- Committed: Yes (`.husky/commit-msg`).

**`node_modules/`:**
- Purpose: Installed dependencies for workspace and nested packages.
- Generated: Yes.
- Committed: No.

**`.nx/workspace-data/`:**
- Purpose: Nx local cache and workspace graph metadata.
- Generated: Yes.
- Committed: No.

---

*Structure analysis: 2026-04-10*
