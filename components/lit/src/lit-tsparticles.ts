import { LitElement, html } from "lit";
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

  @property({ type: Function })
  particlesInit?: (engine: Engine) => Promise<void>;

  @property({ type: Function })
  particlesLoaded?: (container?: Container) => Promise<void>;

  constructor() {
    super();

    this.particlesInit?.(tsParticles);
  }

  connectedCallback() {
    super.connectedCallback();

    tsParticles.load(this.id, this.options).then(async (container) => {
      this.container = container;

      await this.particlesLoaded?.(container);
    });
  }

  disconnectedCallback(): void {
    if (this.container) {
      this.container.destroy();
    }

    super.disconnectedCallback();
  }

  render() {
    return html`<div id=${this.id}></div>`;
  }
}
