# Coding Conventions

**Analysis Date:** 2026-04-10

## Naming Patterns

**Files:**
- Use kebab-case for component module filenames (for example `components/lit/src/lit-tsparticles.ts`).
- Use generic entrypoint naming for app bootstrap files (for example `apps/lit/src/index.ts`).
- Use configuration defaults from tooling ecosystems (for example `apps/lit/.eslintrc.json`, `apps/lit/.prettierrc.json`, `apps/lit/tsconfig.json`).

**Functions:**
- Use camelCase for functions and methods (for example `update`, `render` in `components/lit/src/lit-tsparticles.ts`).
- Use verb-first camelCase for lifecycle and setup methods in documented patterns (for example `checkReady`, `handleParticlesLoaded` in `components/lit/CONTROLLER_PATTERN.md`).

**Variables:**
- Use camelCase for local variables and constants (for example `changedProperties`, `id` in `components/lit/src/lit-tsparticles.ts`).
- Use descriptive nouns for component state fields (for example `container`, `options`, `url` in `components/lit/src/lit-tsparticles.ts`).

**Types:**
- Use PascalCase for classes and imported types (for example `LitParticles`, `PropertyValues`, `ISourceOptions` in `components/lit/src/lit-tsparticles.ts`).
- Keep type imports co-located with runtime imports from the same package where practical (for example `Container`, `Engine`, `ISourceOptions` in `components/lit/src/lit-tsparticles.ts`).

## Code Style

**Formatting:**
- Tool used: Prettier configured in `apps/lit/.prettierrc.json`.
- Key settings: `singleQuote: true`, `tabWidth: 2`, `trailingComma: es5`, `bracketSpacing: false`, `arrowParens: always`.
- Apply formatting to app TypeScript sources with `format` script in `apps/lit/package.json` (`prettier src/* --write`).

**Linting:**
- Tool used: ESLint + `@typescript-eslint` configured in `apps/lit/.eslintrc.json`.
- Enforce baseline recommended rules via `eslint:recommended` and `plugin:@typescript-eslint/recommended` in `apps/lit/.eslintrc.json`.
- Treat unused variables as warnings and allow intentionally unused args prefixed with `_` via `@typescript-eslint/no-unused-vars` in `apps/lit/.eslintrc.json`.
- Run lint with `lint` script in `apps/lit/package.json` (`lit-analyzer && eslint 'src/**/*.ts'`).

## Import Organization

**Order:**
1. Third-party package imports first (for example `import {LitElement, html, PropertyValues} from "lit";` in `components/lit/src/lit-tsparticles.ts`).
2. Package subpath/decorator imports next (for example `import {property, customElement} from "lit/decorators.js";` in `components/lit/src/lit-tsparticles.ts`).
3. Project-local relative imports last when present (no relative imports currently present in `components/lit/src/lit-tsparticles.ts` or `apps/lit/src/index.ts`).

**Path Aliases:**
- Not detected in `apps/lit/tsconfig.json` and `components/lit/tsconfig.json`.
- Use package imports (`lit-tsparticles`, `@tsparticles/engine`) as shown in `apps/lit/src/index.ts`.

## Error Handling

**Patterns:**
- Throw explicit errors for invalid component configuration state (for example `throw new Error("No options or url provided")` in `components/lit/src/lit-tsparticles.ts`).
- Use promise suppression pattern `void` when intentionally fire-and-forget async calls in lifecycle methods (for example `void tsParticles.load(...)` in `components/lit/src/lit-tsparticles.ts`).
- In documented controller/service flows, catch initialization failures and update UI state in `components/lit/CONTROLLER_PATTERN.md` examples.

## Logging

**Framework:** console

**Patterns:**
- Use `console.error` for non-ignored warnings in build config (`apps/lit/rollup.config.js`).
- Use `console.error` and `console.log` in docs/examples for troubleshooting and initialization visibility (`components/lit/CONTROLLER_PATTERN.md`).

## Comments

**When to Comment:**
- Use JSDoc blocks for public class and reactive property intent (for example comments above `LitParticles`, `id`, `options`, `url` in `components/lit/src/lit-tsparticles.ts`).
- Use inline comments sparingly to explain non-obvious build behavior (for example monorepo root note in `apps/lit/web-dev-server.config.mjs`).

**JSDoc/TSDoc:**
- JSDoc is present for component and property descriptions in `components/lit/src/lit-tsparticles.ts`.
- TSDoc-specific tags are not consistently applied beyond simple descriptions.

## Function Design

**Size:**
- Keep component methods concise and single-purpose (`update` and `render` in `components/lit/src/lit-tsparticles.ts` are short and focused).

**Parameters:**
- Use framework-typed parameters for lifecycle hooks (`changedProperties: PropertyValues` in `components/lit/src/lit-tsparticles.ts`).

**Return Values:**
- Return Lit templates from `render()` using `html` tagged literals (`components/lit/src/lit-tsparticles.ts`).
- Use explicit async IIFE in entrypoint for startup tasks (`apps/lit/src/index.ts`).

## Module Design

**Exports:**
- Export primary component classes as named exports (for example `export class LitParticles` in `components/lit/src/lit-tsparticles.ts`).
- Rely on package `exports` map for public entry (`components/lit/package.json` with `".": "./lib/lit-tsparticles.js"`).

**Barrel Files:**
- Not detected in this workspace (`components/lit/src/` currently contains `lit-tsparticles.ts` directly).

---

*Convention analysis: 2026-04-10*
