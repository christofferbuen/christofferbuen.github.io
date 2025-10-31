/**
 * Retro Terminal Typing System
 * Creates a terminal-style interface with authentic typing sounds and command execution
 * 
 * @class RetroTerminal
 * @description Main terminal emulator class that handles user input, command execution,
 * and terminal rendering with retro CRT aesthetics.
 */
class RetroTerminal {
  /**
   * Creates a new RetroTerminal instance
   * @param {HTMLElement} container - The DOM element to render the terminal in
   */
  constructor(container) {
    this.container = container;
    this.terminalElement = null; // Will be set in createTerminalInterface
    this.currentLine = '';
    this.history = [];
    this.cursorVisible = true;
    this.currentDirectory = '.';
    
    // Audio context for sound effects
    this.audioContext = null;
    this.audioBuffers = {};
    
    // Custom sound file paths
    this.soundPaths = {
      spacebar: null,
      enter: null,
      backspace: null,
      tab: null,
      typing: [null, null, null, null, null] // 5 random typing sounds
    };
    
    // Virtual filesystem
    this.filesystem = null;
    
    // Command registry - make it easy to add new commands
    this.commands = new Map();
    
    // Command history for history command
    this.commandHistory = [];
    
    this.initializeDefaultCommands();
    
    this.init();
  }

  initializeDefaultCommands() {
    /**
     * Default commands are now registered by separate command modules:
     * - base-commands.js: help, man, clear, date, whoami, echo
     * - file-commands.js: ls, cd, cat, tree, pwd
     * - ui-commands.js: theme, matrix, settings, crt, bootup
     * - unix-commands.js: pwd, touch, mkdir, rm, cp, mv, head, tail, grep, wc, sort, history, env, uname, who, find
     * 
     * This method is kept for backward compatibility with custom command modules.
     */
  }

  /**
   * Initializes the terminal interface, filesystem, and audio system
   * @async
   */
  async init() {
    this.createTerminalInterface();
    this.filesystem = new VirtualFilesystem();
    await this.initAudio();
    this.bindEvents();
    this.startCursorBlink();
    
    // Initialize bootup sequence
    this.bootupSequence = new BootupSequence(this);
    
    // Check if we need to show bootup sequence
    if (!this.bootupSequence.hasBooted) {
      await this.bootupSequence.playBootupSequence();
    }
  }

  /**
   * Creates and renders the terminal DOM structure
   */
  createTerminalInterface() {
    // Create terminal container - just the content, no window frame
    const terminal = document.createElement('div');
    terminal.className = 'retro-terminal';
    
    // Store reference for responsive resizing
    this.terminalElement = terminal;
    
    // Create hidden input for mobile keyboard
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'text';
    hiddenInput.id = 'hidden-terminal-input';
    hiddenInput.autocomplete = 'off';
    hiddenInput.autocorrect = 'off';
    hiddenInput.autocapitalize = 'off';
    hiddenInput.spellcheck = false;
    hiddenInput.style.cssText = `
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    `;
    
    // Check if bootup has occurred
    const hasBooted = localStorage.getItem('system-booted') === 'true';
    
    if (hasBooted) {
      // Show banner and prompt if already booted
      const bannerText = window.TerminalBanner ? window.TerminalBanner.display() : '';
      
      terminal.innerHTML = `
        <div class="terminal-output" id="terminal-output">
          <div class="terminal-banner">
            ${bannerText.split('\n').map(line => `<div class="banner-line">${this.escapeHtml(line)}</div>`).join('')}
          </div>
          <div class="terminal-line">
            <span class="prompt">${this.escapeHtml(this.getPrompt())}</span>
            <span class="input-line" id="input-line"></span>
          </div>
        </div>
      `;
    } else {
      // Just create empty output for bootup sequence
      terminal.innerHTML = `
        <div class="terminal-output" id="terminal-output"></div>
      `;
    }
    
    terminal.appendChild(hiddenInput);
    this.container.appendChild(terminal);
    this.outputElement = document.getElementById('terminal-output');
    this.inputLineElement = document.getElementById('input-line');
    this.hiddenInput = hiddenInput;
    
    // Sync hidden input with current line
    hiddenInput.addEventListener('input', (e) => {
      this.currentLine = e.target.value;
      if (this.inputLineElement) {
        this.inputLineElement.textContent = this.currentLine + '█';
      }
    });
  }

  getPrompt() {
    /**
     * Generate the current prompt with directory
     */
    const dir = this.currentDirectory === '.' ? '~' : this.currentDirectory;
    return `guest@lucy:${dir}$`;
  }

  async initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Load custom sound files
      await this.loadCustomSounds();
    } catch (error) {
      console.warn('Audio not available:', error);
    }
  }

  async loadCustomSounds() {
    // Load spacebar sound
    if (this.soundPaths.spacebar) {
      this.audioBuffers.spacebar = await this.loadAudioFile(this.soundPaths.spacebar);
    }
    
    // Load enter sound
    if (this.soundPaths.enter) {
      this.audioBuffers.enter = await this.loadAudioFile(this.soundPaths.enter);
    }
    
    // Load backspace sound
    if (this.soundPaths.backspace) {
      this.audioBuffers.backspace = await this.loadAudioFile(this.soundPaths.backspace);
    }
    
    // Load tab sound
    if (this.soundPaths.tab) {
      this.audioBuffers.tab = await this.loadAudioFile(this.soundPaths.tab);
    }
    
    // Load 5 typing sounds
    this.audioBuffers.typing = [];
    for (let i = 0; i < 5; i++) {
      if (this.soundPaths.typing[i]) {
        const buffer = await this.loadAudioFile(this.soundPaths.typing[i]);
        this.audioBuffers.typing.push(buffer);
      }
    }
  }

  async loadAudioFile(url) {
    if (!url || !this.audioContext) {
      return null;
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load audio file: ${url}`, error);
      return null;
    }
  }

  setSoundPath(soundType, path, index = null) {
    /**
     * Set custom sound paths for keyboard sounds
     * 
     * Usage:
     *   terminal.setSoundPath('spacebar', 'sounds/spacebar.mp3');
     *   terminal.setSoundPath('enter', 'sounds/enter.mp3');
     *   terminal.setSoundPath('backspace', 'sounds/backspace.mp3');
     *   terminal.setSoundPath('tab', 'sounds/tab.mp3');
     *   terminal.setSoundPath('typing', 'sounds/key1.mp3', 0); // First typing sound
     *   terminal.setSoundPath('typing', 'sounds/key2.mp3', 1); // Second typing sound
     *   terminal.setSoundPath('typing', 'sounds/key3.mp3', 2); // etc...
     */
    if (soundType === 'typing' && index !== null) {
      this.soundPaths.typing[index] = path;
    } else if (soundType in this.soundPaths && soundType !== 'typing') {
      this.soundPaths[soundType] = path;
    }
  }

  async reloadSounds() {
    /**
     * Call this after setting all sound paths to reload the audio buffers
     */
    await this.loadCustomSounds();
  }

  playSound(soundType) {
    if (!this.audioContext) return;
    
    // Resume audio context if suspended (required by some browsers)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }

    try {
      let buffer = null;
      
      if (soundType === 'typing') {
        // Pick random typing sound from loaded buffers
        const loadedSounds = this.audioBuffers.typing.filter(b => b !== null);
        if (loadedSounds.length === 0) return;
        buffer = loadedSounds[Math.floor(Math.random() * loadedSounds.length)];
      } else {
        buffer = this.audioBuffers[soundType];
      }
      
      if (!buffer) return;
      
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  }

  bindEvents() {
    // Focus the terminal when clicked
    this.outputElement.addEventListener('click', () => {
      this.focus();
    });

    // Mobile: tap anywhere to focus (for virtual keyboard)
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', (e) => {
        // Don't interfere with buttons/controls
        if (!e.target.closest('button, input, select, textarea, .settings-modal, .crt-tuner-panel')) {
          this.focus();
        }
      });
    }

    // Handle keyboard input - always listen for input
    document.addEventListener('keydown', (e) => {
      this.handleKeyPress(e);
    });

    // Resume audio context on user interaction (browser requirement)
    document.addEventListener('click', () => {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    }, { once: true });

    // Handle window resize to make terminal responsive
    window.addEventListener('resize', () => {
      this.handleWindowResize();
    });

    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleWindowResize(), 100);
    });
  }

  handleWindowResize() {
    /**
     * Handle responsive terminal sizing on window resize
     * CSS media queries handle most of the work now
     */
    if (!this.terminalElement) return;

    // Ensure output scrolls to bottom after resize
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
    
    // Force repaint on mobile for proper viewport height
    if (window.innerWidth < 768) {
      requestAnimationFrame(() => {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
      });
    }
  }

  handleKeyPress(event) {
    const { key, code } = event;

    switch (key) {
      case 'Enter':
        event.preventDefault();
        this.playSound('enter');
        this.processCommand();
        // Clear hidden input
        if (this.hiddenInput) this.hiddenInput.value = '';
        break;
        
      case 'Backspace':
        event.preventDefault();
        this.playSound('backspace');
        if (this.currentLine.length > 0) {
          this.currentLine = this.currentLine.slice(0, -1);
          this.updateDisplay();
          if (this.hiddenInput) this.hiddenInput.value = this.currentLine;
        }
        break;
        
      case 'Tab':
        event.preventDefault();
        this.playSound('tab');
        this.handleTabAutocomplete();
        if (this.hiddenInput) this.hiddenInput.value = this.currentLine;
        break;
        
      case ' ':
        event.preventDefault();
        this.playSound('spacebar');
        this.currentLine += ' ';
        this.updateDisplay();
        if (this.hiddenInput) this.hiddenInput.value = this.currentLine;
        break;
        
      default:
        // Handle regular typing
        if (key.length === 1) { // Single character
          event.preventDefault();
          this.playSound('typing');
          this.currentLine += key;
          this.updateDisplay();
          if (this.hiddenInput) this.hiddenInput.value = this.currentLine;
        }
        break;
    }
  }

  /**
   * Processes and executes the current command line input
   */
  processCommand() {
    // Add current line to history
    this.history.push(this.currentLine);
    
    // Parse command and arguments
    const input = this.currentLine.trim();
    const parts = input.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    // Track in command history for history command
    if (input) {
      this.commandHistory.push(input);
    }
    
    // Check if this is a clear command before doing anything else
    if (commandName === 'clear') {
      this.clearTerminal();
      return;
    }
    
    // Create new line in output
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line completed';
    newLine.innerHTML = `
      <span class="prompt">${this.escapeHtml(this.getPrompt())}</span>
      <span class="command">${this.escapeHtml(this.currentLine)}</span>
    `;
    
    // Remove current input line before adding completed line
    const currentInputLine = this.outputElement.querySelector('.terminal-line:last-child');
    if (currentInputLine && !currentInputLine.classList.contains('completed')) {
      currentInputLine.remove();
    }
    
    // Add completed line
    this.outputElement.appendChild(newLine);
    
    // Execute command and get response
    const response = this.executeCommand(commandName, args);
    if (response !== null && response !== undefined) {
      // Check if response is an image object
      if (typeof response === 'object' && response.isImage) {
        const imageLine = document.createElement('div');
        imageLine.className = 'terminal-response terminal-image';
        imageLine.innerHTML = `<img src="${response.src}" alt="${response.alt}" />`;
        this.outputElement.appendChild(imageLine);
      } else {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-response';
        // Response already contains HTML, so use innerHTML directly
        responseLine.innerHTML = response;
        this.outputElement.appendChild(responseLine);
      }
    }
    
    // Create new input line
    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-line';
    inputLine.innerHTML = `
      <span class="prompt">${this.escapeHtml(this.getPrompt())}</span>
      <span class="input-line" id="input-line"></span>
    `;
    
    this.outputElement.appendChild(inputLine);
    
    // Update references
    this.inputLineElement = document.getElementById('input-line');
    
    // Clear current line
    this.currentLine = '';
    
    // Scroll to bottom to show the new output
    this.scrollToBottom();
    
    this.updateDisplay();
  }

  /**
   * Register a new command in the terminal
   * 
   * @param {string} name - Command name
   * @param {string} description - Brief description shown in help
   * @param {Function} handler - Function to execute when command is called
   * @param {string[]} aliases - Alternative names for the command
   * @param {Object} documentation - Detailed documentation object
   * @param {boolean} hidden - Whether to hide from help and autocomplete
   * 
   * @example
   * terminal.registerCommand('greet', 'Say hello', () => 'Hello, world!');
   * 
   * @example
   * terminal.registerCommand('test', 'Test command', (args) => {
   *   return `You said: ${args}`;
   * }, ['t'], {
   *   usage: 'test <message>',
   *   examples: ['test hello', 'test "hello world"'],
   *   notes: ['This is optional'],
   *   options: {
   *     '-v': 'Verbose mode'
   *   }
   * });
   */
  registerCommand(name, description, handler, aliases = [], documentation = null, hidden = false) {
    const commandObj = {
      name,
      description,
      handler,
      aliases: aliases || [],
      documentation: documentation || null,
      hidden: hidden || false
    };
    
    this.commands.set(name, commandObj);
    
    // Register aliases
    for (const alias of (aliases || [])) {
      this.commands.set(alias, commandObj);
    }
  }

  executeCommand(commandName, args) {
    /**
     * Execute a registered command
     * Handles both sync and async handlers
     */
    const commandObj = this.commands.get(commandName);
    
    if (!commandObj) {
      return `Command not found: ${commandName}. Type 'help' for available commands.`;
    }
    
    try {
      const result = commandObj.handler(args);
      
      // Handle Promise results (async commands)
      if (result instanceof Promise) {
        // For async commands, we don't display the Promise object
        // The command should handle its own output
        return null;
      }
      
      // Check if result is an image object
      if (result && typeof result === 'object' && result.isImage) {
        return result;
      }
      
      return result;
    } catch (error) {
      return `Error executing command: ${error.message}`;
    }
  }

  getCommandResponse(command) {
    const cmd = command.trim().toLowerCase();
    
    const responses = {
      'help': 'Available commands: help, clear, date, whoami, ls, cat, echo, matrix',
      'clear': '', // Special case - will clear screen
      'date': new Date().toLocaleString(),
      'whoami': 'guest',
      'ls': 'portfolio.txt  projects/  skills.dat  contact.info',
      'cat portfolio.txt': 'Welcome to my retro portfolio! Type commands to explore.',
      'echo': command.substring(5), // Echo everything after "echo "
      'matrix': '<span class="matrix-text">Wake up, Neo...</span>',
    };
    
    if (cmd === 'clear') {
      this.clearTerminal();
      return null;
    }
    
    return responses[cmd] || `Command not found: ${command}. Type 'help' for available commands.`;
  }

  clearTerminal() {
    // Completely clear the output and create a fresh input line
    this.outputElement.innerHTML = `
      <div class="terminal-line">
        <span class="prompt">${this.escapeHtml(this.getPrompt())}</span>
        <span class="input-line" id="input-line"></span>
      </div>
    `;
    
    this.inputLineElement = document.getElementById('input-line');
    this.currentLine = '';
    this.updateDisplay();
  }

  handleTabAutocomplete() {
    /**
     * Handle Tab key for autocomplete
     * Supports command names and arguments (like theme names)
     */
    const parts = this.currentLine.trim().split(/\s+/);
    const commandName = parts[0];
    
    // If no command typed yet, autocomplete commands (exclude hidden commands)
    if (parts.length === 0 || (parts.length === 1 && !this.currentLine.endsWith(' '))) {
      const incomplete = parts[0] || '';
      const matches = Array.from(this.commands.keys()).filter(cmd => {
        const command = this.commands.get(cmd);
        return cmd.startsWith(incomplete) && !command.hidden;
      });
      
      if (matches.length === 1) {
        this.currentLine = matches[0] + ' ';
        this.updateDisplay();
      } else if (matches.length > 1) {
        // Show matching commands
        const response = `Matching commands: ${matches.join(', ')}`;
        this.displayOutput(response);
      }
    } else if (this.currentLine.endsWith(' ')) {
      // Autocomplete arguments for specific commands
      const incomplete = parts[parts.length - 1] || '';
      
      if (commandName === 'theme') {
        // Get available theme names
        if (window.colorSchemes) {
          const schemes = window.colorSchemes.schemes;
          const themeNames = Object.keys(schemes);
          const matches = themeNames.filter(theme => theme.startsWith(incomplete));
          
          if (matches.length === 1) {
            this.currentLine = `theme ${matches[0]}`;
            this.updateDisplay();
          } else if (matches.length > 1) {
            const response = `Available themes: ${matches.join(', ')}`;
            this.displayOutput(response);
          }
        }
      } else if (commandName === 'cd') {
        // Autocomplete directories
        if (window.virtualFilesystem) {
          const files = window.virtualFilesystem.list(this.currentDirectory);
          const directories = Object.values(files)
            .filter(file => file.isDirectory)
            .map(file => file.name);
          const matches = directories.filter(dir => dir.startsWith(incomplete));
          
          if (matches.length === 1) {
            this.currentLine = `cd ${matches[0]}`;
            this.updateDisplay();
          } else if (matches.length > 1) {
            const response = `Matching directories: ${matches.join(', ')}`;
            this.displayOutput(response);
          }
        }
      }
    }
  }

  displayOutput(text) {
    /**
     * Helper to display output without executing a command
     */
    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-response';
    responseLine.innerHTML = text;
    this.outputElement.appendChild(responseLine);
    this.scrollToBottom();
  }

  updateDisplay() {
    // Update input line with current text and cursor
    this.inputLineElement.textContent = this.currentLine + '█';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  startCursorBlink() {
    setInterval(() => {
      this.cursorVisible = !this.cursorVisible;
      // Update display to show/hide cursor by removing/adding it
      if (this.inputLineElement) {
        if (this.cursorVisible) {
          this.inputLineElement.textContent = this.currentLine + '█';
        } else {
          this.inputLineElement.textContent = this.currentLine + ' ';
        }
      }
    }, 500);
  }

  focus() {
    // Visual indication that terminal is focused
    this.container.querySelector('.retro-terminal').classList.add('focused');
    
    // Focus hidden input for mobile keyboard
    if (this.hiddenInput) {
      this.hiddenInput.focus();
    }
  }

  scrollToBottom() {
    /**
     * Scroll terminal output to the bottom
     * Uses requestAnimationFrame for smooth scrolling
     */
    requestAnimationFrame(() => {
      if (this.outputElement) {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
      }
    });
  }

  hasFocus() {
    return this.container.querySelector('.retro-terminal').classList.contains('focused');
  }
}

// Initialize when DOM is ready using the DOMInitializer utility
window.onDOMReady(() => {
  const main = document.querySelector('.main');
  if (main) {
    // Initialize filesystem if not already done
    if (!window.virtualFilesystem) {
      window.virtualFilesystem = new VirtualFilesystem();
    }
    window.retroTerminal = new RetroTerminal(main);
  }
}, 1); // Priority 1 - initialize terminal first