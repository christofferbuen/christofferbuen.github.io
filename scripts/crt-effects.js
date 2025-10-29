/**
 * CRT Effects Configuration and Control System
 * Manages authentic CRT monitor visual effects including scanlines, sweep, flicker, and chroma aberration
 * Provides real-time toggles and customization with localStorage persistence
 * 
 * @class CRTEffects
 */
class CRTEffects {
  /**
   * Creates a new CRTEffects instance
   * @param {Object} config - Configuration overrides for CRT effects
   */
  constructor(config = {}) {
    // Define defaults
    const defaults = {
      scanlines: true,
      sweep: true,
      flicker: true,
      chroma: true,
      scanlineDarkness: 0.25,
      sweepSpeed: 7.77,
      flickerIntensity: 0.05,
      flickerSpeed: 1.2,
      chromaIntensity: 1,
      grilleRed: 0.06,
      grilleGreen: 0.02,
      grilleBlue: 0.06,
    };

    this.defaults = defaults;
    this.config = {
      ...defaults,
      ...config,
    };

    this.root = document.documentElement;
    this.storageKey = 'crt-effects-config';
    this.init();
  }

  init() {
    this.loadConfig();
    this.applyConfig();
    this.createControls();
  }

  loadConfig() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.config = { ...this.defaults, ...JSON.parse(saved) };
      } catch (e) {
        console.warn('Failed to load CRT config from localStorage:', e);
      }
    }
  }

  saveConfig() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.config));
  }

  applyConfig() {
    this.root.style.setProperty('--scanlines-enabled', this.config.scanlines ? '1' : '0');
    this.root.style.setProperty('--sweep-enabled', this.config.sweep ? '1' : '0');
    this.root.style.setProperty('--flicker-enabled', this.config.flicker ? '1' : '0');
    this.root.style.setProperty('--flicker-intensity', this.config.flickerIntensity);
    this.root.style.setProperty('--scanline-dark', this.config.scanlineDarkness);
    this.root.style.setProperty('--sweep-period', this.config.sweepSpeed + 's');
    this.root.style.setProperty('--flicker-period', this.config.flickerSpeed + 's');
    this.root.style.setProperty('--grille-r', this.config.grilleRed);
    this.root.style.setProperty('--grille-g', this.config.grilleGreen);
    this.root.style.setProperty('--grille-b', this.config.grilleBlue);

    // Chroma is applied via animation, so we toggle animation and opacity
    const main = document.querySelector('.main');
    if (main) {
      if (this.config.chroma) {
        main.style.animation = '';
        main.style.opacity = 1 - (this.config.chromaIntensity * 0.1);
      } else {
        main.style.animation = 'none';
      }
    }
  }

  toggle(effect) {
    if (effect in this.config) {
      this.config[effect] = !this.config[effect];
      this.saveConfig();
      this.applyConfig();
      return this.config[effect];
    }
  }

  setEffect(effect, enabled) {
    if (effect in this.config) {
      this.config[effect] = enabled;
      this.saveConfig();
      this.applyConfig();
    }
  }

  createControls() {
    const self = this;
    const controls = document.createElement('div');
    controls.id = 'crt-controls';
    controls.className = 'crt-controls';
    controls.setAttribute('role', 'region');
    controls.setAttribute('aria-label', 'CRT Effect Controls');

    // Settings button (for main settings modal)
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'crt-settings-btn';
    settingsBtn.setAttribute('aria-label', 'Open system settings');
    settingsBtn.textContent = '⚙';
    settingsBtn.addEventListener('click', () => {
      if (window.settingsModal) {
        window.settingsModal.open();
      }
    });

    // CRT Tuner button
    const crtTunerBtn = document.createElement('button');
    crtTunerBtn.id = 'crt-tuner-btn';
    crtTunerBtn.className = 'crt-tuner-btn';
    crtTunerBtn.setAttribute('aria-label', 'Open CRT effects tuner');
    crtTunerBtn.setAttribute('aria-expanded', 'false');
    crtTunerBtn.textContent = '📺';
    crtTunerBtn.title = 'CRT Effects Tuner';

    // Create tuner panel
    const panel = document.createElement('div');
    panel.className = 'crt-tuner-panel';
    panel.setAttribute('hidden', '');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'CRT Effects Tuner');

    const panelHeader = document.createElement('div');
    panelHeader.className = 'crt-tuner-header';
    panelHeader.innerHTML = '<span>CRT EFFECTS TUNER</span>';

    const panelContent = document.createElement('div');
    panelContent.className = 'crt-tuner-content';

    // Helper to create sliders
    const createSlider = (label, configKey, min, max, step, suffix = '') => {
      const div = document.createElement('div');
      div.className = 'crt-tuner-row crt-tuner-slider-row';
      const value = this.config[configKey];
      div.innerHTML = `
        <label>${label}:</label>
        <div class="crt-tuner-slider-container">
          <input type="range" class="crt-tuner-slider" min="${min}" max="${max}" step="${step}" value="${value}" />
          <span class="crt-tuner-value">${value.toFixed(2)}${suffix}</span>
        </div>
      `;
      const slider = div.querySelector('input');
      const valueDisplay = div.querySelector('.crt-tuner-value');
      
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        self.config[configKey] = val;
        self.saveConfig();
        self.applyConfig();
        valueDisplay.textContent = val.toFixed(2) + suffix;
      });
      
      return { div, slider, valueDisplay };
    };

    // Helper to create toggles
    const createToggle = (label, configKey) => {
      const div = document.createElement('div');
      div.className = 'crt-tuner-row';
      div.innerHTML = `
        <label>
          <input type="checkbox" class="crt-tuner-toggle" data-effect="${configKey}" />
          <span>${label}</span>
        </label>
      `;
      const checkbox = div.querySelector('input');
      checkbox.checked = this.config[configKey];
      checkbox.addEventListener('change', (e) => {
        self.config[configKey] = e.target.checked;
        self.saveConfig();
        self.applyConfig();
      });
      
      return { div, checkbox };
    };

    // Store references for reset button
    const sliders = {};
    const toggles = {};

    // === SCANLINES SECTION ===
    const scanTog = createToggle('Scanlines', 'scanlines');
    toggles.scanlines = scanTog.checkbox;
    panelContent.appendChild(scanTog.div);

    const scanDark = createSlider('Scanline Darkness', 'scanlineDarkness', 0, 1, 0.01);
    sliders.scanlineDarkness = scanDark.slider;
    panelContent.appendChild(scanDark.div);

    // === SWEEP SECTION ===
    const sweepTog = createToggle('Sweep Bar', 'sweep');
    toggles.sweep = sweepTog.checkbox;
    panelContent.appendChild(sweepTog.div);

    const sweepSpd = createSlider('Sweep Speed', 'sweepSpeed', 2, 15, 0.1, 's');
    sliders.sweepSpeed = sweepSpd.slider;
    panelContent.appendChild(sweepSpd.div);

    // === FLICKER SECTION ===
    const flickTog = createToggle('Flicker', 'flicker');
    toggles.flicker = flickTog.checkbox;
    panelContent.appendChild(flickTog.div);

    const flickInt = createSlider('Flicker Intensity', 'flickerIntensity', 0, 0.3, 0.01);
    sliders.flickerIntensity = flickInt.slider;
    panelContent.appendChild(flickInt.div);

    const flickSpd = createSlider('Flicker Speed', 'flickerSpeed', 0.5, 3, 0.1, 's');
    sliders.flickerSpeed = flickSpd.slider;
    panelContent.appendChild(flickSpd.div);

    // === CHROMA SECTION ===
    const chromaTog = createToggle('Chromatic Aberration', 'chroma');
    toggles.chroma = chromaTog.checkbox;
    panelContent.appendChild(chromaTog.div);

    const chromaInt = createSlider('Chroma Intensity', 'chromaIntensity', 0, 1, 0.01);
    sliders.chromaIntensity = chromaInt.slider;
    panelContent.appendChild(chromaInt.div);

    // === RGB GRILLE SECTION ===
    const grilleRed = createSlider('Grille Red', 'grilleRed', 0, 0.2, 0.01);
    sliders.grilleRed = grilleRed.slider;
    panelContent.appendChild(grilleRed.div);

    const grilleGreen = createSlider('Grille Green', 'grilleGreen', 0, 0.2, 0.01);
    sliders.grilleGreen = grilleGreen.slider;
    panelContent.appendChild(grilleGreen.div);

    const grilleBlue = createSlider('Grille Blue', 'grilleBlue', 0, 0.2, 0.01);
    sliders.grilleBlue = grilleBlue.slider;
    panelContent.appendChild(grilleBlue.div);

    // === BUTTON GROUP ===
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'crt-tuner-button-group';

    // Restore button
    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'crt-tuner-restore-btn';
    restoreBtn.textContent = 'Restore Defaults';
    restoreBtn.addEventListener('click', () => {
      self.config = { ...self.defaults };
      self.saveConfig();
      self.applyConfig();
      
      // Update all UI elements
      Object.entries(toggles).forEach(([key, checkbox]) => {
        checkbox.checked = self.defaults[key];
      });
      Object.entries(sliders).forEach(([key, slider]) => {
        const value = self.defaults[key];
        slider.value = value;
        const valueDisplay = slider.parentElement.nextElementSibling;
        if (valueDisplay) {
          const suffix = slider.parentElement.parentElement.querySelector('label').textContent.includes('Speed') ? 's' : '';
          valueDisplay.textContent = value.toFixed(2) + suffix;
        }
      });
    });
    buttonGroup.appendChild(restoreBtn);

    panelContent.appendChild(buttonGroup);

    panel.appendChild(panelHeader);
    panel.appendChild(panelContent);

    // Toggle panel visibility
    crtTunerBtn.addEventListener('click', () => {
      const isExpanded = crtTunerBtn.getAttribute('aria-expanded') === 'true';
      crtTunerBtn.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        panel.setAttribute('hidden', '');
      } else {
        panel.removeAttribute('hidden');
      }
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!controls.contains(e.target)) {
        crtTunerBtn.setAttribute('aria-expanded', 'false');
        panel.setAttribute('hidden', '');
      }
    });

    controls.appendChild(settingsBtn);
    controls.appendChild(crtTunerBtn);
    controls.appendChild(panel);
    document.body.appendChild(controls);
    
    // Store panel reference for external access (terminal commands)
    this.tunerPanel = panel;
    this.tunerButton = crtTunerBtn;
  }
}

// Initialize on DOM ready and expose globally
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.crtEffects = new CRTEffects();
  });
} else {
  window.crtEffects = new CRTEffects();
}
