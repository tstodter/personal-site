import { startGlitchAnimation } from './glitch-animation.js';
import './nav-brace.js';

// Prevent multiple initializations
let isInitialized = false;

// Start the glitch animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
  if (!isInitialized) {
    startGlitchAnimation();
    isInitialized = true;
  }
});