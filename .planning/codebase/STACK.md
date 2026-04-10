# Technology Stack

**Analysis Date:** 2026-04-10

## Languages

**Primary:**
- TypeScript 5.x - Component and demo source in `components/lit/src/lit-tsparticles.ts` and `apps/lit/src/index.ts`, compiled via `components/lit/tsconfig.json` and `apps/lit/tsconfig.json`.

**Secondary:**
- JavaScript (ESM + CommonJS config files) - Build/dev/docs tooling in `apps/lit/rollup.config.js`, `apps/lit/web-dev-server.config.mjs`, and `apps/lit/.eleventy.cjs`.
- HTML - Demo entry page in `apps/lit/dev/index.html`.
- YAML/JSON - Workspace orchestration and CI configuration in `pnpm-workspace.yaml`, `.github/workflows/nodejs.yml`, `lerna.json`, `nx.json`, and package manifests.

## Runtime

**Environment:**
- Node.js 20 in CI, defined in `.github/workflows/nodejs.yml` (`actions/setup-node@v4` with `node-version: '20'`).

**Package Manager:**
- pnpm (workspace root specifies `pnpm@10.33.0`) in `package.json`.
- Lockfile: present (`pnpm-lock.yaml`, lockfileVersion `9.0`).

## Frameworks

**Core:**
- Lit 2/3 - Web component framework for the package and demo (`components/lit/src/lit-tsparticles.ts`, `components/lit/package.json`, `apps/lit/package.json`).
- tsParticles engine/runtime - Particle system engine integration (`@tsparticles/engine`, `tsparticles`) used in `components/lit/src/lit-tsparticles.ts` and `apps/lit/src/index.ts`.

**Testing:**
- Mocha + Karma + Chai + open-wc testing helpers configured as dev dependencies in `apps/lit/package.json`.

**Build/Dev:**
- TypeScript compiler (`tsc`) for library/demo output to `lib` (`components/lit/package.json`, `apps/lit/package.json`).
- Rollup for bundle-size checks in `apps/lit/rollup.config.js` and script `checksize` in `apps/lit/package.json`.
- @web/dev-server for local browser development in `apps/lit/web-dev-server.config.mjs`.
- Eleventy (`@11ty/eleventy`) for static docs pipeline configured in `apps/lit/.eleventy.cjs`.
- Monorepo orchestrators: Lerna and Nx at workspace root in `package.json`, `lerna.json`, and `nx.json`.

## Key Dependencies

**Critical:**
- `lit-tsparticles` (workspace package) - Published Lit wrapper package in `components/lit/package.json`, consumed by demo in `apps/lit/package.json` and `apps/lit/src/index.ts`.
- `@tsparticles/engine` - Engine API used directly by component class and demo bootstrapping (`components/lit/src/lit-tsparticles.ts`, `apps/lit/src/index.ts`).
- `tsparticles` - Full loader used in demo initialization (`apps/lit/src/index.ts`).

**Infrastructure:**
- `lerna` and `nx` - Workspace build orchestration (`package.json`, `lerna.json`, `nx.json`).
- `husky` + `@commitlint/*` - Commit hook and commit message policy tooling (`package.json`, `.commitlintrc.json`).
- `renovate` config present in `renovate.json` for dependency maintenance automation.

## Configuration

**Environment:**
- No runtime environment-variable usage detected in source/config (`grep` across `apps/lit` and `components/lit` found no `process.env` or `import.meta.env` references).
- `.env` files: Not detected at repository root or package directories.

**Build:**
- Root orchestration config: `lerna.json`, `nx.json`, `pnpm-workspace.yaml`, root `package.json`.
- Package build config: `apps/lit/tsconfig.json`, `components/lit/tsconfig.json`.
- Dev/bundle/docs config: `apps/lit/web-dev-server.config.mjs`, `apps/lit/rollup.config.js`, `apps/lit/.eleventy.cjs`.
- Lint/format config (demo package): `apps/lit/.eslintrc.json`, `apps/lit/.prettierrc.json`.

## Platform Requirements

**Development:**
- Node.js + pnpm workspace tooling required to install and build (`package.json`, `pnpm-workspace.yaml`).
- TypeScript toolchain required in both packages (`components/lit/package.json`, `apps/lit/package.json`).

**Production:**
- Library artifact target is ESM package output in `components/lit/lib/` with `exports` and `main` from `components/lit/package.json`.
- Demo/static documentation target is browser-served assets from `apps/lit/dev/index.html` and Eleventy output directory from `apps/lit/.eleventy.cjs`.
- CI executes build validation on GitHub Actions in `.github/workflows/nodejs.yml`.

---

*Stack analysis: 2026-04-10*
