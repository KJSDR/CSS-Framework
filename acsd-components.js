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
          <span class="icon">☀️</span>
          <span class="label">Toggle Theme</span>
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
      const icon = this._shadowRoot.querySelector('.icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
      }
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
   * Auto-initialize: Load saved theme on page load
   * This runs when the script loads, before any components are created
   */
  (function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    }
  })();