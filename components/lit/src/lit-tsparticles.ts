import { LitElement, html } from "lit";
import { property, customElement } from "lit/decorators.js";

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

  render() {
    return html`<div id=${this.id}></div>`;
  }
}
