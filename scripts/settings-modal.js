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
        wipePaths: [
          '🔥 PURGING: /root                  [████████████████████] 100%',
          '🔥 PURGING: /home                  [████████████████████] 100%',
          '🔥 PURGING: /etc/config            [████████████████████] 100%',
          '🔥 PURGING: /var/logs              [████████████████████] 100%',
          '🔥 PURGING: /tmp/cache             [████████████████████] 100%',
          '🔥 PURGING: /usr/bin               [████████████████████] 100%',
          '🔥 PURGING: /bin/system            [████████████████████] 100%',
          '🔥 PURGING: /lib/modules           [████████████████████] 100%',
          '🔥 PURGING: /boot/kernel           [████████████████████] 100%',
          '🔥 PURGING: /dev/hardware          [████████████████████] 100%',
          '🔥 PURGING: /sys/kernel            [████████████████████] 100%',
          '🔥 PURGING: /proc/runtime          [████████████████████] 100%',
          '🔥 PURGING: /opt/applications      [████████████████████] 100%',
          '🔥 PURGING: /srv/services          [████████████████████] 100%',
          '🔥 PURGING: /mnt/volumes           [████████████████████] 100%',
          '💾 WIPING: Memory sectors          [████████████████████] 100%',
          '💾 WIPING: Cache directories       [████████████████████] 100%',
          '💾 WIPING: Configuration files     [████████████████████] 100%',
          '🗑️  ERASING: User data             [████████████████████] 100%',
          '🗑️  ERASING: System databases      [████████████████████] 100%'
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

        // PHASE 1: Intense shake/glitch (simulating system corruption)
        const glitchInterval = setInterval(applyGlitch, 50);
        setTimeout(() => {
          glitchActive = false;
          clearInterval(glitchInterval);
          
          // Reset glitch effects
          terminal.outputElement.style.transform = '';
          terminal.outputElement.style.filter = '';
          
          // PHASE 2: Start CRT shutdown sequence
          this.performCRTShutdown(terminal);
        }, 1200); // 1.2 seconds of intense glitching
      }
    };

    // Start processing the queue after glitch finishes
    setTimeout(processQueue, config.glitchDuration + config.commandDelay);
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
                // STEP 7: Complete - Clean up and reset
                body.removeChild(shutdownOverlay);
                main.style.cssText = ''; // Reset all styles
                main.style.opacity = '1';
                
                // Reset filesystem and bootup state
                if (window.virtualFilesystem) {
                  window.virtualFilesystem.resetToDefaults();
                }
                
                if (window.retroTerminal && window.retroTerminal.bootupSequence) {
                  window.retroTerminal.bootupSequence.resetBootupState();
                }
                
                // Clear terminal and show reload message
                terminal.outputElement.innerHTML = '';
                
                // Show system wiped message
                const reloadMsg = document.createElement('div');
                reloadMsg.className = 'terminal-response';
                reloadMsg.style.cssText = `
                  color: var(--accent);
                  font-weight: bold;
                  text-align: center;
                  margin: 40px 0;
                  font-size: 18px;
                  text-shadow: 0 0 15px var(--accent);
                  animation: fadeInPulse 2s ease-in-out infinite;
                `;
                reloadMsg.textContent = '✓ SYSTEM WIPED - Press F5 to see bootup sequence';
                terminal.outputElement.appendChild(reloadMsg);
                
                // Re-create input line
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
              }, 250); // Wait for dot fade
            }, 350); // Wait for dot shrink
          }, 450); // Wait for line collapse
        }, 50); // Small delay before collapsing
      }, 350); // Wait for vertical squish
    }, 250); // Wait for flicker to complete
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
