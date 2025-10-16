/**
 * Retro Terminal Typing System
 * Creates a terminal-style interface with authentic typing sounds
 */

class RetroTerminal {
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
     * Register default commands
     * Format: this.registerCommand(name, description, handler, aliases, documentation)
     */
    this.registerCommand('help', 'Show available commands', () => {
      const commands = Array.from(this.commands.values());
      const seen = new Set();
      const lines = ['AVAILABLE COMMANDS:', ''];
      
      // Build help text with proper formatting (avoid duplicates and hidden commands)
      commands.forEach(cmd => {
        if (!seen.has(cmd.name) && !cmd.hidden) {
          seen.add(cmd.name);
          // Use HTML directly instead of color codes
          lines.push(`  <span style="color: #00ffff">${cmd.name.padEnd(12)}</span> - ${cmd.description}`);
        }
      });
      
      lines.push('');
      lines.push('Use "man &lt;command&gt;" for more information on a command.');
      lines.push('<span style="opacity: 0.5">Hint: Some commands are hidden... try exploring!</span>');
      
      return lines.join('\n');
    });

    this.registerCommand('man', 'Show manual page for a command', (args) => {
      if (!args) {
        return 'Usage: man <command>\nUse "help" to see available commands.';
      }

      const cmdName = args.trim().toLowerCase();
      const cmdObj = this.commands.get(cmdName);

      if (!cmdObj) {
        return `man: No manual entry for '${cmdName}'`;
      }

      // Build man page from command documentation
      const lines = [
        `${cmdName.toUpperCase()}`,
        '',
        'DESCRIPTION',
        `  ${cmdObj.description}`,
      ];

      if (cmdObj.documentation) {
        lines.push('');
        lines.push('USAGE');
        lines.push(`  ${cmdObj.documentation.usage || cmdName}`);
        
        if (cmdObj.documentation.examples) {
          lines.push('');
          lines.push('EXAMPLES');
          cmdObj.documentation.examples.forEach(example => {
            lines.push(`  ${example}`);
          });
        }

        if (cmdObj.documentation.notes) {
          lines.push('');
          lines.push('NOTES');
          cmdObj.documentation.notes.forEach(note => {
            lines.push(`  ${note}`);
          });
        }

        if (cmdObj.documentation.options) {
          lines.push('');
          lines.push('OPTIONS');
          Object.entries(cmdObj.documentation.options).forEach(([opt, desc]) => {
            lines.push(`  ${opt.padEnd(20)} ${desc}`);
          });
        }
      } else {
        lines.push('');
        lines.push('(No additional documentation available)');
      }

      if (cmdObj.aliases && cmdObj.aliases.length > 0) {
        lines.push('');
        lines.push('ALIASES');
        lines.push(`  ${cmdObj.aliases.join(', ')}`);
      }

      return lines.join('\n');
    }, ['help-manual', 'info']);

    this.registerCommand('clear', 'Clear the terminal screen', () => {
      this.clearTerminal();
      return null; // Return null to skip normal output
    }, [], {
      usage: 'clear',
      description: 'Clears the terminal screen and displays a fresh prompt.',
      examples: ['clear'],
      notes: ['Shortcut: CTRL+L']
    });

    this.registerCommand('date', 'Show current date and time', () => {
      return new Date().toLocaleString();
    }, [], {
      usage: 'date',
      description: 'Displays the current date and time.',
      examples: ['date']
    });

    this.registerCommand('whoami', 'Show current user', () => {
      return 'guest';
    }, [], {
      usage: 'whoami',
      description: 'Returns the current user name.',
      examples: ['whoami']
    });

    this.registerCommand('ls', 'List files', () => {
      return this.filesystem.listDirectory('.');
    }, [], {
      usage: 'ls [directory]',
      description: 'Lists files and directories in the current directory.',
      examples: ['ls', 'ls projects/'],
      notes: ['Use "cd" to change directories (coming soon)']
    });

    this.registerCommand('cat', 'Display file contents', (args) => {
      if (!args) {
        return 'Usage: cat <filename>';
      }
      const result = this.filesystem.readFile(args);
      
      // Check if result is an image object
      if (result && typeof result === 'object' && result.isImage) {
        // Return special marker that we'll handle in executeCommand
        return result;
      }
      
      return result;
    }, [], {
      usage: 'cat <filename>',
      description: 'Display the contents of a file or image.',
      examples: ['cat portfolio.txt', 'cat README.md', 'cat image.jpg'],
      options: {
        'portfolio.txt': 'Main portfolio file',
        'README.md': 'Project README',
        'contact.info': 'Contact information',
        'skills.dat': 'Skills database'
      }
    });

    this.registerCommand('echo', 'Echo text', (args) => {
      return args || '';
    }, [], {
      usage: 'echo <text>',
      description: 'Displays text to the terminal.',
      examples: ['echo Hello World', 'echo "This is a test"'],
      notes: ['Outputs exactly what you input']
    });

    this.registerCommand('matrix', 'Toggle Matrix rain effect', () => {
      if (window.matrixRain) {
        window.matrixRain.toggle();
        const status = window.matrixRain.config.enabled ? 'enabled' : 'disabled';
        return `Matrix rain effect ${status}`;
      }
      return 'Matrix rain not initialized';
    }, [], {
      usage: 'matrix',
      description: 'Toggle the Matrix rain effect on/off.',
      examples: ['matrix']
    }, true); // Hidden easter egg command!

    this.registerCommand('settings', 'Open settings panel', () => {
      if (window.settingsModal) {
        window.settingsModal.open();
        return null; // Don't print output
      }
      return 'Settings panel not available';
    }, ['config', 'preferences'], {
      usage: 'settings',
      description: 'Opens the system settings panel.',
      examples: ['settings', 'config'],
      notes: ['Aliases: config, preferences']
    });

    this.registerCommand('crt', 'Open CRT effects tuner', () => {
      if (window.crtEffects && window.crtEffects.tunerPanel) {
        const panel = window.crtEffects.tunerPanel;
        const button = window.crtEffects.tunerButton;
        const isHidden = panel.hasAttribute('hidden');
        
        if (isHidden) {
          panel.removeAttribute('hidden');
          button.setAttribute('aria-expanded', 'true');
          return 'CRT tuner opened';
        } else {
          panel.setAttribute('hidden', '');
          button.setAttribute('aria-expanded', 'false');
          return 'CRT tuner closed';
        }
      }
      return 'CRT tuner not available';
    }, ['tuner', 'crtfx'], {
      usage: 'crt',
      description: 'Opens the CRT effects tuner panel.',
      examples: ['crt', 'tuner'],
      notes: ['Aliases: tuner, crtfx']
    });

    this.registerCommand('theme', 'Switch color scheme', (args) => {
      if (!window.colorSchemes) {
        return 'Color schemes not initialized';
      }

      if (!args) {
        // List available themes
        const schemes = window.colorSchemes.getAllSchemes();
        const lines = ['AVAILABLE THEMES:', ''];
        schemes.forEach(scheme => {
          const current = scheme.id === window.colorSchemes.currentScheme ? ' (current)' : '';
          lines.push(`  ${scheme.id.padEnd(18)} - ${scheme.description}${current}`);
        });
        return lines.join('\n');
      }

      const themeName = args.toLowerCase().trim();
      if (window.colorSchemes.setScheme(themeName)) {
        return `Theme changed to: ${window.colorSchemes.getScheme(themeName).name}`;
      } else {
        return `Theme not found: ${themeName}. Use "theme" to see available themes.`;
      }
    }, ['color', 'colorscheme'], {
      usage: 'theme [name]',
      description: 'Switch between available color schemes.',
      examples: ['theme', 'theme amber', 'theme hacker-green', 'theme phosphor-green'],
      options: {
        'oldschool': 'Classic green CRT monitor',
        'vibrant': 'Bright neon cyberpunk style',
        'amber': 'Classic 1980s amber CRT terminals',
        'phosphor-green': '1970s-80s IBM 3270 phosphor green',
        'apple-ii': '1977 Apple II monochrome green',
        'tektronix': '1980s high-end workstation white',
        'monochrome': 'VT100 Unix terminals - pure black and white',
        'hacker-green': '1990s Hollywood hacker movie vibe',
        'cold-blue': '1980s IBM data center mainframe style',
        'sepia': 'Aged vintage paper aesthetic'
      },
      notes: ['Theme preference is saved to local storage. Use "theme" with no arguments to list all available themes.']
    });

    // Hidden bootup command (not shown in help or tab complete)
    this.registerCommand('bootup', 'Replay bootup sequence (hidden)', async () => {
      if (this.bootupSequence) {
        this.bootupSequence.hasBooted = false;
        this.bootupSequence.resetBootupState();
        await this.bootupSequence.playBootupSequence();
        return null;
      }
      return 'Bootup sequence not available.';
    }, [], null, true); // true = hidden command

    this.registerCommand('cd', 'Change directory', (args) => {
      if (!args || args === '/') {
        this.currentDirectory = '.';
        return null;
      }

      if (args === '..') {
        this.currentDirectory = '.';
        return null;
      }

      const targetDir = args.toLowerCase().trim();
      const dirWithSlash = targetDir.endsWith('/') ? targetDir : targetDir + '/';
      
      // Check if directory exists
      if (this.filesystem.getDirectory(dirWithSlash)) {
        this.currentDirectory = dirWithSlash;
        return null;
      } else {
        return `cd: ${args}: No such directory`;
      }
    }, [], {
      usage: 'cd <directory>',
      description: 'Change the current directory.',
      examples: ['cd projects', 'cd secrets', 'cd ..'],
      notes: ['Use ".." to go back to root']
    });

    this.registerCommand('tree', 'Display directory structure', (args) => {
      const lines = [];
      const items = this.filesystem.getDirectory('.');
      
      lines.push('.');
      items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const prefix = isLast ? '└── ' : '├── ';
        lines.push(prefix + item);
      });

      return lines.join('\n');
    }, [], {
      usage: 'tree',
      description: 'Display directory structure as a tree.',
      examples: ['tree'],
      notes: ['Shows all files and directories from root']
    });
  }

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
    
    console.log('RetroTerminal initialized. Custom sound paths can be set via terminal.setSoundPath()');
  }

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
    try {
      const response = await fetch(url);
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

  registerCommand(name, description, handler, aliases = [], documentation = null, hidden = false) {
    /**
     * Register a new command
     * 
     * Usage:
     *   terminal.registerCommand('greet', 'Say hello', () => 'Hello, world!');
     *   
     *   terminal.registerCommand('test', 'Test command', (args) => {
     *     return `You said: ${args}`;
     *   }, ['t'], {
     *     usage: 'test <message>',
     *     examples: ['test hello', 'test "hello world"'],
     *     notes: ['This is optional'],
     *     options: {
     *       '-v': 'Verbose mode'
     *     }
     *   });
     * 
     *   // Hidden command (not in help or autocomplete)
     *   terminal.registerCommand('secret', 'Hidden command', () => 'Found me!', [], null, true);
     */
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

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.main');
    if (main) {
      // Initialize filesystem if not already done
      if (!window.virtualFilesystem) {
        window.virtualFilesystem = new VirtualFilesystem();
      }
      window.retroTerminal = new RetroTerminal(main);
    }
  });
} else {
  const main = document.querySelector('.main');
  if (main) {
    // Initialize filesystem if not already done
    if (!window.virtualFilesystem) {
      window.virtualFilesystem = new VirtualFilesystem();
    }
    window.retroTerminal = new RetroTerminal(main);
  }
}