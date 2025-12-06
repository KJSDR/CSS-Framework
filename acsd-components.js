/**
 * ACSD Web Components
 * Custom elements that integrate with the ACSD CSS Framework
 * These components use the framework's design tokens for consistent styling
 */

/**
 * <frmwrk-theme-toggle>
 * A theme toggle button that switches between light and dark modes
 * 
 * Usage:
 *   <frmwrk-theme-toggle></frmwrk-theme-toggle>
 * 
 * Attributes:
 *   position - fixed position (default: "top-right", options: "top-left", "top-right", "bottom-left", "bottom-right")
 * 
 * Example:
 *   <frmwrk-theme-toggle position="top-left"></frmwrk-theme-toggle>
 */
class FrmwrkThemeToggle extends HTMLElement {
  constructor() {
    super();
    
    // Attach shadow DOM for encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    
    // Internal state
    this._position = 'top-right';
    
    // Render the component
    this._render();
  }
  
  // Define which attributes to observe
  static get observedAttributes() {
    return ['position'];
  }
  
  // Called when component is added to DOM
  connectedCallback() {
    // Set up click handler
    this._button = this._shadowRoot.querySelector('button');
    this._button.addEventListener('click', () => this._toggleTheme());
    
    // Load saved theme preference
    this._loadSavedTheme();
  }
  
  // Called when component is removed from DOM
  disconnectedCallback() {
    // Clean up event listener
    if (this._button) {
      this._button.removeEventListener('click', this._toggleTheme);
    }
  }
  
  // Called when observed attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'position' && oldValue !== newValue) {
      this._position = newValue || 'top-right';
      this._updatePosition();
    }
  }
  
  // Render the component's HTML and CSS
  _render() {
    this._shadowRoot.innerHTML = `
      <style>
        /* Import framework tokens - these are available globally */
        :host {
          /* Position the button */
          position: fixed;
          z-index: 1000;
        }
        
        button {
          padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
          background-color: var(--color-subtle, #f0f0f0);
          color: var(--color-anchor, #333);
          border: var(--border-width, 1px) solid var(--color-border, #ddd);
          border-radius: var(--radius-md, 0.375rem);
          cursor: pointer;
          font-size: var(--font-size-sm, 0.875rem);
          font-weight: var(--font-weight-medium, 500);
          font-family: var(--font-family-sans, system-ui, sans-serif);
          transition: all var(--transition-fast, 150ms ease);
          box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
          display: flex;
          align-items: center;
          gap: var(--space-xs, 0.25rem);
        }
        
        button:hover {
          background-color: var(--color-sea-deep, #0066cc);
          color: var(--color-sand, #fff);
          border-color: var(--color-sea-deep, #0066cc);
          box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.1));
        }
        
        button:focus-visible {
          outline: var(--border-width-thick, 2px) solid var(--color-focus, #ff6b35);
          outline-offset: 0.25em;
        }
        
        button:active {
          transform: translateY(1px);
        }
        
        .icon {
          font-size: 1.2em;
          line-height: 1;
        }
      </style>
      
      <button aria-label="Toggle dark mode">
        <span class="label">Theme</span>
      </button>
    `;
    
    // Set initial position
    this._updatePosition();
  }
  
  // Update button position based on attribute
  _updatePosition() {
    const positions = {
      'top-left': { top: 'var(--space-lg, 1.5rem)', left: 'var(--space-lg, 1.5rem)', right: 'auto', bottom: 'auto' },
      'top-right': { top: 'var(--space-lg, 1.5rem)', right: 'var(--space-lg, 1.5rem)', left: 'auto', bottom: 'auto' },
      'bottom-left': { bottom: 'var(--space-lg, 1.5rem)', left: 'var(--space-lg, 1.5rem)', top: 'auto', right: 'auto' },
      'bottom-right': { bottom: 'var(--space-lg, 1.5rem)', right: 'var(--space-lg, 1.5rem)', top: 'auto', left: 'auto' }
    };
    
    const pos = positions[this._position] || positions['top-right'];
    
    Object.keys(pos).forEach(key => {
      this.style[key] = pos[key];
    });
  }
  
  // Toggle between light and dark themes
  _toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.classList.contains('theme-dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      html.classList.add('theme-dark');
    } else {
      html.classList.remove('theme-dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update button icon
    this._updateIcon(newTheme);
    
    // Dispatch custom event for other components/scripts to listen to
    this.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme: newTheme },
      bubbles: true,
      composed: true // Allows event to cross shadow DOM boundary
    }));
  }
  
  // Update the icon based on current theme
  _updateIcon(theme) {
    // No icon to update anymore
  }
  
  // Load saved theme preference from localStorage
  _loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('theme-dark');
      this._updateIcon('dark');
    } else {
      this._updateIcon('light');
    }
  }
}

// Register the custom element
customElements.define('frmwrk-theme-toggle', FrmwrkThemeToggle);


/**
 * <frmwrk-badge>
 * A simple badge component for labels, status indicators, etc.
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


/**
 * <frmwrk-alert>
 * A dismissible alert component for notifications, warnings, and messages
 * 
 * Usage:
 *   <frmwrk-alert>This is an alert message</frmwrk-alert>
 *   <frmwrk-alert variant="warning" dismissible>Warning message</frmwrk-alert>
 * 
 * Attributes:
 *   variant - alert type (default: "info", options: "info", "success", "warning", "error")
 *   dismissible - if present, shows a close button (boolean attribute)
 *   open - controls visibility (default: true)
 * 
 * Events:
 *   alert-dismissed - fired when the alert is dismissed by the user
 * 
 * Example:
 *   <frmwrk-alert variant="success" dismissible>
 *     Changes saved successfully!
 *   </frmwrk-alert>
 */
class FrmwrkAlert extends HTMLElement {
  constructor() {
    super();
    
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._variant = 'info';
    this._dismissible = false;
    this._open = true;
    
    this._render();
  }
  
  static get observedAttributes() {
    return ['variant', 'dismissible', 'open'];
  }
  
  connectedCallback() {
    // Set up close button handler if dismissible
    this._closeButton = this._shadowRoot.querySelector('.close-button');
    if (this._closeButton) {
      this._closeButton.addEventListener('click', () => this._dismiss());
    }
    
    // Handle keyboard accessibility for close button
    if (this._closeButton) {
      this._closeButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._dismiss();
        }
      });
    }
  }
  
  disconnectedCallback() {
    // Clean up event listeners
    if (this._closeButton) {
      this._closeButton.removeEventListener('click', this._dismiss);
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'variant':
        this._variant = newValue || 'info';
        this._updateVariant();
        break;
      case 'dismissible':
        this._dismissible = newValue !== null;
        this._updateDismissible();
        break;
      case 'open':
        this._open = newValue !== 'false' && newValue !== null;
        this._updateVisibility();
        break;
    }
  }
  
  _render() {
    const variantIcons = {
      info: '',
      success: '',
      warning: '',
      error: ''
    };
    
    this._shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: var(--space-md, 1rem);
        }
        
        :host([open="false"]) {
          display: none;
        }
        
        .alert {
          position: relative;
          padding: var(--space-md, 1rem) var(--space-lg, 1.5rem);
          border-radius: var(--radius-md, 0.375rem);
          border-left: var(--border-width-thick, 4px) solid;
          font-family: var(--font-family-sans, system-ui, sans-serif);
          font-size: var(--font-size-base, 1rem);
          line-height: var(--line-height-normal, 1.5);
          box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
          display: flex;
          align-items: flex-start;
          gap: var(--space-sm, 0.5rem);
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .alert.dismissing {
          animation: slideOut 0.3s ease-in forwards;
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        
        .icon {
          font-size: 1.2em;
          line-height: 1;
          flex-shrink: 0;
        }
        
        .content {
          flex: 1;
          padding-top: 0.1em;
        }
        
        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-size: 1.5em;
          line-height: 1;
          color: inherit;
          opacity: 0.5;
          transition: opacity var(--transition-fast, 150ms ease);
          flex-shrink: 0;
          margin-left: var(--space-sm, 0.5rem);
        }
        
        .close-button:hover {
          opacity: 1;
        }
        
        .close-button:focus-visible {
          outline: var(--border-width, 2px) solid currentColor;
          outline-offset: 0.25em;
          opacity: 1;
          border-radius: var(--radius-sm, 0.25rem);
        }
        
        /* Variant styles */
        .alert.info {
          background-color: oklch(0.95 0.02 240);
          color: oklch(0.35 0.08 240);
          border-left-color: var(--color-sea-deep, #0066cc);
        }
        
        .alert.success {
          background-color: oklch(0.95 0.02 140);
          color: oklch(0.35 0.08 140);
          border-left-color: oklch(0.55 0.15 140);
        }
        
        .alert.warning {
          background-color: oklch(0.95 0.02 60);
          color: oklch(0.35 0.08 50);
          border-left-color: oklch(0.65 0.15 60);
        }
        
        .alert.error {
          background-color: oklch(0.95 0.02 20);
          color: oklch(0.35 0.08 20);
          border-left-color: var(--color-rust, #ff6b35);
        }
        
        /* Dark theme support */
        :host-context(.theme-dark) .alert.info {
          background-color: oklch(0.25 0.03 240);
          color: oklch(0.85 0.05 240);
        }
        
        :host-context(.theme-dark) .alert.success {
          background-color: oklch(0.25 0.03 140);
          color: oklch(0.85 0.05 140);
        }
        
        :host-context(.theme-dark) .alert.warning {
          background-color: oklch(0.25 0.03 60);
          color: oklch(0.85 0.05 60);
        }
        
        :host-context(.theme-dark) .alert.error {
          background-color: oklch(0.25 0.03 20);
          color: oklch(0.85 0.05 20);
        }
      </style>
      
      <div class="alert ${this._variant}" role="alert">
        <span class="icon">${variantIcons[this._variant] || variantIcons.info}</span>
        <div class="content">
          <slot></slot>
        </div>
        ${this._dismissible ? '<button class="close-button" aria-label="Dismiss alert" tabindex="0">×</button>' : ''}
      </div>
    `;
  }
  
  _updateVariant() {
    const alert = this._shadowRoot.querySelector('.alert');
    const icon = this._shadowRoot.querySelector('.icon');
    
    const variantIcons = {
      info: '',
      success: '',
      warning: '',
      error: ''
    };
    
    if (alert) {
      alert.className = `alert ${this._variant}`;
    }
    if (icon) {
      icon.textContent = variantIcons[this._variant] || variantIcons.info;
    }
  }
  
  _updateDismissible() {
    // Re-render if dismissible state changes
    this._render();
    // Re-attach event listener
    if (this._dismissible) {
      this._closeButton = this._shadowRoot.querySelector('.close-button');
      if (this._closeButton) {
        this._closeButton.addEventListener('click', () => this._dismiss());
      }
    }
  }
  
  _updateVisibility() {
    if (!this._open) {
      this.setAttribute('open', 'false');
    } else {
      this.removeAttribute('open');
    }
  }
  
  _dismiss() {
    const alert = this._shadowRoot.querySelector('.alert');
    
    // Add dismissing animation
    alert.classList.add('dismissing');
    
    // Wait for animation to complete
    setTimeout(() => {
      this._open = false;
      this.setAttribute('open', 'false');
      
      // Dispatch custom event
      this.dispatchEvent(new CustomEvent('alert-dismissed', {
        detail: { variant: this._variant },
        bubbles: true,
        composed: true
      }));
    }, 300); // Match animation duration
  }
  
  // Public method to show the alert again
  show() {
    this._open = true;
    this.removeAttribute('open');
  }
  
  // Public method to dismiss programmatically
  dismiss() {
    this._dismiss();
  }
}

customElements.define('frmwrk-alert', FrmwrkAlert);


/**
 * Auto-initialize: Load saved theme on page load
 * This runs when the script loads, before any components are created
 */
(function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('theme-dark');
  }
})();