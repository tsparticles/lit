# External Integrations

**Analysis Date:** 2026-04-10

## APIs & External Services

**Client-side rendering/runtime libraries:**
- tsParticles runtime - Browser particle rendering and lifecycle loading.
  - SDK/Client: `tsparticles` and `@tsparticles/engine` in `apps/lit/package.json` and `components/lit/package.json`.
  - Auth: Not applicable (no auth flow in `apps/lit/src/index.ts` or `components/lit/src/lit-tsparticles.ts`).

**Package ecosystem / registry:**
- npm package registry consumption through pnpm workspace lock/install.
  - SDK/Client: `pnpm` configuration in root `package.json` and `pnpm-lock.yaml`.
  - Auth: Not detected in repository files (no `.npmrc` found in workspace scan).

**Source hosting and automation:**
- GitHub Actions CI for build execution.
  - SDK/Client: Workflow actions in `.github/workflows/nodejs.yml` (`actions/checkout`, `actions/setup-node`, `pnpm/action-setup`).
  - Auth: Managed by GitHub Actions runtime (no repository-level secret values present in tracked files).

## Data Storage

**Databases:**
- Not detected.
  - Connection: Not applicable.
  - Client: Not applicable.

**File Storage:**
- Local filesystem only for build artifacts and docs output:
  - TypeScript output to `apps/lit/lib/` and `components/lit/lib/` via tsconfig `outDir`.
  - Eleventy docs output to `apps/lit/docs/` configured by `apps/lit/.eleventy.cjs`.

**Caching:**
- Local build cache with Nx in workspace metadata/config (`nx.json` and `.nx/workspace-data/`).

## Authentication & Identity

**Auth Provider:**
- Not detected.
  - Implementation: No sign-in/auth middleware/client present in `apps/lit/src/index.ts` or `components/lit/src/lit-tsparticles.ts`.

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry/Datadog/Bugsnag packages or init code in source/config files).

**Logs:**
- Minimal local console logging pattern in build tooling only (`console.error` in `apps/lit/rollup.config.js`).

## CI/CD & Deployment

**Hosting:**
- Static-site and package-oriented repository; no cloud runtime host integration detected.
- Docs are structured for GitHub Pages-style publishing from docs output (`apps/lit/.eleventy.cjs` and guidance in `apps/lit/README.md`).

**CI Pipeline:**
- GitHub Actions pipeline in `.github/workflows/nodejs.yml`:
  - Node 20 setup
  - pnpm setup
  - `pnpm install`
  - `pnpm run build:ci`

## Environment Configuration

**Required env vars:**
- None required by application code detected (no `process.env` / `import.meta.env` usage in `apps/lit` and `components/lit`).

**Secrets location:**
- Not detected in repository source.
- `.env*` files not found by workspace scan; if used in CI, they are expected to be external GitHub Secrets (not committed).

## Webhooks & Callbacks

**Incoming:**
- None detected (no HTTP server/routes/webhook handlers in repository packages).

**Outgoing:**
- None detected from application code (no `fetch`, `axios`, `XMLHttpRequest`, `WebSocket`, or EventSource usage found).

---

*Integration audit: 2026-04-10*
