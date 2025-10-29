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
     * Configuration for the CYBERPUNK HACKER-STYLE wipe animation
     * Ultra dramatic filesystem destruction sequence
     */
    return {
      // Timing (in milliseconds) - Faster for more intensity
      glitchDuration: 1500,           // Extended glitch for dramatic effect
      glitchInterval: 40,             // Rapid glitch updates
      commandDelay: 150,              // Snappy command appearance
      lineDelay: 60,                  // Fast line animation
      progressBarSteps: 12,           // More steps for smooth animation
      progressBarDelay: 120,          // Quick progress updates
      finalDelay: 600,                // Pause before final message
      
      // Visual effects - MAX DRAMA
      glitchIntensity: 0.95,          // Near-max glitch intensity
      colorGlitch: true,              // Full color chaos
      enableCascadeAnimation: true,   // Animated cascade effect
      enableMatrixRain: true,         // Trigger Matrix rain during wipe
      
      // Messages configuration - HACKER AESTHETIC
      messages: {
        warning: '⚠️  CRITICAL: INITIATING SYSTEM PURGE SEQUENCE  ⚠️',
        command: 'root@lucy:~# rm -rf --no-preserve-root /*',
        statusMessages: [
          'Scanning filesystem...',
          'Removing system files...',
          'Purging user data...',
          'Erasing kernel modules...',
          'Wiping configuration...',
          'Clearing caches...',
          'Destroying backups...',
          'Overwriting sectors...',
          'Finalizing deletion...'
        ],
        inProgress: '💥 ━━━ SYSTEM PURGE ACTIVE ━━━ IRREVERSIBLE ━━━ 💥',
        erasing: '⏳ ZEROING SECTORS ... OVERWRITING DATA ... FRAGMENTING MEMORY ...',
        successMessages: [
          '',
          '═══════════════════════════════════════════════════════════',
          '✓ [OK] Filesystem successfully obliterated',
          '✓ [OK] All data permanently erased',
          '✓ [OK] System reset to factory defaults',
          '✓ [OK] Memory sectors zeroed',
          '✓ [OK] Cache purged',
          '═══════════════════════════════════════════════════════════',
          '',
          '🎯 PURGE COMPLETE. SYSTEM RESET SUCCESSFUL.',
          ''
        ],
        welcome: '> Type "help" to begin your fresh start ...',
        ascii: `
    ██████╗ ██╗   ██╗██████╗  ██████╗ ███████╗
    ██╔══██╗██║   ██║██╔══██╗██╔════╝ ██╔════╝
    ██████╔╝██║   ██║██████╔╝██║  ███╗█████╗  
    ██╔═══╝ ██║   ██║██╔══██╗██║   ██║██╔══╝  
    ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
    ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
        `
      },
      
      // Styling configuration - CYBERPUNK COLORS
      styles: {
        command: 'color: #ff0066; font-weight: 900; text-shadow: 0 0 20px #ff0066, 0 0 40px #ff0066; font-size: 14px; letter-spacing: 1px;',
        warning: 'color: #ff3366; font-weight: 900; text-shadow: 0 0 20px #ff3366, 0 0 40px #ff3366; font-size: 16px; letter-spacing: 2px; animation: pulse 0.5s ease-in-out infinite;',
        progress: 'color: #00ff99; font-family: monospace; letter-spacing: 1px; font-weight: 700; text-shadow: 0 0 10px #00ff99;',
        removing: 'color: #ff6600; font-weight: 600; font-size: 13px; text-shadow: 0 0 8px #ff6600; font-family: monospace;',
        success: 'color: #00ff99; font-weight: 700; text-shadow: 0 0 15px #00ff99, 0 0 30px #00ff99; font-size: 14px;',
        welcome: 'color: #00ffff; font-weight: 700; text-shadow: 0 0 15px #00ffff; margin-top: 20px; font-size: 15px;',
        ascii: 'color: #ff0066; font-weight: 700; text-shadow: 0 0 20px #ff0066; font-size: 11px; line-height: 1.2; white-space: pre;'
      }
    };
  }

  showDestructiveAnimation(config) {
    /**
     * EPIC CRT SHUTDOWN SEQUENCE WITH TV POWER-OFF EFFECT
     * Shows system wiping with glitches, then classic CRT turn-off animation
     * @param {Object} config - Animation configuration from getWipeAnimationConfig()
     */
    if (!window.retroTerminal) return;

    const terminal = window.retroTerminal;
    const body = document.body;
    const main = document.querySelector('.main');
    
    // STEP 1: Clear the terminal screen
    terminal.outputElement.innerHTML = '';
    terminal.currentLine = '';
    
    // Save original background
    const originalBg = terminal.outputElement.style.backgroundColor;
    
    // Show the dangerous command first
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line completed';
    cmdLine.style.cssText = config.styles.command;
    cmdLine.textContent = config.messages.command || 'root@lucy:~# rm -rf --no-preserve-root /*';
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
    
    // Add in-progress message
    animationQueue.push({ 
      type: 'inProgress', 
      text: config.messages.inProgress 
    });
    animationQueue.push({ type: 'empty' });
    
    // Add progress bar animation (this will be a single updating element)
    animationQueue.push({ type: 'progressBar' });
    
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
    
    // Add ASCII art if provided
    if (config.messages.ascii) {
      animationQueue.push({ type: 'empty' });
      animationQueue.push({ 
        type: 'ascii', 
        text: config.messages.ascii 
      });
    }
    
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
        } else if (item.type === 'progressBar') {
          // Handle animated progress bar
          this.animateProgressBar(terminal, config);
          queueIndex++;
          setTimeout(processQueue, 50); // Continue immediately after starting animation
          return;
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
            case 'ascii':
              styleStr = config.styles.ascii;
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
        // Animation complete - GRADUAL ESCALATION FROM CALM TO CHAOS
        this.performGradualGlitchEscalation(terminal, config);
      }
    };

    // Start processing the queue after glitch finishes
    setTimeout(processQueue, config.glitchDuration + config.commandDelay);
  }

  performGradualGlitchEscalation(terminal, config) {
    /**
     * Gradually escalating glitch effects from calm to complete chaos
     * Phase 1: Subtle flicker (0-400ms) - "Something's wrong..."
     * Phase 2: Growing distortion (400-800ms) - "It's getting worse..."
     * Phase 3: Violent chaos (800-1400ms) - "SYSTEM FAILURE!"
     */
    
    let glitchActive = true;
    let startTime = Date.now();
    const totalDuration = 1400; // Total glitch duration in ms
    
    const applyGlitch = () => {
      if (!glitchActive) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1); // 0 to 1
      
      // Exponential escalation (starts slow, ends INTENSE)
      const intensityMultiplier = Math.pow(progress, 2); // Quadratic growth
      
      // PHASE 1 (0-30%): Subtle flickering
      if (progress < 0.3) {
        // Very subtle position shifts
        const shakeX = (Math.random() - 0.5) * 2 * intensityMultiplier;
        const shakeY = (Math.random() - 0.5) * 2 * intensityMultiplier;
        terminal.outputElement.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
        
        // Occasional flicker
        if (Math.random() < 0.1) {
          terminal.outputElement.style.opacity = 0.9 + Math.random() * 0.1;
        } else {
          terminal.outputElement.style.opacity = '1';
        }
      }
      // PHASE 2 (30-60%): Growing distortion
      else if (progress < 0.6) {
        // Moderate shake with rotation
        const shakeX = (Math.random() - 0.5) * 8 * intensityMultiplier;
        const shakeY = (Math.random() - 0.5) * 8 * intensityMultiplier;
        const rotate = (Math.random() - 0.5) * 1 * intensityMultiplier;
        terminal.outputElement.style.transform = `translate(${shakeX}px, ${shakeY}px) rotate(${rotate}deg)`;
        
        // Start color distortion
        if (config.colorGlitch) {
          const hue = (Math.random() - 0.5) * 30 * intensityMultiplier;
          const sat = 1 + (Math.random() - 0.5) * 0.3 * intensityMultiplier;
          terminal.outputElement.style.filter = `hue-rotate(${hue}deg) saturate(${sat})`;
        }
        
        // More frequent flicker
        terminal.outputElement.style.opacity = 0.85 + Math.random() * 0.15;
      }
      // PHASE 3 (60-100%): VIOLENT CHAOS
      else {
        // INTENSE shake and rotation
        const shakeX = (Math.random() - 0.5) * 20 * intensityMultiplier;
        const shakeY = (Math.random() - 0.5) * 20 * intensityMultiplier;
        const rotate = (Math.random() - 0.5) * 4 * intensityMultiplier;
        const scale = 1 + (Math.random() - 0.5) * 0.1 * intensityMultiplier;
        terminal.outputElement.style.transform = `translate(${shakeX}px, ${shakeY}px) rotate(${rotate}deg) scale(${scale})`;
        
        // EXTREME color distortion
        if (config.colorGlitch) {
          const hue = (Math.random() - 0.5) * 120 * intensityMultiplier;
          const sat = 1 + Math.random() * 1.5 * intensityMultiplier;
          const bright = 0.7 + Math.random() * 0.6;
          terminal.outputElement.style.filter = `hue-rotate(${hue}deg) saturate(${sat}) brightness(${bright})`;
        }
        
        // Rapid flicker
        terminal.outputElement.style.opacity = 0.7 + Math.random() * 0.3;
      }
    };
    
    // Start the gradual escalation
    const glitchInterval = setInterval(applyGlitch, 40); // Update every 40ms for smooth escalation
    
    setTimeout(() => {
      glitchActive = false;
      clearInterval(glitchInterval);
      
      // Reset glitch effects
      terminal.outputElement.style.transform = '';
      terminal.outputElement.style.filter = '';
      terminal.outputElement.style.opacity = '';
      
      // Start CRT shutdown sequence
      this.performCRTShutdown(terminal);
    }, totalDuration);
  }

  animateProgressBar(terminal, config) {
    /**
     * Animates a single progress bar that fills from 0-100%
     * with status messages updating as it progresses
     */
    
    const statusLine = document.createElement('div');
    statusLine.className = 'terminal-response';
    statusLine.style.cssText = 'color: #00ffff; font-weight: 600; font-size: 13px; margin-bottom: 8px;';
    statusLine.textContent = config.messages.statusMessages[0];
    terminal.outputElement.appendChild(statusLine);
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'terminal-response';
    progressContainer.style.cssText = 'font-family: monospace; margin: 8px 0;';
    
    const progressBarLine = document.createElement('div');
    progressBarLine.style.cssText = 'display: flex; gap: 12px; align-items: center;';
    
    const progressLabel = document.createElement('span');
    progressLabel.style.cssText = 'color: #ff6600; font-weight: 700; text-shadow: 0 0 8px #ff6600;';
    progressLabel.textContent = 'DELETING:';
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      flex: 1;
      height: 24px;
      background: rgba(255, 0, 0, 0.1);
      border: 2px solid #ff0066;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 0 10px rgba(255, 0, 102, 0.3);
    `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #ff0066, #ff6600, #ff0066);
      background-size: 200% 100%;
      animation: progressShine 1s linear infinite;
      transition: width 0.1s linear;
      box-shadow: 0 0 20px rgba(255, 0, 102, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3);
      position: relative;
    `;
    
    const progressText = document.createElement('span');
    progressText.style.cssText = `
      position: absolute;
      width: 100%;
      text-align: center;
      line-height: 24px;
      font-weight: 900;
      font-size: 12px;
      color: white;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), 1px 1px 2px black;
      z-index: 1;
      letter-spacing: 1px;
    `;
    progressText.textContent = '0%';
    
    progressBar.appendChild(progressFill);
    progressBar.appendChild(progressText);
    progressBarLine.appendChild(progressLabel);
    progressBarLine.appendChild(progressBar);
    progressContainer.appendChild(progressBarLine);
    terminal.outputElement.appendChild(progressContainer);
    
    // Animate the progress bar
    let currentProgress = 0;
    const totalSteps = 100;
    const updateInterval = 30; // Update every 30ms for smooth animation
    const statusMessages = config.messages.statusMessages;
    let currentStatusIndex = 0;
    
    const updateProgress = () => {
      if (currentProgress <= 100) {
        currentProgress += 1;
        progressFill.style.width = currentProgress + '%';
        progressText.textContent = currentProgress + '%';
        
        // Update status message at certain milestones
        const milestone = Math.floor((currentProgress / 100) * statusMessages.length);
        if (milestone !== currentStatusIndex && milestone < statusMessages.length) {
          currentStatusIndex = milestone;
          statusLine.textContent = statusMessages[currentStatusIndex];
          
          // Add a flash effect when status changes
          statusLine.style.textShadow = '0 0 20px #00ffff';
          setTimeout(() => {
            statusLine.style.textShadow = '0 0 5px #00ffff';
          }, 100);
        }
        
        // Continue animation
        setTimeout(updateProgress, updateInterval);
      }
    };
    
    // Start the animation
    updateProgress();
  }

  performCRTShutdown(terminal) {
    /**
     * Classic CRT TV shutdown effect:
     * 1. Screen content fades/shrinks
     * 2. Collapses to horizontal line
     * 3. Line shrinks to center dot
     * 4. Dot fades to black
     */
    
    const body = document.body;
    const main = document.querySelector('.main');
    
    // Create CRT shutdown overlay
    const shutdownOverlay = document.createElement('div');
    shutdownOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: black;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    `;
    body.appendChild(shutdownOverlay);
    
    // Create the white line that will collapse
    const whiteLine = document.createElement('div');
    whiteLine.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background: white;
      box-shadow: 0 0 40px 10px rgba(255, 255, 255, 0.8);
      opacity: 0;
    `;
    shutdownOverlay.appendChild(whiteLine);
    
    // STEP 1: Rapid flicker before shutdown (200ms)
    let flickerCount = 0;
    const flickerInterval = setInterval(() => {
      main.style.opacity = flickerCount % 2 === 0 ? '0' : '1';
      flickerCount++;
      if (flickerCount > 6) {
        clearInterval(flickerInterval);
        main.style.opacity = '1';
      }
    }, 30);
    
    setTimeout(() => {
      // STEP 2: Content shrinks vertically with glow (300ms)
      main.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 1, 1), filter 0.3s ease-out';
      main.style.transform = 'scaleY(0.02)';
      main.style.filter = 'brightness(3) blur(2px)';
      main.style.transformOrigin = 'center';
      
      setTimeout(() => {
        // STEP 3: Flash to white line
        main.style.opacity = '0';
        whiteLine.style.opacity = '1';
        whiteLine.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.6, 1), opacity 0.1s';
        
        setTimeout(() => {
          // STEP 4: Line collapses to horizontal line (400ms)
          whiteLine.style.height = '2px';
          whiteLine.style.boxShadow = '0 0 20px 4px rgba(255, 255, 255, 0.9)';
          
          setTimeout(() => {
            // STEP 5: Line shrinks to center dot (300ms)
            whiteLine.style.transition = 'width 0.3s cubic-bezier(0.6, 0, 1, 1), height 0.3s cubic-bezier(0.6, 0, 1, 1), opacity 0.3s ease-out';
            whiteLine.style.width = '4px';
            whiteLine.style.height = '4px';
            whiteLine.style.borderRadius = '50%';
            whiteLine.style.boxShadow = '0 0 30px 8px rgba(255, 255, 255, 1)';
            whiteLine.style.left = '50%';
            whiteLine.style.top = '50%';
            whiteLine.style.transform = 'translate(-50%, -50%)';
            
            setTimeout(() => {
              // STEP 6: Dot fades to black (200ms)
              whiteLine.style.opacity = '0';
              whiteLine.style.boxShadow = 'none';
              
              setTimeout(() => {
                // STEP 7: Stay in black screen briefly for dramatic effect
                
                // Reset filesystem and bootup state NOW (while screen is black)
                if (window.virtualFilesystem) {
                  window.virtualFilesystem.resetToDefaults();
                }
                
                if (window.retroTerminal && window.retroTerminal.bootupSequence) {
                  window.retroTerminal.bootupSequence.resetBootupState();
                }
                
                // Wait for ANY user input to power back on (no text, keep it immersive)
                const handlePowerOn = (e) => {
                  e.preventDefault();
                  
                  // Remove event listeners
                  document.removeEventListener('keydown', handlePowerOn);
                  document.removeEventListener('click', handlePowerOn);
                  
                  // Start the CRT power-ON sequence
                  this.performCRTPowerOn(body, main, shutdownOverlay, terminal);
                };
                
                document.addEventListener('keydown', handlePowerOn, { once: true });
                document.addEventListener('click', handlePowerOn, { once: true });
              }, 250); // Wait for dot fade
            }, 350); // Wait for dot shrink
          }, 450); // Wait for line collapse
        }, 50); // Small delay before collapsing
      }, 350); // Wait for vertical squish
    }, 250); // Wait for flicker to complete
  }

  performCRTPowerOn(body, main, shutdownOverlay, terminal) {
    /**
     * ENHANCED CRT TV POWER-ON effect - MORE DRAMATIC!
     * 1. Instant bright flash (like electron gun firing)
     * 2. Small dot appears with spark
     * 3. Dot SNAPS to horizontal line with trailing glow
     * 4. Line EXPLODES vertically to full screen
     * 5. Intense brightness bloom then settles
     * 6. Trigger bootup sequence
     */
    
    shutdownOverlay.innerHTML = '';
    
    // Create the power-on elements
    const whiteLine = document.createElement('div');
    whiteLine.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 0px;
      height: 0px;
      background: white;
      opacity: 0;
    `;
    shutdownOverlay.appendChild(whiteLine);
    
    // STEP 1: Instant bright flash (like turning on TV) - 80ms
    setTimeout(() => {
      shutdownOverlay.style.transition = 'background 0.08s';
      shutdownOverlay.style.background = 'rgba(255, 255, 255, 0.15)';
      
      setTimeout(() => {
        shutdownOverlay.style.background = 'black';
        
        // STEP 2: Dot appears with intensity (100ms)
        setTimeout(() => {
          whiteLine.style.transition = 'all 0.1s cubic-bezier(0.4, 0, 1, 1)';
          whiteLine.style.width = '6px';
          whiteLine.style.height = '6px';
          whiteLine.style.borderRadius = '50%';
          whiteLine.style.opacity = '1';
          whiteLine.style.boxShadow = '0 0 40px 15px rgba(255, 255, 255, 1), 0 0 80px 30px rgba(255, 255, 255, 0.6)';
          
          setTimeout(() => {
            // STEP 3: SNAP to horizontal line with overshoot (180ms)
            whiteLine.style.transition = 'all 0.18s cubic-bezier(0.2, 0, 0.3, 1.05)';
            whiteLine.style.width = '105%'; // Slight overshoot
            whiteLine.style.height = '3px';
            whiteLine.style.borderRadius = '0';
            whiteLine.style.left = '50%';
            whiteLine.style.transform = 'translate(-50%, -50%)';
            whiteLine.style.boxShadow = '0 0 30px 8px rgba(255, 255, 255, 0.95), 0 0 60px 20px rgba(255, 255, 255, 0.5)';
            
            setTimeout(() => {
              // Settle to 100% width
              whiteLine.style.transition = 'width 0.08s ease-out';
              whiteLine.style.width = '100%';
              whiteLine.style.left = '0';
              whiteLine.style.transform = 'translate(0, -50%)';
              
              setTimeout(() => {
                // STEP 4: EXPLODE to full screen vertically (250ms)
                whiteLine.style.transition = 'all 0.25s cubic-bezier(0.15, 0, 0.3, 1.1)';
                whiteLine.style.height = '100%';
                whiteLine.style.top = '0';
                whiteLine.style.transform = 'none';
                whiteLine.style.boxShadow = '0 0 80px 20px rgba(255, 255, 255, 0.9)';
                
                setTimeout(() => {
                  // STEP 5: Brightness bloom (150ms)
                  whiteLine.style.transition = 'opacity 0.15s ease-out, box-shadow 0.15s';
                  whiteLine.style.opacity = '1.5'; // Overbright
                  whiteLine.style.boxShadow = '0 0 120px 40px rgba(255, 255, 255, 1)';
                  
                  // Reveal content behind (starts faint)
                  main.style.opacity = '0';
                  main.style.filter = 'brightness(5) blur(4px) saturate(1.5)';
                  main.style.transform = 'scaleY(1)';
                  
                  setTimeout(() => {
                    // STEP 6: White fades, content becomes visible (200ms)
                    whiteLine.style.transition = 'opacity 0.2s ease-out';
                    whiteLine.style.opacity = '0';
                    
                    main.style.transition = 'all 0.3s cubic-bezier(0.2, 0, 0.3, 1)';
                    main.style.opacity = '1';
                    main.style.filter = 'brightness(1.8) blur(1px)';
                    
                    setTimeout(() => {
                      // STEP 7: Settle to normal (200ms)
                      main.style.transition = 'all 0.2s ease-out';
                      main.style.filter = 'brightness(1) blur(0)';
                      
                      setTimeout(() => {
                        // STEP 8: Clean up and trigger bootup
                        body.removeChild(shutdownOverlay);
                        main.style.cssText = '';
                        
                        // Clear terminal completely
                        terminal.outputElement.innerHTML = '';
                        terminal.currentLine = '';
                        
                        // Trigger the bootup sequence!
                        if (window.retroTerminal && window.retroTerminal.bootupSequence) {
                          window.retroTerminal.bootupSequence.playBootupSequence();
                        }
                      }, 200); // Wait for settle
                    }, 200); // Wait for de-blur
                  }, 150); // Wait for bloom
                }, 250); // Wait for vertical explosion
              }, 80); // Wait for width settle
            }, 180); // Wait for horizontal snap
          }, 100); // Wait for dot
        }, 50); // Wait for flash fade
      }, 80); // Flash duration
    }, 20); // Initial delay
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
