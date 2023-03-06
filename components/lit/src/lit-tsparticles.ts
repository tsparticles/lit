import { LitElement, html, PropertyValues } from "lit";
import { property, customElement } from "lit/decorators.js";
import { Container, Engine, tsParticles } from "tsparticles-engine";

/**
 * The LitParticles element.
 *
 * @id - This element has an id
 */
@customElement("lit-particles")
export class LitParticles extends LitElement {
  /**
   * The container id
   */
  @property({ type: String })
  id = "tsparticles";

  /**
   * The options
   */
  @property({ type: Object })
  options = {};

  container?: Container;

  initialized = false;

  @property({ type: Function })
  particlesInit?: (engine: Engine) => Promise<void>;

  @property({ type: Function })
  particlesLoaded?: (container?: Container) => Promise<void>;

  connectedCallback() {
    super.connectedCallback();

    this.particlesInit?.(tsParticles).then(() => {
      this.initialized = true;
    });
  }

  update(changedProperties: PropertyValues) {
    super.update(changedProperties);

    if (this.initialized) {
      tsParticles.load(this.id, this.options).then((container) => {
        this.container = container;

        this.particlesLoaded?.(container);
      });
    }
  }

  render() {
    if (!this.initialized) {
      return html``;
    }

    return html`<div id=${this.id}>
      <canvas></canvas>
    </div>`;
  }
}
