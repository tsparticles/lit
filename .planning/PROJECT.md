# tsParticles Lit v4 Modernization

## What This Is

This project modernizes the existing `lit-tsparticles` monorepo so it is fully aligned with the tsParticles 4.0.0 beta line currently under development. The main focus is technical upgrade and migration work across the component package and demo app, not net-new product features. It is for maintainers and contributors who need a reliable, current, and maintainable Lit integration for tsParticles.

## Core Value

The Lit integration works correctly on tsParticles v4 beta with updated dependencies and modern code patterns, while keeping the package buildable and releasable.

## Requirements

### Validated

- ✓ Lit web component wrapper for tsParticles exists and is consumable as `lit-tsparticles` — existing
- ✓ Demo app initializes tsParticles and renders the Lit component in browser context — existing
- ✓ Workspace build orchestration exists with pnpm/Lerna/Nx and CI build execution — existing

### Active

- [ ] Upgrade workspace and package dependencies to current compatible versions.
- [ ] Align component and demo code with tsParticles `4.0.0-beta` APIs and package layout.
- [ ] Migrate code/config to modern TypeScript and ESM-friendly patterns where applicable.
- [ ] Preserve build/test reliability during migration with clear compatibility boundaries.

### Out of Scope

- New particle features unrelated to migration — this initiative is for platform upgrade and compatibility.
- New framework wrappers or multi-framework expansion — focus remains on the Lit package.
- Product-level redesign of docs site/demo UX — only update what is required for v4 migration validation.

## Context

- Existing codebase is a brownfield monorepo with `components/lit` and `apps/lit` packages.
- A current codebase map exists in `.planning/codebase/` and confirms working library/demo structure.
- The repository is already in active migration history toward v4, with repeated "migrating to v4" commits.
- The user objective is explicit: update to latest versions, track tsParticles 4.0.0 beta packages, and modernize syntax.

## Constraints

- **Tech stack**: Keep Lit + tsParticles architecture intact — migration should evolve, not replace, the established integration.
- **Compatibility**: Use tsParticles 4.0.0 beta packages developed by this project — dependency choices must support that track.
- **Quality**: Preserve build/test health across packages — migration cannot regress baseline reliability.
- **Scope**: Prioritize upgrade and modernization over feature expansion — avoid scope drift.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Run in auto mode with quick depth | Fast path from project context to executable roadmap for migration work | — Pending |
| Keep planning docs tracked in git | Migration touches many moving parts; documented decisions should be versioned | — Pending |
| Enable research/plan-check/verifier workflow agents | Upgrade/migration work benefits from stronger guardrails against hidden compatibility gaps | — Pending |

---
*Last updated: 2026-04-10 after initialization*
