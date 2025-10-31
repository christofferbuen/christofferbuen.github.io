/**
 * Retro Terminal Glitch Effects
 * Creates random glitches that occur at least 30 seconds apart
 * 
 * Easy Configuration:
 *   window.glitchEffects.setConfig('intensity', 8);   // 1-10px shift (default: 5)
 *   window.glitchEffects.setConfig('opacity', 0.9);   // 0-1 (default: 0.9)
 *   window.glitchEffects.setConfig('brightness', 1.2); // 1-1.5 (default: 1.2)
 *   window.glitchEffects.setConfig('contrast', 1.2);   // 1-1.5 (default: 1.2)
 *   window.glitchEffects.setMinInterval(30000);       // 30 seconds
 *   window.glitchEffects.triggerGlitchNow();          // Force glitch now
 */

class TerminalGlitchEffects {
  constructor(config = {}) {
    this.lastGlitchTime = 0;
    this.minGlitchInterval = 60000; // 1 second for testing (was 30000)
    this.isGlitching = false;
    this.glitchDuration = 250; // Duration of each glitch in milliseconds
    this.intervalId = null; // Store interval ID for cleanup
    this.glitchLayers = []; // Store glitch layer elements
    
    // Configurable glitch settings
    this.config = {
      intensity: 20,           // How far colors shift (1-10px)
      opacity: 0.9,           // Opacity of color channels (0-1)
      brightness: 1.2,        // Brightness boost during glitch (1-1.5)
      contrast: 1.2,          // Contrast boost during glitch (1-1.5)
      ...config
    };
    
    this.init();
  }

  init() {
    // Start the glitch loop
    this.startGlitchLoop();
  }

  startGlitchLoop() {
    // Clear any existing interval first
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastGlitch = now - this.lastGlitchTime;

      // Only trigger glitch if enough time has passed
      if (timeSinceLastGlitch >= this.minGlitchInterval && !this.isGlitching) {
        // Random chance to glitch (30% chance each interval check)
        if (Math.random() < 0.3) {
          this.triggerGlitch();
          this.lastGlitchTime = now;
        }
      }
    }, 1000); // Check every 1 second
  }
  
  /**
   * Cleanup method to stop the glitch loop
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.removeGlitchLayers();
  }

  triggerGlitch() {
    this.isGlitching = true;
    
    // Always use chromatic aberration effect
    this.glitchChromaticAberration();

    setTimeout(() => {
      this.isGlitching = false;
    }, this.glitchDuration);
  }

  glitchChromaticAberration() {
    /**
     * CRT horizontal distortion glitch - like horizontal sync issues
     */
    const main = document.querySelector('.main');
    if (!main) return;

    // Create glitch overlay elements for horizontal displacement
    this.createGlitchLayers(main);
    
    // Add strong RGB separation with multiple color channels
    const originalTextShadow = main.style.textShadow;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const rgbIntensity = this.config.intensity;
    
    // Use pure RGB colors with higher opacity for visibility
    main.style.textShadow = `
      ${-rgbIntensity * direction}px 0 1px rgba(255, 0, 0, ${this.config.opacity}),
      ${-rgbIntensity * direction * 0.5}px 0 0 rgba(255, 50, 0, ${this.config.opacity * 0.6}),
      0 0 0 rgba(0, 255, 0, ${this.config.opacity * 0.4}),
      ${rgbIntensity * direction * 0.5}px 0 0 rgba(0, 200, 255, ${this.config.opacity * 0.6}),
      ${rgbIntensity * direction}px 0 1px rgba(0, 100, 255, ${this.config.opacity})
    `;

    // Reset after duration
    setTimeout(() => {
      this.removeGlitchLayers();
      main.style.textShadow = originalTextShadow;
    }, this.glitchDuration);
  }

  createGlitchLayers(main) {
    // Remove any existing glitch layers
    this.removeGlitchLayers();
    
    const numSlices = 5 + Math.floor(Math.random() * 5); // 5-10 horizontal slices
    const mainRect = main.getBoundingClientRect();
    this.glitchLayers = [];
    
    for (let i = 0; i < numSlices; i++) {
      const slice = main.cloneNode(true);
      slice.className = main.className + ' glitch-slice';
      slice.style.position = 'fixed';
      slice.style.top = mainRect.top + 'px';
      slice.style.left = mainRect.left + 'px';
      slice.style.width = mainRect.width + 'px';
      slice.style.height = mainRect.height + 'px';
      slice.style.pointerEvents = 'none';
      slice.style.zIndex = '9999';
      slice.style.overflow = 'hidden';
      
      // Create horizontal slice with clip-path
      const sliceHeight = 100 / numSlices;
      const yStart = i * sliceHeight;
      const yEnd = (i + 1) * sliceHeight;
      slice.style.clipPath = `polygon(0 ${yStart}%, 100% ${yStart}%, 100% ${yEnd}%, 0 ${yEnd}%)`;
      
      // Random horizontal displacement AND distortion
      const displacement = (Math.random() - 0.5) * this.config.intensity * 4;
      const scaleX = 0.95 + Math.random() * 0.1; // Horizontal stretch/compress (0.95 - 1.05)
      const skewX = (Math.random() - 0.5) * 3; // Horizontal skew (-1.5 to 1.5 degrees)
      
      slice.style.transform = `translateX(${displacement}px) scaleX(${scaleX}) skewX(${skewX}deg)`;
      slice.style.transformOrigin = 'left center';
      
      // Add RGB color tinting to different slices for chromatic aberration effect
      const tint = i % 3; // Cycle through R, G, B
      if (tint === 0) {
        // Red tint
        slice.style.filter = `brightness(${this.config.brightness}) contrast(${this.config.contrast}) 
                             sepia(0.3) hue-rotate(-10deg) saturate(1.5)`;
        slice.style.mixBlendMode = 'screen';
        slice.style.opacity = '0.8';
      } else if (tint === 1) {
        // Cyan/Blue tint  
        slice.style.filter = `brightness(${this.config.brightness}) contrast(${this.config.contrast})
                             sepia(0.3) hue-rotate(160deg) saturate(1.5)`;
        slice.style.mixBlendMode = 'screen';
        slice.style.opacity = '0.8';
      } else {
        // Green tint
        slice.style.filter = `brightness(${this.config.brightness}) contrast(${this.config.contrast})
                             sepia(0.2) hue-rotate(80deg) saturate(1.3)`;
        slice.style.mixBlendMode = 'screen';
        slice.style.opacity = '0.8';
      }
      
      document.body.appendChild(slice);
      this.glitchLayers.push(slice);
    }
  }

  removeGlitchLayers() {
    if (this.glitchLayers) {
      this.glitchLayers.forEach(layer => {
        if (layer.parentNode) {
          layer.parentNode.removeChild(layer);
        }
      });
      this.glitchLayers = [];
    }
  }

  setMinInterval(milliseconds) {
    /**
     * Change minimum glitch interval
     * Usage: glitchEffects.setMinInterval(60000); // 60 seconds
     */
    this.minGlitchInterval = milliseconds;
  }

  setGlitchDuration(milliseconds) {
    /**
     * Change how long each glitch lasts
     * Usage: glitchEffects.setGlitchDuration(200); // 200ms
     */
    this.glitchDuration = milliseconds;
  }

  triggerGlitchNow() {
    /**
     * Force a glitch to occur immediately
     */
    if (!this.isGlitching) {
      this.lastGlitchTime = Date.now() - this.minGlitchInterval;
      this.triggerGlitch();
    }
  }

  setConfig(key, value) {
    /**
     * Update glitch configuration
     * Usage: glitchEffects.setConfig('intensity', 8);
     */
    if (key in this.config) {
      this.config[key] = value;
    }
  }

  getConfig() {
    /**
     * Get current configuration
     * Usage: glitchEffects.getConfig();
     */
    return { ...this.config };
  }
}

// Make it globally available
window.TerminalGlitchEffects = TerminalGlitchEffects;

// Auto-initialize glitch effects
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.glitchEffects = new TerminalGlitchEffects();
  });
} else {
  window.glitchEffects = new TerminalGlitchEffects();
}