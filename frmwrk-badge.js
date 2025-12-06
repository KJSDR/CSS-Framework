/**
 * <frmwrk-badge>
 * A simple badge component for labels, status indicators, etc.
 * 
 * Category: Visual, Static Component
 * 
 * Usage:
 *   <frmwrk-badge>New</frmwrk-badge>
 *   <frmwrk-badge variant="accent">Hot</frmwrk-badge>
 * 
 * Attributes:
 *   variant - color variant (default: "primary", options: "primary", "accent", "subtle")
 * 
 * Example:
 *   <frmwrk-badge variant="accent">Sale</frmwrk-badge>
 */
class FrmwrkBadge extends HTMLElement {
    constructor() {
      super();
      
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._variant = 'primary';
      
      this._render();
    }
    
    static get observedAttributes() {
      return ['variant'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'variant' && oldValue !== newValue) {
        this._variant = newValue || 'primary';
        this._updateVariant();
      }
    }
    
    _render() {
      this._shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
          }
          
          .badge {
            display: inline-flex;
            align-items: center;
            padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
            font-size: var(--font-size-xs, 0.75rem);
            font-weight: var(--font-weight-semibold, 600);
            font-family: var(--font-family-sans, system-ui, sans-serif);
            line-height: 1;
            border-radius: var(--radius-sm, 0.25rem);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .badge.primary {
            background-color: var(--color-sea-deep, #0066cc);
            color: var(--color-sand, #fff);
          }
          
          .badge.accent {
            background-color: var(--color-rust, #ff6b35);
            color: var(--color-sand, #fff);
          }
          
          .badge.subtle {
            background-color: var(--color-subtle, #f0f0f0);
            color: var(--color-anchor, #333);
            border: var(--border-width, 1px) solid var(--color-border, #ddd);
          }
        </style>
        
        <span class="badge ${this._variant}">
          <slot></slot>
        </span>
      `;
    }
    
    _updateVariant() {
      const badge = this._shadowRoot.querySelector('.badge');
      if (badge) {
        badge.className = `badge ${this._variant}`;
      }
    }
  }
  
  customElements.define('frmwrk-badge', FrmwrkBadge);