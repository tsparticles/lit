# Testing Patterns

**Analysis Date:** 2026-04-10

## Test Framework

**Runner:**
- Not currently configured in executable scripts for this workspace.
- Historical/expected stack listed in docs: Karma + Mocha via open-wc tooling (`apps/lit/README.md`, root `README.md`).
- Config: Not detected (`jest.config.*` and `vitest.config.*` absent from repository search).

**Assertion Library:**
- Not detected in active test files.
- Documented dependency stack includes Chai in `apps/lit/package.json` and docs references in `apps/lit/README.md`.

**Run Commands:**
```bash
Not detected in package scripts    # Run all tests
Not detected                        # Watch mode
Not detected                        # Coverage
```

## Test File Organization

**Location:**
- No committed test directories or test files are present (`**/*.test.*`, `**/*.spec.*`, `**/*test*` searches return no matches).
- README references legacy test usage but current `apps/lit/package.json` has no `test` script.

**Naming:**
- Not detected in current codebase because no test files are committed.

**Structure:**
```
Not applicable (no test tree detected under `apps/lit/` or `components/lit/`)
```

## Test Structure

**Suite Organization:**
```typescript
// No executable in-repo test suites found.
// Reference pattern documented in `components/lit/CONTROLLER_PATTERN.md`:
describe("ParticlesController", () => {
  afterEach(() => {
    ParticlesController.reset();
    ParticlesService.reset();
  });

  it("initializes engine on host connect", async () => {
    expect(ParticlesController.isEngineReady()).toBe(true);
  });
});
```

**Patterns:**
- Setup pattern: initialize controller/service before assertions (documented in `components/lit/CONTROLLER_PATTERN.md`).
- Teardown pattern: reset static/singleton state in `afterEach` (documented in `components/lit/CONTROLLER_PATTERN.md`).
- Assertion pattern: state-based expectations on engine readiness and errors (documented in `components/lit/CONTROLLER_PATTERN.md`).

## Mocking

**Framework:**
- Not detected in committed tests.
- `sinon` is available as a dev dependency in `apps/lit/package.json`, but no usages are present in repository code files.

**Patterns:**
```typescript
// Documented mock host pattern from `components/lit/CONTROLLER_PATTERN.md`
const mockHost = {
  addController: () => {},
  requestUpdate: () => {},
};

const controller = new ParticlesController(mockHost as any, async () => {});
await controller.hostConnected();
```

**What to Mock:**
- Mock `ReactiveControllerHost` shape (`addController`, `requestUpdate`) for controller unit tests as shown in `components/lit/CONTROLLER_PATTERN.md`.
- Mock engine initialization callbacks (`particlesInit`) to simulate success/failure as shown in `components/lit/CONTROLLER_PATTERN.md`.

**What NOT to Mock:**
- Do not mock internal class static state reset methods during unit assertions; use real `reset()` calls (`components/lit/CONTROLLER_PATTERN.md`).
- Do not mock template rendering primitives (`html`) for simple component render checks; validate rendered output behavior directly when tests are added under `components/lit/src/`.

## Fixtures and Factories

**Test Data:**
```typescript
// Minimal inline fixture pattern derived from docs examples
const particleOptions = {
  particles: {
    number: { value: 80 },
    shape: { type: "circle" },
    move: { speed: 2 },
  },
};
```

**Location:**
- No fixture directories currently exist.
- Place future fixtures adjacent to test files (for example `components/lit/src/__fixtures__/`) once test suite is introduced.

## Coverage

**Requirements:** None enforced

**View Coverage:**
```bash
Not detected (no coverage command configured in `apps/lit/package.json` or root `package.json`)
```

## Test Types

**Unit Tests:**
- Not implemented in committed code.
- Intended unit scope (from docs) targets controller/service lifecycle and error state behavior (`components/lit/CONTROLLER_PATTERN.md`).

**Integration Tests:**
- Not implemented in committed code.
- Existing runtime wiring exists in `apps/lit/src/index.ts` and `components/lit/src/lit-tsparticles.ts`; integration tests are absent.

**E2E Tests:**
- Not used (no Playwright/Cypress/Webdriver configs detected in repository files).

## Common Patterns

**Async Testing:**
```typescript
// Documented async pattern from `components/lit/CONTROLLER_PATTERN.md`
it("tracks initialization errors", async () => {
  await ParticlesService.initialize(async () => {
    throw new Error("Init failed");
  }).catch(() => {});

  expect(ParticlesService.getError()?.message).toContain("Init failed");
});
```

**Error Testing:**
```typescript
// Runtime production error branch to cover when tests are added
// Source: `components/lit/src/lit-tsparticles.ts`
if (!this.options && !this.url) {
  throw new Error("No options or url provided");
}
```

---

*Testing analysis: 2026-04-10*
