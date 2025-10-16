/**
 * CRT Effects Configuration and Control System
 * Manages toggleable effects: scanlines, sweep, flicker, chroma
 */

class CRTEffects {
  constructor(config = {}) {
    this.config = {
      scanlines: true,
      sweep: true,
      flicker: true,
      chroma: true,
      flickerIntensity: 0.05, // Default intensity (0-0.2 range)
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
        this.config = { ...this.config, ...JSON.parse(saved) };
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

    // Chroma is applied via animation, so we toggle animation
    const main = document.querySelector('.main');
    if (main) {
      if (this.config.chroma) {
        main.style.animation = '';
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
    const controls = document.createElement('div');
    controls.id = 'crt-controls';
    controls.className = 'crt-controls';
    controls.setAttribute('role', 'region');
    controls.setAttribute('aria-label', 'CRT Effect Controls');

    // Settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'crt-settings-btn';
    settingsBtn.setAttribute('aria-label', 'Open system settings');
    settingsBtn.textContent = '⚙';
    settingsBtn.addEventListener('click', () => {
      if (window.settingsModal) {
        window.settingsModal.open();
      }
    });

    const button = document.createElement('button');
    button.id = 'crt-toggle-btn';
    button.className = 'crt-toggle-btn';
    button.setAttribute('aria-label', 'Toggle CRT effect controls');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = '⚙️';

    const panel = document.createElement('div');
    panel.className = 'crt-panel';
    panel.setAttribute('hidden', '');

    const effects = ['scanlines', 'sweep', 'flicker', 'chroma'];
    effects.forEach((effect) => {
      const label = document.createElement('label');
      label.className = 'crt-control';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = this.config[effect];
      checkbox.dataset.effect = effect;
      checkbox.setAttribute('aria-label', `Toggle ${effect} effect`);

      checkbox.addEventListener('change', (e) => {
        this.setEffect(effect, e.target.checked);
        this.updateButtonState(button, panel);
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${effect}`));
      panel.appendChild(label);
    });

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        panel.setAttribute('hidden', '');
      } else {
        panel.removeAttribute('hidden');
      }
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!controls.contains(e.target)) {
        button.setAttribute('aria-expanded', 'false');
        panel.setAttribute('hidden', '');
      }
    });

    controls.appendChild(settingsBtn);
    controls.appendChild(button);
    controls.appendChild(panel);
    document.body.appendChild(controls);
  }

  updateButtonState(button, panel) {
    const allEnabled = Object.values(this.config).every((v) => v);
    button.classList.toggle('all-enabled', allEnabled);
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CRTEffects();
  });
} else {
  new CRTEffects();
}
