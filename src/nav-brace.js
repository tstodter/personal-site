// Nav Brace Web Component
class NavBrace extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.clickTimeout = null;
  }

  connectedCallback() {
    const label = this.getAttribute('label') || '';
    const anchorId = this.getAttribute('anchor-id') || `nav-anchor-${Math.random().toString(36).substr(2, 9)}`;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
        }
        
        .nav-items {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          anchor-name: --${anchorId};
        }
        
        .brace-container {
          position: fixed;
          left: anchor(--${anchorId} right, 0px);
          top: anchor(--${anchorId} center, 50%);
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 0.0rem;
        }
        
        .brace {
          width: auto;
          height: calc(var(--font-size-nav) * 2 + 0.5rem); /* Height of 2 nav items + gap */
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .brace img {
          width: auto;
          height: 125%;
          filter: brightness(0) saturate(100%); /* Makes SVG black */
        }
        
        .group-label {
          position: fixed;
          left: anchor(--${anchorId} right, 0px);
          top: anchor(--${anchorId} center, 50%);
          transform: translateY(-50%);
          margin-left: 2rem;
          font-size: 1.2rem;
          color: #666;
          letter-spacing: 0.05em;
          white-space: nowrap;
          transition: opacity 0.3s ease;
        }
        
        /* Tooltip styles */
        .tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          background: #2c2c2c;
          color: #faf9f7;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.9rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1000;
        }
        
        .tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #2c2c2c;
        }
        
        /* Opalescent circle for mobile */
        .opal-circle {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: linear-gradient(135deg, 
            rgba(255, 182, 193, 0.8), 
            rgba(173, 216, 230, 0.8), 
            rgba(221, 160, 221, 0.8), 
            rgba(255, 215, 0, 0.8), 
            rgba(152, 251, 152, 0.8)
          );
          position: relative;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .opal-circle::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255, 255, 255, 0.8) 50%,
            transparent 70%
          );
          transform: rotate(45deg);
          animation: opalShine 2s infinite linear;
        }
        
        @keyframes opalShine {
          0% { transform: rotate(45deg) translateX(-100%); }
          100% { transform: rotate(45deg) translateX(100%); }
        }
        
        .nav-container {
          position: relative;
        }
        
        .nav-items,
        .group-label {
          transition: opacity 0.4s ease;
        }
        
        
        /* Mobile: show brace + opal circle, enable crossfade */
        @media (max-width: 480px) {
          .group-label {
            left: auto;
            right: anchor(--${anchorId} right, 0px);
            top: anchor(--${anchorId} center, 50%);
            transform: translateY(-50%);
            margin-left: 0;
            opacity: 0;
            pointer-events: none;
          }
          
          .opal-circle {
            display: block;
          }
          
          .tooltip {
            display: none;
          }
          
          /* Expand brace-container touch area */
          .brace-container {
            padding-right: 1rem;
          }
          
          /* Click-based crossfade */
          :host(.opal-clicked) .nav-items {
            opacity: 0;
          }
          
          :host(.opal-clicked) .group-label {
            opacity: 1;
          }
          
          :host(.opal-clicked) .opal-circle {
            opacity: 0.8;
          }
        }
        
        /* Desktop: show brace and label, hide circle */
        @media (min-width: 481px) {
          .opal-circle {
            display: none;
          }
          
          .tooltip {
            display: none;
          }
        }
        
        /* Fallback for browsers without anchor positioning */
        @supports not (anchor-name: --test) {
          .brace-container {
            position: absolute;
            right: -4rem;
            top: 50%;
            left: auto;
          }
          
          .group-label {
            position: absolute;
            right: -6rem;
            top: 50%;
            left: auto;
            margin-left: 0;
          }
          
          @media (max-width: 768px) {
            .group-label {
              right: 0;
              top: 50%;
              margin-left: 0;
            }
          }
        }
      </style>
      <div class="nav-container">
        <div class="nav-items">
          <slot></slot>
        </div>
        ${label ? `<div class="group-label">${label}</div>` : ''}
      </div>
      <div class="brace-container" tabindex="0">
        <div class="brace">
          <img src="images/curly_brace.svg" alt="Curly brace" />
          ${label ? `<div class="tooltip">${label}</div>` : ''}
        </div>
        <div class="opal-circle" tabindex="0"></div>
      </div>
    `;
    
    // Add click event listener to opal circle
    const opalCircle = this.shadowRoot.querySelector('.opal-circle');
    if (opalCircle) {
      opalCircle.addEventListener('click', () => {
        this.handleOpalClick();
      });
    }
  }
  
  handleOpalClick() {
    // Check if already in clicked state - if so, revert early
    if (this.shadowRoot.host.classList.contains('opal-clicked')) {
      // Clear timeout and revert immediately
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
      }
      this.shadowRoot.host.classList.remove('opal-clicked');
      return;
    }
    
    // Clear any existing timeout
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
    
    // Add the clicked state
    this.shadowRoot.host.classList.add('opal-clicked');
    
    // Set timeout to remove the state after 1 second
    this.clickTimeout = setTimeout(() => {
      this.shadowRoot.host.classList.remove('opal-clicked');
      this.clickTimeout = null;
    }, 1000);
  }
}

customElements.define('nav-brace', NavBrace);