# Lit ParticlesController Pattern

## Overview

Lit web components use **reactive controllers** for managing state and lifecycle. The `ParticlesController` provides centralized, app-level tsParticles engine initialization with caching and singleton patterns.

Two approaches are provided:
1. **ReactiveController** — Declarative, integrates with Lit's reactive system
2. **ParticlesService** — Service-oriented, framework-agnostic

### Features
- **Single initialization**: Engine loaded once across all components
- **Lazy evaluation**: Init only when first component connects
- **Static caching**: Singleton pattern via static methods
- **Error tracking**: Error state available to all consumers
- **Framework-neutral**: Works with any web component or vanilla JS

## Setup

### Approach 1: ReactiveController (Recommended for Lit)

```typescript
import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ParticlesController } from "@tsparticles/lit";
import { loadFull } from "@tsparticles/presets";

/**
 * App container element with ParticlesController.
 * Initializes engine once when first component connects.
 */
export class AppContainer extends LitElement {
  private particlesController = new ParticlesController(
    this,
    loadFull  // Your initialization function
  );

  render() {
    return html`
      <div class="app">
        <header>My App</header>
        <slot></slot>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .app {
      width: 100%;
      height: 100%;
    }
  `;
}

customElements.define("app-container", AppContainer);
```

### Approach 2: Service Pattern

```typescript
import { ParticlesService } from "@tsparticles/lit";
import { loadFull } from "@tsparticles/presets";

// Initialize early in app boot
ParticlesService.initialize(loadFull).catch((err) => {
  console.error("Failed to initialize particles:", err);
});
```

## Usage in Components

### With ReactiveController

```typescript
import { LitElement, html } from "lit";
import { ParticlesController } from "@tsparticles/lit";
import type { Container } from "@tsparticles/engine";

export class ParticlesElement extends LitElement {
  private particlesController = new ParticlesController(this);
  
  private container?: Container;

  handleParticlesLoaded(event: CustomEvent): void {
    this.container = event.detail;
    console.log("Particles loaded:", this.container);
  }

  render() {
    const ready = ParticlesController.isEngineReady();
    const error = ParticlesController.getError();

    if (error) {
      return html`<div class="error">${error.message}</div>`;
    }

    if (!ready) {
      return html`<div class="loading">Loading particles...</div>`;
    }

    return html`
      <particles-component
        id="bg-particles"
        .options=${this.particleConfig}
        @particlesLoaded=${this.handleParticlesLoaded}
      ></particles-component>
    `;
  }

  private get particleConfig() {
    return {
      particles: {
        number: { value: 80 },
        shape: { type: "circle" },
        move: { speed: 2 },
      },
    };
  }
}

customElements.define("particles-element", ParticlesElement);
```

### With Service Pattern

```typescript
import { LitElement, html } from "lit";
import { ParticlesService } from "@tsparticles/lit";
import type { Container } from "@tsparticles/engine";

export class ParticlesElement extends LitElement {
  private container?: Container;

  connectedCallback(): void {
    super.connectedCallback();
    this.checkReady();
  }

  private async checkReady(): Promise<void> {
    if (ParticlesService.isReady()) {
      this.requestUpdate();
      return;
    }

    try {
      await ParticlesService.initialize();
      this.requestUpdate();
    } catch (err) {
      console.error("Failed to initialize particles:", err);
      this.requestUpdate();
    }
  }

  render() {
    const engine = ParticlesService.getEngine();
    const error = ParticlesService.getError();

    if (error) {
      return html`<div class="error">${error.message}</div>`;
    }

    if (!engine) {
      return html`<div class="loading">Loading...</div>`;
    }

    return html`<particles-component id="bg"></particles-component>`;
  }
}

customElements.define("particles-el", ParticlesElement);
```

## API Reference

### ParticlesController

```typescript
class ParticlesController implements ReactiveController {
  constructor(host: ReactiveControllerHost, particlesInit?: (engine: Engine) => Promise<void>);

  // Static methods (access from any component)
  static getEngine(): Engine | undefined;
  static isEngineReady(): boolean;
  static getError(): Error | undefined;
  static reset(): void;
}
```

### ParticlesService

```typescript
class ParticlesService {
  static async initialize(particlesInit?: (engine: Engine) => Promise<void>): Promise<Engine>;
  static getEngine(): Engine | undefined;
  static isReady(): boolean;
  static getError(): Error | undefined;
  static reset(): void;
}
```

## Usage Examples

### Basic Web Component

```typescript
import { LitElement, html, css } from "lit";
import { ParticlesController } from "@tsparticles/lit";

export class BackgroundParticles extends LitElement {
  private controller = new ParticlesController(this);

  render() {
    return ParticlesController.isEngineReady()
      ? html`<div id="particles-bg"></div>`
      : html``;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
    }
    #particles-bg {
      width: 100%;
      height: 100%;
    }
  `;
}

customElements.define("background-particles", BackgroundParticles);
```

### Multiple Independent Components

```typescript
import { LitElement, html } from "lit";
import { ParticlesService } from "@tsparticles/lit";

export class Card extends LitElement {
  render() {
    const engine = ParticlesService.getEngine();
    if (!engine) return html``;

    return html`
      <div class="card">
        <h2>Particle Card</h2>
        <div id="card-particles"></div>
      </div>
    `;
  }
}

customElements.define("particle-card", Card);
```

### With Reactive Properties

```typescript
import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import { ParticlesController } from "@tsparticles/lit";

export class ReactiveParticles extends LitElement {
  private controller = new ParticlesController(this);

  @property({ type: Object })
  options = { particles: { number: { value: 80 } } };

  @state()
  private isReady = false;

  connectedCallback(): void {
    super.connectedCallback();
    // Poll ready state
    const checkReady = () => {
      const ready = ParticlesController.isEngineReady();
      if (ready !== this.isReady) {
        this.isReady = ready;
      }
    };
    checkReady();
    this.updateComplete.then(() => checkReady());
  }

  render() {
    return this.isReady
      ? html`<particles-container .options=${this.options}></particles-container>`
      : html`<div>Initializing...</div>`;
  }
}

customElements.define("reactive-particles", ReactiveParticles);
```

### Error Boundary Component

```typescript
import { LitElement, html } from "lit";
import { ParticlesController } from "@tsparticles/lit";

export class ErrorBoundary extends LitElement {
  private controller = new ParticlesController(this);

  render() {
    const error = ParticlesController.getError();

    if (error) {
      return html`
        <div class="error-fallback">
          <h3>Particles failed to load</h3>
          <p>${error.message}</p>
          <button @click=${this.retry}>Retry</button>
        </div>
      `;
    }

    return html`<slot></slot>`;
  }

  private retry(): void {
    ParticlesController.reset();
    this.requestUpdate();
  }
}

customElements.define("error-boundary", ErrorBoundary);
```

### Full App Example

```typescript
// app-main.ts
import { LitElement, html, css } from "lit";
import { ParticlesController } from "@tsparticles/lit";
import { loadFull } from "@tsparticles/presets";

import "./components/header.js";
import "./components/content.js";
import "./components/particles-bg.js";

export class AppMain extends LitElement {
  private particlesController = new ParticlesController(this, loadFull);

  render() {
    return html`
      <div class="app">
        <app-header></app-header>
        <particles-bg></particles-bg>
        <app-content></app-content>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
    .app {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `;
}

customElements.define("app-main", AppMain);
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My App</title>
  </head>
  <body>
    <app-main></app-main>
    <script type="module" src="/src/app-main.ts"></script>
  </body>
</html>
```

## Performance Notes

| Scenario | Without Caching | With Caching |
|----------|-----------------|-------------|
| 1 component | ~1.5s | ~1.5s |
| 5 components | ~7.5s | ~1.5s |
| 10 components | ~15s | ~1.5s |
| Memory (each) | 15-20MB | Shared |

## Testing

### Vitest Example

```typescript
import { describe, it, expect, afterEach } from "vitest";
import { ParticlesController, ParticlesService } from "@tsparticles/lit";

describe("ParticlesController", () => {
  afterEach(() => {
    ParticlesController.reset();
    ParticlesService.reset();
  });

  it("initializes engine on host connect", async () => {
    const mockHost = {
      addController: () => {},
      requestUpdate: () => {},
    };

    const controller = new ParticlesController(mockHost as any, async () => {});
    await controller.hostConnected();

    expect(ParticlesController.isEngineReady()).toBe(true);
  });

  it("caches engine across instances", async () => {
    await ParticlesService.initialize(async () => {});
    const engine1 = ParticlesService.getEngine();

    await ParticlesService.initialize(async () => {}); // Second call
    const engine2 = ParticlesService.getEngine();

    expect(engine1).toBe(engine2);
  });

  it("tracks initialization errors", async () => {
    await ParticlesService.initialize(async () => {
      throw new Error("Init failed");
    }).catch(() => {});

    const error = ParticlesService.getError();
    expect(error?.message).toContain("Init failed");
  });
});
```

## Troubleshooting

### Engine not available in child components

**Issue:** Child components don't see initialized engine

**Fix:** Ensure parent component with controller is rendered first:
```typescript
// ✓ Correct order
<app-main>  {/* Controller initialized here */}
  <particles-background></particles-background>  {/* Can access engine */}
</app-main>

// ✗ Wrong order
<particles-background></particles-background>  {/* Would fail */}
<app-main></app-main>
```

### Controller fires multiple times

**Issue:** `hostConnected` called repeatedly

**Debug:**
```typescript
hostConnected() {
  console.log("Connected, engine ready:", ParticlesController.isEngineReady());
  // Only initialize first time
  if (!ParticlesController.isEngineReady()) {
    this.initialize();
  }
}
```

## Migration from Direct tsParticles

**Before:**
```typescript
import { tsParticles } from "@tsparticles/engine";

export class OldParticles extends LitElement {
  render() {
    // No guarantee of single init
    tsParticles.load({ id: "..." });
  }
}
```

**After:**
```typescript
import { ParticlesController } from "@tsparticles/lit";

export class NewParticles extends LitElement {
  private controller = new ParticlesController(this);

  render() {
    // Centralized, cached init
    if (ParticlesController.isEngineReady()) {
      // Use engine...
    }
  }
}
```
