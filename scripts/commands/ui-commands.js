/**
 * UI Commands
 * Commands for controlling UI elements, themes, and effects
 */
class UICommands {
  constructor(terminal) {
    this.terminal = terminal;
    this.registerCommands();
  }

  registerCommands() {
    this.registerThemeCommand();
    this.registerMatrixCommand();
    this.registerSettingsCommand();
    this.registerCrtCommand();
    this.registerBootupCommand();
  }

  registerThemeCommand() {
    this.terminal.registerCommand('theme', 'Switch color scheme', (args) => {
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
  }

  registerMatrixCommand() {
    this.terminal.registerCommand('matrix', 'Toggle Matrix rain effect', () => {
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
  }

  registerSettingsCommand() {
    this.terminal.registerCommand('settings', 'Open settings panel', () => {
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
  }

  registerCrtCommand() {
    this.terminal.registerCommand('crt', 'Open CRT effects tuner', () => {
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
  }

  registerBootupCommand() {
    // Hidden bootup command (not shown in help or tab complete)
    this.terminal.registerCommand('bootup', 'Replay bootup sequence (hidden)', async () => {
      if (this.terminal.bootupSequence) {
        this.terminal.bootupSequence.hasBooted = false;
        this.terminal.bootupSequence.resetBootupState();
        await this.terminal.bootupSequence.playBootupSequence();
        return null;
      }
      return 'Bootup sequence not available.';
    }, [], null, true); // true = hidden command
  }
}

// Initialize when terminal is ready
window.onDOMReady(() => {
  window.domInitializer.waitForGlobal('retroTerminal', (terminal) => {
    window.uiCommands = new UICommands(terminal);
  });
}, 30); // Priority 30 - after file commands

