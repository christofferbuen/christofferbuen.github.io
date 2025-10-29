/**
 * Settings Modal Controller
 * Comprehensive settings interface for terminal customization including
 * CRT effects, sound, color schemes, and other preferences
 * 
 * @class SettingsModal
 */
class SettingsModal {
  /**
   * Creates a new SettingsModal instance
   */
  constructor() {
    this.modalElement = null;
    this.backdropElement = null;
    this.init();
  }

  init() {
    this.createModalHTML();
    this.attachEventListeners();
    this.loadSettings();
  }

  createModalHTML() {
    // Create backdrop
    this.backdropElement = document.createElement('div');
    this.backdropElement.className = 'settings-modal-backdrop';
    this.backdropElement.addEventListener('click', (e) => {
      if (e.target === this.backdropElement) {
        this.close();
      }
    });
    document.body.appendChild(this.backdropElement);

    // Create modal
    this.modalElement = document.createElement('div');
    this.modalElement.className = 'settings-modal';
    this.modalElement.innerHTML = `
      <div class="settings-modal-header">
        <h2>⚙ SYSTEM SETTINGS</h2>
        <button class="settings-modal-close" aria-label="Close settings">✕</button>
      </div>
      <div class="settings-modal-content">
        
        <!-- COLOR & THEME SECTION -->
        <div class="settings-section">
          <div class="settings-section-title">Visual Theme</div>
          <div class="settings-row">
            <div class="settings-label">
              <span class="settings-label-main">Color Scheme</span>
              <span class="settings-label-description">Choose your retro aesthetic</span>
            </div>
          </div>
          <div class="theme-grid" id="theme-grid"></div>
        </div>



        <!-- TERMINAL SETTINGS SECTION -->
        <div class="settings-section">
          <div class="settings-section-title">Terminal</div>
          
          <div class="settings-row">
            <div class="settings-label">
              <span class="settings-label-main">Keyboard Sounds</span>
              <span class="settings-label-description">Enable audio feedback</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="setting-sounds" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="settings-row">
            <div class="settings-label">
              <span class="settings-label-main">Glitch Effects</span>
              <span class="settings-label-description">Random visual glitches</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="setting-glitches" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="settings-row">
            <div class="settings-label">
              <span class="settings-label-main">Cursor Blink</span>
              <span class="settings-label-description">Animated blinking cursor</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="setting-cursor-blink" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- MATRIX RAIN SECTION -->
        <div class="settings-section">
          <div class="settings-section-title">Matrix Rain Effect</div>
          
          <div class="settings-row">
            <div class="settings-label">
              <span class="settings-label-main">Font Size</span>
              <span class="settings-label-description">Size of falling characters</span>
            </div>
            <div class="settings-slider-control">
              <input type="range" class="settings-slider" id="setting-matrix-fontsize" min="10" max="24" step="1" value="14" />
              <span class="settings-slider-value" id="matrix-fontsize-value">14px</span>
            </div>
          </div>
        </div>

        <!-- INFORMATION SECTION -->
        <div class="settings-section">
          <div class="settings-section-title">System Information</div>
          
          <div class="settings-row">
            <div class="settings-label">
              <span class="settings-label-main">Terminal Version</span>
              <span class="settings-label-description">Retro Terminal UI</span>
            </div>
            <span style="font-size: 12px; opacity: 0.7;">v1.0.0</span>
          </div>

          <div class="settings-row">
            <div class="settings-label">
              <span class="settings-label-main">Current Theme</span>
            </div>
            <span style="font-size: 12px; font-weight: bold;" id="current-theme-display">---</span>
          </div>

          <div class="settings-row">
            <div class="settings-label">
              <span class="settings-label-main">Storage Used</span>
              <span class="settings-label-description">localStorage for preferences</span>
            </div>
            <span style="font-size: 12px;" id="storage-info">---</span>
          </div>
        </div>

        <!-- MAINTENANCE SECTION -->
        <div class="settings-section">
          <div class="settings-section-title">Maintenance</div>
          
          <div class="settings-row">
            <div class="settings-label">
              <span class="settings-label-main">Wipe System</span>
              <span class="settings-label-description">Reset filesystem to default state</span>
            </div>
          </div>
          <button class="settings-btn danger" id="settings-wipe" style="width: 100%; margin-top: 8px;">Wipe & Reset Filesystem</button>
        </div>

        <!-- ACTIONS SECTION -->
        <div class="settings-button-group">
          <button class="settings-btn primary" id="settings-apply">Apply Changes</button>
          <button class="settings-btn danger" id="settings-reset">Reset to Default</button>
        </div>

      </div>
    `;
    this.backdropElement.appendChild(this.modalElement);

    // Attach close button
    this.modalElement.querySelector('.settings-modal-close').addEventListener('click', () => {
      this.close();
    });

    // Attach action buttons
    document.getElementById('settings-apply').addEventListener('click', () => this.applyChanges());
    document.getElementById('settings-reset').addEventListener('click', () => this.resetToDefaults());
    document.getElementById('settings-wipe').addEventListener('click', () => this.wipeFilesystem());
  }

  attachEventListeners() {
    // Listen for changes
    document.addEventListener('change', (e) => {
      if (e.target.id.startsWith('setting-')) {
        this.updateSetting(e.target);
      }
    });

    // Flicker intensity slider
    const flickerSlider = document.getElementById('setting-flicker-intensity');
    if (flickerSlider) {
      flickerSlider.addEventListener('input', (e) => {
        document.getElementById('flicker-intensity-display').textContent = e.target.value;
      });
    }

    // Matrix font size slider
    const matrixFontSlider = document.getElementById('setting-matrix-fontsize');
    if (matrixFontSlider) {
      matrixFontSlider.addEventListener('input', (e) => {
        document.getElementById('matrix-fontsize-value').textContent = e.target.value + 'px';
        this.updateSetting(e.target);
      });
    }
  }

  loadSettings() {
    // Load theme grid
    this.renderThemeGrid();

    // Load terminal settings from localStorage
    document.getElementById('setting-sounds').checked = localStorage.getItem('terminal-sounds') !== 'false';
    document.getElementById('setting-glitches').checked = localStorage.getItem('terminal-glitches') !== 'false';
    document.getElementById('setting-cursor-blink').checked = localStorage.getItem('terminal-cursor-blink') !== 'false';

    // Load matrix settings
    const matrixFontSize = localStorage.getItem('matrix-fontsize') || '14';
    const matrixSlider = document.getElementById('setting-matrix-fontsize');
    if (matrixSlider) {
      matrixSlider.value = matrixFontSize;
      document.getElementById('matrix-fontsize-value').textContent = matrixFontSize + 'px';
    }

    // Update display info
    this.updateDisplayInfo();
  }

  renderThemeGrid() {
    if (!window.colorSchemes) {
      console.warn('Color schemes not initialized');
      return;
    }

    const themeGrid = document.getElementById('theme-grid');
    const schemes = window.colorSchemes.getAllSchemes();
    const currentScheme = window.colorSchemes.currentScheme;

    themeGrid.innerHTML = '';

    schemes.forEach((scheme) => {
      const schemeData = window.colorSchemes.getScheme(scheme.id);
      const colors = schemeData.colors;

      const label = document.createElement('label');
      label.className = `theme-option ${scheme.id === currentScheme ? 'active' : ''}`;
      label.innerHTML = `
        <input type="radio" name="theme" value="${scheme.id}" ${scheme.id === currentScheme ? 'checked' : ''} />
        <div class="theme-preview" style="background: ${colors.bg}; color: ${colors.fg}; border: 1px solid ${colors.accent};">
          <span>${scheme.name}</span>
        </div>
      `;

      label.addEventListener('change', (e) => {
        if (e.target.checked) {
          window.colorSchemes.setScheme(scheme.id);
          this.updateThemeGrid();
        }
      });

      themeGrid.appendChild(label);
    });
  }

  updateThemeGrid() {
    const themeGrid = document.getElementById('theme-grid');
    const currentScheme = window.colorSchemes.currentScheme;

    document.querySelectorAll('.theme-option').forEach((option) => {
      const input = option.querySelector('input');
      if (input.value === currentScheme) {
        option.classList.add('active');
        input.checked = true;
      } else {
        option.classList.remove('active');
        input.checked = false;
      }
    });

    this.updateDisplayInfo();
  }

  updateSetting(element) {
    const id = element.id;
    const value = element.type === 'checkbox' ? element.checked : element.value;

    switch (id) {
      case 'setting-sounds':
        localStorage.setItem('terminal-sounds', value);
        break;
      case 'setting-glitches':
        localStorage.setItem('terminal-glitches', value);
        if (window.terminalGlitch) {
          window.terminalGlitch.enabled = value;
        }
        break;
      case 'setting-cursor-blink':
        localStorage.setItem('terminal-cursor-blink', value);
        break;
      case 'setting-matrix-fontsize':
        localStorage.setItem('matrix-fontsize', value);
        if (window.matrixRain) {
          window.matrixRain.setFontSize(parseInt(value));
        }
        break;
    }
  }

  updateDisplayInfo() {
    // Update current theme display
    if (window.colorSchemes) {
      const currentScheme = window.colorSchemes.getScheme(window.colorSchemes.currentScheme);
      document.getElementById('current-theme-display').textContent = currentScheme.name;
    }

    // Update storage info
    let storageSize = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        storageSize += localStorage[key].length + key.length;
      }
    }
    const storageSizeKB = (storageSize / 1024).toFixed(2);
    document.getElementById('storage-info').textContent = `${storageSizeKB} KB`;
  }

  applyChanges() {
    // All changes are applied in real-time, just show feedback
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 24px;
      background: rgba(0, 255, 153, 0.2);
      border: 1px solid var(--accent);
      color: var(--fg);
      padding: 12px 16px;
      border-radius: 2px;
      font-family: monospace;
      font-size: 12px;
      z-index: 300;
      animation: slideUp 0.3s ease;
    `;
    feedback.textContent = '✓ Settings applied successfully';
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.animation = 'fadeOut 0.3s ease';
      feedback.style.opacity = '0';
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }

  resetToDefaults() {
    if (confirm('Reset all settings to default? This cannot be undone.')) {
      // Reset color scheme
      if (window.colorSchemes) {
        window.colorSchemes.setScheme('oldschool');
      }

      // Reset terminal settings
      localStorage.setItem('terminal-sounds', 'true');
      localStorage.setItem('terminal-glitches', 'true');
      localStorage.setItem('terminal-cursor-blink', 'true');

      // Reload settings display
      this.loadSettings();

      // Show feedback
      const feedback = document.createElement('div');
      feedback.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 24px;
        background: rgba(255, 107, 107, 0.2);
        border: 1px solid #ff6b6b;
        color: #ff6b6b;
        padding: 12px 16px;
        border-radius: 2px;
        font-family: monospace;
        font-size: 12px;
        z-index: 300;
        animation: slideUp 0.3s ease;
      `;
      feedback.textContent = '↻ Settings reset to defaults';
      document.body.appendChild(feedback);

      setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.3s ease';
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 300);
      }, 2000);
    }
  }

  wipeFilesystem() {
    if (confirm('WARNING: This will delete ALL files and reset the filesystem to its default state. This cannot be undone. Continue?')) {
      this.close();
      
      // Show the destructive animation in terminal with custom config
      this.showDestructiveAnimation(this.getWipeAnimationConfig());
    }
  }

  getWipeAnimationConfig() {
    /**
     * Configuration for the wipe animation
     * Customize timing, effects, and styling here
     */
    return {
      // Timing (in milliseconds)
      glitchDuration: 1200,           // How long the initial screen glitch lasts
      glitchInterval: 50,             // How often to update glitch effect
      commandDelay: 200,              // Delay before command line appears
      lineDelay: 80,                  // Delay between each message line
      progressBarSteps: 8,            // Number of progress bar updates
      progressBarDelay: 150,          // Delay between progress updates
      finalDelay: 500,                // Delay before showing final prompt
      
      // Visual effects
      glitchIntensity: 0.8,           // 0-1, how intense the glitch is
      colorGlitch: true,              // Enable hue/saturation shifts during glitch
      enableCascadeAnimation: true,   // Animate each line appearing
      
      // Messages configuration
      messages: {
        warning: '⚠ WARNING: Deleting entire filesystem...',
        wipePaths: [
          'Removing: /root',
          'Removing: /home',
          'Removing: /etc',
          'Removing: /var',
          'Removing: /tmp',
          'Removing: /usr',
          'Removing: /bin',
          'Removing: /lib',
          'Removing: /boot',
          'Removing: /dev',
          'Removing: /sys',
          'Removing: /proc',
          'Removing: /opt',
          'Removing: /srv',
          'Removing: /mnt',
          'Removing: /media',
          'Removing: /run'
        ],
        inProgress: '💥 SYSTEM WIPE IN PROGRESS...',
        erasing: '⏳ Erasing all traces...',
        successMessages: [
          '✓ Filesystem successfully wiped',
          '✓ All data removed',
          '✓ System reset to defaults'
        ],
        welcome: '> Welcome back to a fresh system!'
      },
      
      // Styling configuration
      styles: {
        command: 'color: #ff6b6b; font-weight: bold; text-shadow: 0 0 10px #ff6b6b;',
        warning: 'color: #ff6b6b; font-weight: bold; text-shadow: 0 0 15px #ff6b6b;',
        progress: 'color: #00ff99; font-family: monospace; letter-spacing: 2px; font-weight: bold;',
        removing: 'color: #ffaa00; opacity: 0.8; font-size: 12px;',
        success: 'color: #00ff99; font-weight: bold; text-shadow: 0 0 8px #00ff99;',
        welcome: 'color: var(--accent); font-weight: bold; text-shadow: 0 0 8px var(--accent); margin-top: 8px;'
      }
    };
  }

  showDestructiveAnimation(config) {
    /**
     * Show a configurable rm -rf / animation in the terminal with glitch effects
     * @param {Object} config - Animation configuration from getWipeAnimationConfig()
     */
    if (!window.retroTerminal) return;

    const terminal = window.retroTerminal;
    
    // STEP 1: Clear the terminal screen
    terminal.outputElement.innerHTML = '';
    terminal.currentLine = '';
    
    // Save original background
    const originalBg = terminal.outputElement.style.backgroundColor;
    
    // Show the dangerous command first with typing effect
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line completed';
    cmdLine.style.cssText = config.styles.command;
    
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = terminal.getPrompt();
    
    const cmdSpan = document.createElement('span');
    cmdSpan.className = 'command';
    cmdSpan.textContent = 'rm -rf /';
    
    cmdLine.appendChild(promptSpan);
    cmdLine.appendChild(cmdSpan);
    terminal.outputElement.appendChild(cmdLine);
    terminal.outputElement.scrollTop = terminal.outputElement.scrollHeight;

    // STEP 3: Build animation sequence
    let animationQueue = [];
    
    // Add empty line
    animationQueue.push({ type: 'empty' });
    
    // Add warning
    animationQueue.push({ 
      type: 'warning', 
      text: config.messages.warning 
    });
    
    // Add empty line
    animationQueue.push({ type: 'empty' });
    
    // Add file removals
    config.messages.wipePaths.forEach(path => {
      animationQueue.push({ 
        type: 'removing', 
        text: path 
      });
    });
    
    // Add empty line and in-progress message
    animationQueue.push({ type: 'empty' });
    animationQueue.push({ 
      type: 'inProgress', 
      text: config.messages.inProgress 
    });
    
    // Add progress bars with intermediate delays
    animationQueue.push({ type: 'empty' });
    for (let i = 1; i <= config.progressBarSteps; i++) {
      const percentage = Math.round((i / config.progressBarSteps) * 100);
      const filledBars = Math.round((i / config.progressBarSteps) * 24);
      const progressBar = '█'.repeat(filledBars) + '░'.repeat(24 - filledBars) + ` ${percentage}%`;
      animationQueue.push({ 
        type: 'progress', 
        text: progressBar,
        delay: config.progressBarDelay 
      });
    }
    
    // Add erasing message
    animationQueue.push({ type: 'empty' });
    animationQueue.push({ 
      type: 'inProgress', 
      text: config.messages.erasing 
    });
    animationQueue.push({ type: 'empty' });
    
    // Add success messages
    config.messages.successMessages.forEach(msg => {
      animationQueue.push({ 
        type: 'success', 
        text: msg 
      });
    });
    
    // Add welcome message
    animationQueue.push({ type: 'empty' });
    animationQueue.push({ 
      type: 'welcome', 
      text: config.messages.welcome 
    });

    // STEP 4: Animate the queue
    let queueIndex = 0;
    const processQueue = () => {
      if (queueIndex < animationQueue.length) {
        const item = animationQueue[queueIndex];
        
        if (item.type === 'empty') {
          const emptyLine = document.createElement('div');
          emptyLine.className = 'terminal-line';
          terminal.outputElement.appendChild(emptyLine);
        } else {
          const line = document.createElement('div');
          line.className = 'terminal-response';
          
          // Build final style string
          let styleStr = '';
          
          // Apply type-specific styling
          switch (item.type) {
            case 'warning':
              styleStr = config.styles.warning;
              break;
            case 'removing':
              styleStr = config.styles.removing;
              // Add fade effect for removing lines
              line.style.opacity = '0';
              setTimeout(() => line.style.opacity = '1', 10);
              line.style.transition = 'opacity 0.2s ease';
              break;
            case 'inProgress':
              styleStr = config.styles.warning;
              break;
            case 'progress':
              styleStr = config.styles.progress;
              break;
            case 'success':
              styleStr = config.styles.success;
              break;
            case 'welcome':
              styleStr = config.styles.welcome;
              break;
          }
          
          line.style.cssText = styleStr + (line.style.cssText ? '; ' + line.style.cssText : '');
          
          // No animations - instant display
          
          line.innerHTML = terminal.escapeHtml(item.text);
          terminal.outputElement.appendChild(line);
        }
        
        // Scroll to bottom
        terminal.outputElement.scrollTop = terminal.outputElement.scrollHeight;
        
        // Schedule next item
        const nextDelay = item.delay || config.lineDelay;
        queueIndex++;
        setTimeout(processQueue, nextDelay);
      } else {
        // Animation complete - Add intense shake and glitch at the END
        let glitchActive = true;
        const applyGlitch = () => {
          if (!glitchActive) return;
          
          const intensity = config.glitchIntensity * 1.5; // More intense at the end
          terminal.outputElement.style.transform = `translate(${(Math.random() - 0.5) * intensity * 12}px, ${(Math.random() - 0.5) * intensity * 12}px) rotate(${(Math.random() - 0.5) * 2}deg)`;
          
          if (config.colorGlitch) {
            const hue = Math.random() * 60 - 30;
            const sat = 1 + Math.random() * 1.2;
            terminal.outputElement.style.filter = `hue-rotate(${hue}deg) saturate(${sat}) brightness(${0.7 + Math.random() * 0.4})`;
          }
        };

        // Intense shake/glitch for a short duration
        const glitchInterval = setInterval(applyGlitch, 50);
        setTimeout(() => {
          glitchActive = false;
          clearInterval(glitchInterval);
          
          // Screen flicker to black and back
          terminal.outputElement.style.transition = 'opacity 0.1s';
          terminal.outputElement.style.opacity = '0';
          
          setTimeout(() => {
            terminal.outputElement.style.opacity = '1';
            setTimeout(() => {
              terminal.outputElement.style.opacity = '0';
              setTimeout(() => {
                terminal.outputElement.style.opacity = '1';
                
                // Reset all effects
                terminal.outputElement.style.transform = '';
                terminal.outputElement.style.filter = '';
                terminal.outputElement.style.transition = '';
              }, 100);
            }, 100);
          }, 100);
        }, 800); // 800ms of intense shake
        
        // Reset filesystem and bootup state
        setTimeout(() => {
          if (window.virtualFilesystem) {
            window.virtualFilesystem.resetToDefaults();
          }
          
          // Reset bootup state to trigger bootup sequence on next load
          if (window.retroTerminal && window.retroTerminal.bootupSequence) {
            window.retroTerminal.bootupSequence.resetBootupState();
          }
          
          // Show flashing message
          const reloadMsg = document.createElement('div');
          reloadMsg.className = 'terminal-response';
          reloadMsg.style.cssText = 'color: var(--accent); font-weight: bold; text-align: center; margin-top: 16px; animation: blink 0.6s infinite;';
          reloadMsg.textContent = 'System wiped. Reload the page to see bootup sequence.';
          terminal.outputElement.appendChild(reloadMsg);
          
          const inputLine = document.createElement('div');
          inputLine.className = 'terminal-line';
          
          const prompt = document.createElement('span');
          prompt.className = 'prompt';
          prompt.textContent = terminal.getPrompt();
          
          const inputSpan = document.createElement('span');
          inputSpan.className = 'input-line';
          inputSpan.id = 'input-line';
          
          inputLine.appendChild(prompt);
          inputLine.appendChild(inputSpan);
          terminal.outputElement.appendChild(inputLine);
          
          terminal.inputLineElement = document.getElementById('input-line');
          terminal.currentLine = '';
          terminal.outputElement.scrollTop = terminal.outputElement.scrollHeight;
        }, 1200); // Delay to show message after shake
      }
    };

    // Start processing the queue after glitch finishes
    setTimeout(processQueue, config.glitchDuration + config.commandDelay);
  }

  open() {
    this.backdropElement.classList.add('active');
    this.loadSettings();
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.backdropElement.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle() {
    if (this.backdropElement.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.settingsModal = new SettingsModal();
  });
} else {
  window.settingsModal = new SettingsModal();
}
