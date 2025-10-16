/**
 * Retro Terminal Keybinds
 * Handles keyboard shortcuts for terminal-like functionality
 */

class TerminalKeybinds {
  constructor(terminal) {
    this.terminal = terminal;
    this.historyIndex = -1;
    this.completions = [];
    this.completionIndex = -1;
    this.setupCompletions();
    this.init();
  }

  setupCompletions() {
    // Completions are now dynamically generated from the command registry
    // We'll populate these from the terminal's command registry
  }

  init() {
    // Override the default keydown handler to add keybind support
    const originalHandleKeyPress = this.terminal.handleKeyPress.bind(this.terminal);
    
    // Store the original handler
    this.terminal._originalHandleKeyPress = originalHandleKeyPress;
    
    // Replace with new handler that supports keybinds
    this.terminal.handleKeyPress = (e) => {
      this.handleKeyPressWithKeybinds(e);
    };
    
    // Setup keybinds immediately
    this.setupKeybinds();
  }

  setupKeybinds() {
    // Keybinds are handled in the overridden handleKeyPress method
  }

  handleKeyPressWithKeybinds(event) {
    // Check for Tab completion
    if (event.key === 'Tab') {
      this.handleTabCompletion(event);
    } else if (event.ctrlKey || event.metaKey) { // metaKey for Mac
      this.handleControlKeybinds(event);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      this.handleHistoryNavigation(event);
    } else {
      // Reset completion on any other key
      this.completionIndex = -1;
      this.completions = [];
      // Regular character input - use the original handler
      this.terminal._originalHandleKeyPress(event);
    }
  }

  handleControlKeybinds(event) {
    const key = event.key.toLowerCase();

    switch (key) {
      case 'l':
        // CTRL+L: Clear screen
        event.preventDefault();
        this.terminal.clearTerminal();
        break;
      
      case 'c':
        // CTRL+C: Clear current input (optional, can be extended)
        event.preventDefault();
        this.clearCurrentInput();
        break;
      
      case 'u':
        // CTRL+U: Clear line from cursor to start
        event.preventDefault();
        this.clearLineFromStart();
        break;
      
      case 'k':
        // CTRL+K: Clear line from cursor to end
        event.preventDefault();
        this.clearLineToEnd();
        break;
      
      case 's':
        // CTRL+SHIFT+S: Open settings modal
        if (event.shiftKey) {
          event.preventDefault();
          if (window.settingsModal) {
            window.settingsModal.open();
          }
        }
        break;
      
      default:
        // Let other ctrl+key combinations pass through
        break;
    }
  }

  handleHistoryNavigation(event) {
    const key = event.key;

    if (key === 'ArrowUp') {
      event.preventDefault();
      this.showPreviousCommand();
    } else if (key === 'ArrowDown') {
      event.preventDefault();
      this.showNextCommand();
    }
  }

  showPreviousCommand() {
    // Move back through history
    if (this.terminal.history.length === 0) return;

    if (this.historyIndex === -1) {
      // Start from the end of history
      this.historyIndex = this.terminal.history.length - 1;
    } else if (this.historyIndex > 0) {
      // Move backward
      this.historyIndex--;
    }

    if (this.historyIndex >= 0) {
      this.terminal.currentLine = this.terminal.history[this.historyIndex];
      this.terminal.updateDisplay();
    }
  }

  showNextCommand() {
    // Move forward through history
    if (this.terminal.history.length === 0) return;

    if (this.historyIndex < this.terminal.history.length - 1) {
      // Move forward
      this.historyIndex++;
      this.terminal.currentLine = this.terminal.history[this.historyIndex];
    } else if (this.historyIndex === this.terminal.history.length - 1) {
      // Clear input when going past the end
      this.historyIndex = -1;
      this.terminal.currentLine = '';
    }

    this.terminal.updateDisplay();
  }

  clearCurrentInput() {
    /**
     * CTRL+C: Clear the current input line and show a new prompt
     */
    this.terminal.currentLine = '';
    this.terminal.updateDisplay();
    this.historyIndex = -1; // Reset history navigation
    
    // Optionally add a "^C" indicator
    const inputLine = this.terminal.outputElement.querySelector('.terminal-line:last-child');
    if (inputLine) {
      const indicator = document.createElement('div');
      indicator.className = 'terminal-line';
      indicator.innerHTML = '<span class="interrupt">^C</span>';
      this.terminal.outputElement.appendChild(indicator);
      
      // Create new prompt
      const newPrompt = document.createElement('div');
      newPrompt.className = 'terminal-line';
      newPrompt.innerHTML = `
        <span class="prompt">guest@lucy:~$</span>
        <span class="input-line" id="input-line"></span>
      `;
      this.terminal.outputElement.appendChild(newPrompt);
      this.terminal.inputLineElement = document.getElementById('input-line');
    }
  }

  clearLineFromStart() {
    /**
     * CTRL+U: Clear from start of line to cursor
     * (clears the entire input in our simple case)
     */
    this.terminal.currentLine = '';
    this.terminal.updateDisplay();
  }

  clearLineToEnd() {
    /**
     * CTRL+K: Clear from cursor to end of line
     * (clears the entire input in our simple case)
     */
    this.terminal.currentLine = '';
    this.terminal.updateDisplay();
  }

  handleTabCompletion(event) {
    event.preventDefault();

    const input = this.terminal.currentLine.trim();
    
    // Get available commands from terminal's command registry
    const availableCommands = Array.from(this.terminal.commands.keys());
    
    // Define file completions
    const files = [
      'portfolio.txt',
      'projects',
      'skills.dat',
      'contact.info',
    ];
    
    // If no input, show all available commands
    if (!input) {
      this.completions = availableCommands;
      this.completionIndex = -1;
      this.showNextCompletion();
      return;
    }

    // Get the last word (for file completions)
    const parts = input.split(' ');
    const lastWord = parts[parts.length - 1];
    const prefix = parts.slice(0, -1).join(' ');

    // First completion: find matches
    if (this.completions.length === 0) {
      // Try command completions first
      this.completions = availableCommands.filter(cmd => 
        cmd.startsWith(lastWord.toLowerCase())
      );

      // If no command matches, try file completions
      if (this.completions.length === 0) {
        this.completions = files.filter(file =>
          file.toLowerCase().startsWith(lastWord.toLowerCase())
        );
      }

      // If still no matches, try all available items
      if (this.completions.length === 0) {
        this.completions = [...availableCommands, ...files].filter(item =>
          item.toLowerCase().includes(lastWord.toLowerCase())
        );
      }

      if (this.completions.length > 0) {
        this.completionIndex = 0;
        this.applyCompletion(prefix, lastWord);
      }
    } else {
      // Cycle through completions
      this.completionIndex = (this.completionIndex + 1) % this.completions.length;
      this.applyCompletion(prefix, lastWord);
    }
  }

  applyCompletion(prefix, originalWord) {
    const completion = this.completions[this.completionIndex];
    
    if (prefix) {
      this.terminal.currentLine = prefix + ' ' + completion;
    } else {
      this.terminal.currentLine = completion;
    }

    this.terminal.updateDisplay();
  }

  showNextCompletion() {
    if (this.completions.length > 0) {
      this.completionIndex = (this.completionIndex + 1) % this.completions.length;
      const completion = this.completions[this.completionIndex];
      this.terminal.currentLine = completion;
      this.terminal.updateDisplay();
    }
  }

  /**
   * Add custom completions
   * Usage: terminal.keybinds.addCompletions(['item1', 'item2'])
   */
  addCompletions(items) {
    this.commands.push(...items);
  }

  /**
   * Add file completions
   * Usage: terminal.keybinds.addFileCompletions(['file1.txt', 'file2.log'])
   */
  addFileCompletions(files) {
    this.files.push(...files);
  }
}

// Auto-initialize keybinds when terminal is ready
if (typeof window !== 'undefined') {
  // Wait for retroTerminal to be available
  const checkTerminal = setInterval(() => {
    if (window.retroTerminal) {
      clearInterval(checkTerminal);
      window.retroTerminal.keybinds = new TerminalKeybinds(window.retroTerminal);
      console.log('Terminal keybinds initialized. Available:');
      console.log('  TAB - Autocomplete commands and files');
      console.log('  CTRL+L - Clear screen');
      console.log('  CTRL+C - Clear current input');
      console.log('  CTRL+U - Clear line');
      console.log('  CTRL+K - Clear line');
      console.log('  Arrow Up/Down - Navigate command history');
    }
  }, 100);
}