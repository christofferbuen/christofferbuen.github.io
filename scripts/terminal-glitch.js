/**
 * Retro Terminal Glitch Effects
 * Creates random glitches that occur at least 30 seconds apart
 */

class TerminalGlitchEffects {
  constructor() {
    this.lastGlitchTime = 0;
    this.minGlitchInterval = 30000; // 30 seconds in milliseconds
    this.isGlitching = false;
    this.glitchDuration = 150; // Duration of each glitch in milliseconds
    this.init();
  }

  init() {
    // Start the glitch loop
    this.startGlitchLoop();
  }

  startGlitchLoop() {
    setInterval(() => {
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

  triggerGlitch() {
    this.isGlitching = true;
    const glitchType = Math.floor(Math.random() * 3);

    switch (glitchType) {
      case 0:
        this.glitchScan();
        break;
      case 1:
        this.glitchFlip();
        break;
      case 2:
        this.glitchShift();
        break;
    }

    setTimeout(() => {
      this.isGlitching = false;
    }, this.glitchDuration);
  }

  glitchScan() {
    /**
     * Glitch type 1: Horizontal scan line distortion
     */
    const overlay = document.querySelector('.crt-overlay.sweep');
    if (!overlay) return;

    const originalOpacity = overlay.style.opacity;
    const originalHeight = overlay.style.height;

    overlay.style.opacity = '0.8';
    overlay.style.height = Math.random() > 0.5 ? '8px' : '4px';

    setTimeout(() => {
      overlay.style.opacity = originalOpacity;
      overlay.style.height = originalHeight;
    }, this.glitchDuration);
  }

  glitchFlip() {
    /**
     * Glitch type 2: Color inversion
     */
    const main = document.querySelector('.main');
    if (!main) return;

    const originalFilter = main.style.filter;
    main.style.filter = 'invert(1)';

    setTimeout(() => {
      main.style.filter = originalFilter;
    }, this.glitchDuration);
  }

  glitchShift() {
    /**
     * Glitch type 3: Chromatic aberration shift
     */
    const main = document.querySelector('.main');
    if (!main) return;

    const shiftAmount = Math.random() > 0.5 ? '2px' : '-2px';
    const originalTransform = main.style.transform;

    main.style.transform = `translateX(${shiftAmount})`;

    setTimeout(() => {
      main.style.transform = originalTransform;
    }, this.glitchDuration);
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
}

// Make it globally available
window.TerminalGlitchEffects = TerminalGlitchEffects;

// Auto-initialize glitch effects
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.glitchEffects = new TerminalGlitchEffects();
    console.log('Glitch effects initialized');
  });
} else {
  window.glitchEffects = new TerminalGlitchEffects();
  console.log('Glitch effects initialized');
}