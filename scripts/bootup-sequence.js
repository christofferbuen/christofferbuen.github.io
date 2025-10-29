/**
 * System Bootup Sequence
 * Displays a dramatic bootup animation on first load or after system wipe
 * Creates an authentic retro computer startup experience
 * 
 * @class BootupSequence
 */
class BootupSequence {
  /**
   * Creates a new BootupSequence instance
   * @param {RetroTerminal} terminal - The terminal instance to display bootup in
   */
  constructor(terminal) {
    this.terminal = terminal;
    this.hasBooted = this.checkBootupState();
  }

  checkBootupState() {
    /**
     * Check if system has been booted before
     */
    return localStorage.getItem('system-booted') === 'true';
  }

  markAsBooted() {
    /**
     * Mark system as booted
     */
    localStorage.setItem('system-booted', 'true');
  }

  resetBootupState() {
    /**
     * Reset bootup state (used after wipe)
     */
    localStorage.removeItem('system-booted');
    this.hasBooted = false;
  }

  getBootupConfig() {
    /**
     * Configuration for bootup sequence
     * Customize timing, messages, and effects here
     */
    return {
      // Timing (in milliseconds)
      messageDelay: 80,            // Delay before showing next message (reduced from 150)
      dotAnimationSpeed: 50,       // Speed of dot animation (reduced from 100)
      dotCount: 3,                 // Number of dots (legacy)
      maxDots: 40,                 // Max width for message + dots
      dotChar: '.',                // Character to use for dots
      statusDelay: 300,            // Delay before showing [OK] status (reduced from 600)
      completionDelay: 500,        // Delay before showing welcome message (reduced from 1000)
      soundEnabled: true,          // Play completion sound
      
      // Animation effects configuration
      // Available effects: 'instant', 'typewriter', 'flicker', 'glitch'
      defaultEffect: 'typewriter', // Default effect for messages
      typewriterSpeed: 30,         // Delay per character (ms)
      flickerDuration: 200,        // Duration of flicker effect (ms)
      glitchDuration: 300,         // Duration of glitch effect (ms)
      
      // Boot messages - organized by category
      // Each message can be a string or an object with { text, effect, speed }
      bootSequence: [
        {
          header: '┌─────────────────────────────────────────────────────────────┐',
          headerEffect: 'instant',
          messages: []
        },
        {
          header: '│                    SYSTEM BOOT SEQUENCE                     │',
          headerEffect: 'instant',
          messages: []
        },
        {
          header: '└─────────────────────────────────────────────────────────────┘',
          headerEffect: 'instant',
          messages: []
        },
        {
          header: '',
          messages: []
        },
        {
          header: 'Initializing core systems',
          headerEffect: 'typewriter',
          messages: [
            { text: 'Loading kernel modules', effect: 'instant' },
            { text: 'Mounting filesystems', effect: 'instant' }
          ]
        },
        {
          header: '',
          messages: []
        },
        {
          header: 'Security subsystem check',
          headerEffect: 'typewriter',
          messages: [
            { text: 'Verifying encryption keys', effect: 'instant' },
            { text: 'Initializing firewall', effect: 'instant' }
          ]
        },
        {
          header: '',
          messages: []
        },
        {
          header: 'Loading retro computing engine',
          headerEffect: 'typewriter',
          messages: [
            { text: 'Initializing CRT effects', effect: 'instant' },
            { text: 'Mounting virtual filesystem', effect: 'instant' }
          ]
        },
        {
          header: '',
          messages: []
        },
        {
          header: 'Network initialization',
          headerEffect: 'typewriter',
          messages: [
            { text: 'Establishing matrix connection', effect: 'instant' },
            { text: 'Syncing system time', effect: 'instant' }
          ]
        },
        {
          header: '',
          messages: []
        },
        {
          header: 'Neural interface calibration',
          headerEffect: 'typewriter',
          messages: []
        }
      ],
      
      // Animation configuration
      dotCount: 3,                 // Number of animated dots
      dotChar: '.',
      maxDots: 40,                 // Maximum dots before status
      
      // Styles
      styles: {
        header: 'color: var(--accent); font-weight: bold; text-shadow: 0 0 10px var(--accent);',
        message: 'color: rgba(255, 255, 255, 0.8);',
        dots: 'color: rgba(0, 255, 153, 0.4);',
        status: 'color: #00ff99; font-weight: bold; text-shadow: 0 0 8px #00ff99;',
        welcome: 'color: var(--accent); font-weight: bold; font-size: 16px; text-shadow: 0 0 15px var(--accent); text-align: center;'
      },
      
      // Welcome message
      welcomeMessage: '[ SYSTEM READY ]',
      commanderGreeting: 'Welcome back, Commander!'
    };
  }

  async playBootupSequence() {
    /**
     * Execute the bootup sequence animation with animated loading dots
     */
    if (!this.terminal || !this.terminal.outputElement) return;

    const config = this.getBootupConfig();
    const output = this.terminal.outputElement;
    
    // Clear the output
    output.innerHTML = '';
    
    // Disable input during bootup
    this.terminal.inputLineElement = null;
    
    // Process each boot sequence section
    for (const section of config.bootSequence) {
      // Display header
      if (section.header) {
        await this.sleep(config.messageDelay);
        const headerLine = document.createElement('div');
        headerLine.className = 'terminal-response';
        
        // Style headers (border lines and section titles)
        if (section.header.includes('─') || section.header.includes('│')) {
          headerLine.style.cssText = config.styles.header;
        } else if (section.header !== '') {
          headerLine.style.cssText = config.styles.header;
        }
        
        if (section.header !== '') {
          output.appendChild(headerLine);
          
          // Show header text instantly
          headerLine.textContent = section.header;
          
          this.terminal.scrollToBottom();
        }
      }
      
      // Display messages with animated loading dots
      for (const message of section.messages) {
        await this.sleep(config.messageDelay);
        await this.animateLoadingMessage(message, config);
      }
    }
    
    // Add completion messages
    await this.sleep(config.completionDelay);
    
    const successLine = document.createElement('div');
    successLine.className = 'terminal-response';
    successLine.style.cssText = config.styles.welcome;
    successLine.textContent = config.welcomeMessage;
    output.appendChild(successLine);
    this.terminal.scrollToBottom();
    
    await this.sleep(300);
    
    const greetingLine = document.createElement('div');
    greetingLine.className = 'terminal-response';
    greetingLine.style.cssText = 'color: var(--accent); font-weight: bold; text-align: center; margin-top: 8px;';
    greetingLine.textContent = config.commanderGreeting;
    output.appendChild(greetingLine);
    this.terminal.scrollToBottom();
    
    // Play completion sound if enabled
    if (config.soundEnabled) {
      this.playCompletionSound();
    }
    
    // Wait 2 seconds to let user read the messages
    await this.sleep(2000);
    
    // Clear the screen instantly (like the 'clear' command)
    output.innerHTML = '';
    
    // Mark as booted and show banner + prompt
    this.markAsBooted();
    this.hasBooted = true;
    
    // Show banner
    const bannerText = window.TerminalBanner ? window.TerminalBanner.display() : '';
    const bannerDiv = document.createElement('div');
    bannerDiv.className = 'terminal-banner';
    bannerDiv.innerHTML = bannerText.split('\n').map(line => 
      `<div class="banner-line">${this.terminal.escapeHtml(line)}</div>`
    ).join('');
    output.appendChild(bannerDiv);
    
    await this.sleep(100);
    
    // Create initial prompt
    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-line';
    inputLine.innerHTML = `
      <span class="prompt">${this.terminal.escapeHtml(this.terminal.getPrompt())}</span>
      <span class="input-line" id="input-line"></span>
    `;
    output.appendChild(inputLine);
    this.terminal.inputLineElement = document.getElementById('input-line');
    this.terminal.currentLine = '';
    this.terminal.scrollToBottom();
  }

  async applyTextEffect(element, text, effect, config) {
    /**
     * Apply different text animation effects
     * Available effects: 'instant', 'typewriter', 'flicker', 'glitch'
     */
    switch (effect) {
      case 'instant':
        element.textContent = text;
        break;
        
      case 'typewriter':
        await this.typewriterEffect(element, text, config.typewriterSpeed);
        break;
        
      case 'flicker':
        await this.flickerEffect(element, text, config.flickerDuration);
        break;
        
      case 'glitch':
        await this.glitchEffect(element, text, config.glitchDuration);
        break;
        
      default:
        element.textContent = text;
    }
  }

  async typewriterEffect(element, text, speed) {
    /**
     * Type out text character by character
     */
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await this.sleep(speed);
    }
  }

  async flickerEffect(element, text, duration) {
    /**
     * Flicker text in with random opacity changes
     */
    element.textContent = text;
    element.style.opacity = '0';
    
    const steps = 8;
    const stepDuration = duration / steps;
    
    for (let i = 0; i < steps; i++) {
      element.style.opacity = Math.random() > 0.5 ? '0' : '1';
      await this.sleep(stepDuration);
    }
    
    element.style.opacity = '1';
  }

  async glitchEffect(element, text, duration) {
    /**
     * Glitch effect with random characters before revealing actual text
     */
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const steps = 10;
    const stepDuration = duration / steps;
    
    for (let i = 0; i < steps; i++) {
      let glitchText = '';
      for (let j = 0; j < text.length; j++) {
        if (Math.random() > (i / steps)) {
          glitchText += chars[Math.floor(Math.random() * chars.length)];
        } else {
          glitchText += text[j];
        }
      }
      element.textContent = glitchText;
      await this.sleep(stepDuration);
    }
    
    element.textContent = text;
  }

  async animateLoadingMessage(message, config) {
    /**
     * Animate a loading message with dots that fill towards [OK]
     * Message can be a string or an object with { text, effect, speed }
     */
    const output = this.terminal.outputElement;
    
    // Parse message format
    let messageText, effect, customSpeed;
    if (typeof message === 'string') {
      messageText = message;
      effect = config.defaultEffect;
      customSpeed = null;
    } else {
      messageText = message.text;
      effect = message.effect || config.defaultEffect;
      customSpeed = message.speed || null;
    }
    
    // Create the message line
    const line = document.createElement('div');
    line.className = 'terminal-response';
    line.style.cssText = config.styles.message;
    
    // Create message structure
    const prefix = '  ';
    const maxLength = config.maxDots;
    const padding = Math.max(0, maxLength - messageText.length);
    
    // Build initial display
    const messageSpan = document.createElement('span');
    messageSpan.style.cssText = config.styles.message;
    
    const dotsSpan = document.createElement('span');
    dotsSpan.style.cssText = config.styles.dots;
    dotsSpan.textContent = '';
    
    const statusSpan = document.createElement('span');
    statusSpan.style.cssText = config.styles.status;
    statusSpan.textContent = '';
    
    line.appendChild(messageSpan);
    line.appendChild(dotsSpan);
    line.appendChild(statusSpan);
    output.appendChild(line);
    this.terminal.scrollToBottom();
    
    // Show message text instantly (no typing effect)
    messageSpan.textContent = prefix + messageText;
    
    // Animate dots filling in
    const totalDots = padding;
    for (let i = 0; i <= totalDots; i++) {
      await this.sleep(config.dotAnimationSpeed);
      dotsSpan.textContent = config.dotChar.repeat(i);
    }
    
    // Add final spacing and status - appear instantly
    await this.sleep(config.statusDelay);
    statusSpan.textContent = ' [OK]';
    statusSpan.style.color = '#00ff99';
    statusSpan.style.fontWeight = 'bold';
    statusSpan.style.textShadow = '0 0 8px #00ff99';
  }

  playCompletionSound() {
    /**
     * Play a completion sound effect
     * Uses Web Audio API to generate a satisfying beep
     */
    try {
      if (!this.terminal.audioContext) return;
      
      const ctx = this.terminal.audioContext;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Create a pleasant completion chord
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
      
      // Add second note for harmony
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
        gain2.gain.setValueAtTime(0.2, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.4);
      }, 100);
    } catch (error) {
      console.warn('Could not play completion sound:', error);
    }
  }

  sleep(ms) {
    /**
     * Helper to wait for specified milliseconds
     */
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export to global scope
window.BootupSequence = BootupSequence;
