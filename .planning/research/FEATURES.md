# Feature Research

**Domain:** Frontend wrapper package migration (tsParticles Lit v4 beta modernization)
**Researched:** 2026-04-10
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = migration feels incomplete or unsafe.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| v4 API compatibility for core wrapper component | Existing users expect `lit-particles` to keep working when adopting tsParticles v4 beta packages | MEDIUM | Align to canonical `@tsparticles/engine` APIs, remove mixed import/package naming, keep behavior parity where possible |
| Deterministic lifecycle and idempotent updates | Wrapper consumers expect no duplicate engine loads, no runaway re-init, and stable behavior across rerenders | MEDIUM | Gate initialization on relevant prop changes (`id`, `options`, `url`), add explicit teardown strategy, avoid throwing from normal render/update paths |
| Source-to-distribution consistency (`src` -> `lib`) | Package consumers expect shipped JS/types to match source and docs | LOW | Treat `lib/*` as generated output, regenerate in CI, fail on artifact drift |
| Clear migration docs and compatibility boundaries | Maintainers/contributors need exact upgrade guidance for beta APIs and peer dependency ranges | LOW | Update READMEs/scripts to `pnpm` reality, document supported tsParticles/Lit ranges and breaking changes |
| Build/test baseline for migration safety | A major-version migration requires regression detection before release | HIGH | Add minimum tests for update/load/teardown behavior and CI checks for build reproducibility |

### Differentiators (Competitive Advantage)

Features that make this migration initiative meaningfully stronger than a basic version bump.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Backward-aware migration layer with explicit deprecations | Reduces adoption friction by supporting common v3-style usage patterns with warnings during transition | MEDIUM | Add a compatibility adapter map for known rename/signature changes; emit actionable deprecation messages |
| Performance-focused loading strategy | Makes Lit wrapper feel modern by avoiding full-engine cost where unnecessary | MEDIUM | Provide documented slim-loader path (selective presets/plugins) vs default full loader in demo/examples |
| Unified workspace orchestration policy | Improves contributor DX and CI predictability across monorepo | MEDIUM | Clarify Nx vs Lerna responsibilities; prefer one build graph authority for migration pipelines |
| Release-readiness guardrails (migration checklist + CI gates) | Increases trust that each beta update is publish-safe | LOW | Include automated checks for API drift, type generation, docs sync, and smoke demo boot |

### Anti-Features (Commonly Requested, Often Problematic)

Features that appear attractive but should be explicitly excluded from this migration initiative.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| New particle capabilities unrelated to v4 migration | Tempting to bundle visible feature work with a major upgrade | Expands scope, hides migration regressions, delays stabilization | Keep scope on compatibility/modernization; track new effects/features in post-migration milestones |
| Multi-framework wrapper expansion during Lit migration | Seen as efficiency opportunity while touching shared ecosystem | Splits focus from Lit reliability and multiplies test matrix complexity | Complete Lit v4 migration first; reuse lessons for separate framework tracks later |
| Hard-fail runtime exceptions for normal misconfiguration | Seems strict and explicit for invalid inputs | Crashes host rendering and worsens DX in dynamic app flows | Use guarded no-op/render fallback + clear console warning/errors and docs |
| Carrying dual legacy and beta build artifacts long-term | Feels safer for compatibility hedging | Produces artifact drift, dependency confusion, and release ambiguity | Enforce single canonical output per release line with tagged compatibility notes |

## Feature Dependencies

```text
Canonical v4 API alignment
    └──requires──> Source-to-distribution consistency
                          └──requires──> CI artifact drift checks

Deterministic lifecycle and idempotent updates
    └──requires──> Build/test baseline for migration safety

Backward-aware migration layer
    └──requires──> Canonical v4 API alignment

Performance-focused loading strategy
    └──requires──> Canonical v4 API alignment
    └──enhances──> Deterministic lifecycle and idempotent updates

Unified workspace orchestration policy
    └──requires──> Build/test baseline for migration safety

Unrelated net-new particle features
    └──conflicts──> Migration stabilization and release-readiness guardrails
```

### Dependency Notes

- **Canonical v4 API alignment requires source/distribution consistency:** if `src` and published `lib` diverge, migration behavior and generated types cannot be trusted.
- **Lifecycle improvements require tests first:** without lifecycle regression tests, idempotency and teardown changes are too risky during beta alignment.
- **Compatibility adapter depends on clean v4 baseline:** adaptation logic should sit on top of a correct v4 core, not compensate for unresolved package/API drift.
- **Performance loading depends on API clarity:** selective loader patterns are safe only after import paths and engine contracts are standardized.
- **Scope control is a delivery dependency:** anti-features (net-new scope) directly compete with migration hardening effort and should be blocked in this milestone.

## MVP Definition

### Launch With (v1)

Minimum viable migration outcome for a robust v4 initiative.

- [ ] v4 API-compatible Lit wrapper with canonical package/import usage
- [ ] Idempotent initialization/update behavior with safe misconfiguration handling and teardown
- [ ] Generated artifact consistency enforced in CI (`src` and `lib` in sync)
- [ ] Basic automated tests covering load/update/error/cleanup behavior
- [ ] Updated migration docs (dependency ranges, usage changes, known beta constraints)

### Add After Validation (v1.x)

- [ ] Backward-aware compatibility adapter with deprecation warnings for common legacy patterns
- [ ] Slim-loader performance profiles and documented presets
- [ ] Expanded CI checks for matrixed dependency compatibility and release smoke tests

### Future Consideration (v2+)

- [ ] Cross-wrapper migration toolchain standardization across frameworks
- [ ] Broader demo/documentation UX redesign beyond migration validation

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| v4 API compatibility for wrapper component | HIGH | MEDIUM | P1 |
| Deterministic lifecycle + teardown | HIGH | MEDIUM | P1 |
| Build/test baseline for migration safety | HIGH | HIGH | P1 |
| Source/distribution CI consistency | HIGH | LOW | P1 |
| Migration docs + compatibility boundaries | HIGH | LOW | P1 |
| Backward-aware migration layer | MEDIUM | MEDIUM | P2 |
| Performance-focused loading strategy | MEDIUM | MEDIUM | P2 |
| Unified orchestration policy | MEDIUM | MEDIUM | P2 |

**Priority key:**
- P1: Must have for robust v4 migration
- P2: Should have after baseline stability
- P3: Future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| Major-version wrapper migration quality | Commonly ships as minimal dependency bump with limited guardrails | Some wrappers add compatibility shims but weak CI enforcement | Combine strict CI artifact checks + lifecycle hardening + migration docs as default baseline |
| Runtime safety under reactivity/lifecycle churn | Many wrappers reinitialize too aggressively on each render/update | Some optimize updates but skip teardown and leak handling | Implement prop-diff gating plus explicit cleanup strategy for Lit lifecycle |

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/CONVENTIONS.md`
- `components/lit/src/lit-tsparticles.ts`
- `components/lit/package.json`
- `apps/lit/src/index.ts`
- `README.md`

---
*Feature research for: tsParticles Lit wrapper v4 modernization*
*Researched: 2026-04-10*
