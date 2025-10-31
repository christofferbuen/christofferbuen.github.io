/**
 * Base Terminal Commands
 * Essential commands that every terminal should have
 */
class BaseCommands {
  constructor(terminal) {
    this.terminal = terminal;
    this.registerCommands();
  }

  registerCommands() {
    this.registerHelpCommand();
    this.registerManCommand();
    this.registerClearCommand();
    this.registerDateCommand();
    this.registerWhoamiCommand();
    this.registerEchoCommand();
  }

  registerHelpCommand() {
    this.terminal.registerCommand('help', 'Show available commands', () => {
      const commands = Array.from(this.terminal.commands.values());
      const seen = new Set();
      const lines = ['AVAILABLE COMMANDS:', ''];
      
      // Build help text with proper formatting (avoid duplicates and hidden commands)
      commands.forEach(cmd => {
        if (!seen.has(cmd.name) && !cmd.hidden) {
          seen.add(cmd.name);
          lines.push(`  <span style="color: #00ffff">${cmd.name.padEnd(12)}</span> - ${cmd.description}`);
        }
      });
      
      lines.push('');
      lines.push('Use "man &lt;command&gt;" for more information on a command.');
      lines.push('<span style="opacity: 0.5">Hint: Some commands are hidden... try exploring!</span>');
      
      return lines.join('\n');
    });
  }

  registerManCommand() {
    this.terminal.registerCommand('man', 'Show manual page for a command', (args) => {
      if (!args) {
        return 'Usage: man <command>\nUse "help" to see available commands.';
      }

      const cmdName = args.trim().toLowerCase();
      const cmdObj = this.terminal.commands.get(cmdName);

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
  }

  registerClearCommand() {
    this.terminal.registerCommand('clear', 'Clear the terminal screen', () => {
      this.terminal.clearTerminal();
      return null; // Return null to skip normal output
    }, [], {
      usage: 'clear',
      description: 'Clears the terminal screen and displays a fresh prompt.',
      examples: ['clear'],
      notes: ['Shortcut: CTRL+L']
    });
  }

  registerDateCommand() {
    this.terminal.registerCommand('date', 'Show current date and time', () => {
      return new Date().toLocaleString();
    }, [], {
      usage: 'date',
      description: 'Displays the current date and time.',
      examples: ['date']
    });
  }

  registerWhoamiCommand() {
    this.terminal.registerCommand('whoami', 'Show current user', () => {
      return 'guest';
    }, [], {
      usage: 'whoami',
      description: 'Returns the current user name.',
      examples: ['whoami']
    });
  }

  registerEchoCommand() {
    this.terminal.registerCommand('echo', 'Echo text', (args) => {
      return args || '';
    }, [], {
      usage: 'echo <text>',
      description: 'Displays text to the terminal.',
      examples: ['echo Hello World', 'echo "This is a test"'],
      notes: ['Outputs exactly what you input']
    });
  }
}

// Initialize when terminal is ready
window.onDOMReady(() => {
  window.domInitializer.waitForGlobal('retroTerminal', (terminal) => {
    window.baseCommands = new BaseCommands(terminal);
  });
}, 10); // Priority 10 - early

