/**
 * Terminal Color Scheme Manager
 * Provides multiple retro terminal color themes and handles theme switching
 * Includes classic CRT monitor colors, cyberpunk themes, and vintage terminal aesthetics
 * 
 * @class TerminalColorSchemes
 */
class TerminalColorSchemes {
  /**
   * Creates a new TerminalColorSchemes instance with predefined themes
   */
  constructor() {
    this.schemes = {
      'oldschool': {
        name: 'Old School',
        description: 'Classic CRT monitor green',
        colors: {
          bg: '#0c1d12',
          fg: '#cfe',
          accent: '#00ff99',
          scanlineDark: 0.25,
          grilleR: 0.06,
          grilleG: 0.02,
          grilleB: 0.06,
          flickerIntensity: 0.05,
          chromaBlue: 'rgba(0,30,255,.5)',
          chromaRed: 'rgba(255,0,80,.3)',
        },
        effects: {
          scanlines: true,
          sweep: true,
          flicker: true,
          chroma: true,
        }
      },
      'vibrant': {
        name: 'Vibrant',
        description: 'Bright neon cyberpunk style',
        colors: {
          bg: '#0a0e27',
          fg: '#00ffff',
          accent: '#ff00ff',
          scanlineDark: 0.08,
          grilleR: 0.02,
          grilleG: 0.01,
          grilleB: 0.03,
          flickerIntensity: 0.03,
          chromaBlue: 'rgba(0,255,255,.2)',
          chromaRed: 'rgba(255,0,255,.15)',
        },
        effects: {
          scanlines: true,
          sweep: true,
          flicker: true,
          chroma: true,
        }
      },
      'amber': {
        name: 'Amber Monochrome',
        description: 'Classic 1980s amber CRT terminals',
        colors: {
          bg: '#1a0f0a',
          fg: '#ffb81c',
          accent: '#ffcc33',
          scanlineDark: 0.35,
          grilleR: 0.08,
          grilleG: 0.04,
          grilleB: 0.01,
          flickerIntensity: 0.06,
          chromaBlue: 'rgba(255,100,0,.1)',
          chromaRed: 'rgba(255,150,0,.1)',
        },
        effects: {
          scanlines: true,
          sweep: true,
          flicker: true,
          chroma: false,
        }
      },
      'phosphor-green': {
        name: 'Phosphor Green',
        description: '1970s-80s IBM 3270 phosphor green',
        colors: {
          bg: '#0a0f0a',
          fg: '#00b050',
          accent: '#00ff41',
          scanlineDark: 0.20,
          grilleR: 0.01,
          grilleG: 0.05,
          grilleB: 0.01,
          flickerIntensity: 0.04,
          chromaBlue: 'rgba(0,100,0,.05)',
          chromaRed: 'rgba(0,180,0,.05)',
        },
        effects: {
          scanlines: true,
          sweep: true,
          flicker: true,
          chroma: false,
        }
      },
      'apple-ii': {
        name: 'Apple II Green',
        description: '1977 Apple II monochrome green',
        colors: {
          bg: '#000000',
          fg: '#1db91d',
          accent: '#2dff2d',
          scanlineDark: 0.15,
          grilleR: 0.02,
          grilleG: 0.08,
          grilleB: 0.02,
          flickerIntensity: 0.08,
          chromaBlue: 'rgba(0,150,0,.1)',
          chromaRed: 'rgba(0,200,0,.1)',
        },
        effects: {
          scanlines: true,
          sweep: true,
          flicker: true,
          chroma: false,
        }
      },
      'tektronix': {
        name: 'Tektronix Display',
        description: '1980s high-end workstation white',
        colors: {
          bg: '#0a0a0a',
          fg: '#ffffff',
          accent: '#e0e0e0',
          scanlineDark: 0.05,
          grilleR: 0.02,
          grilleG: 0.02,
          grilleB: 0.04,
          flickerIntensity: 0.02,
          chromaBlue: 'rgba(100,150,255,.08)',
          chromaRed: 'rgba(200,100,100,.05)',
        },
        effects: {
          scanlines: true,
          sweep: true,
          flicker: false,
          chroma: true,
        }
      },
      'monochrome': {
        name: 'Classic Monochrome',
        description: 'VT100 Unix terminals - pure black and white',
        colors: {
          bg: '#000000',
          fg: '#ffffff',
          accent: '#e0e0e0',
          scanlineDark: 0.20,
          grilleR: 0.03,
          grilleG: 0.03,
          grilleB: 0.03,
          flickerIntensity: 0.03,
          chromaBlue: 'rgba(100,100,100,.05)',
          chromaRed: 'rgba(100,100,100,.05)',
        },
        effects: {
          scanlines: true,
          sweep: false,
          flicker: true,
          chroma: false,
        }
      },
      'hacker-green': {
        name: 'Hacker Neon Green',
        description: '1990s Hollywood hacker movie vibe',
        colors: {
          bg: '#001a00',
          fg: '#39ff14',
          accent: '#66ff1a',
          scanlineDark: 0.30,
          grilleR: 0.01,
          grilleG: 0.08,
          grilleB: 0.01,
          flickerIntensity: 0.07,
          chromaBlue: 'rgba(0,255,0,.3)',
          chromaRed: 'rgba(50,255,0,.2)',
        },
        effects: {
          scanlines: true,
          sweep: true,
          flicker: true,
          chroma: true,
        }
      },
      'cold-blue': {
        name: 'Cold Blue',
        description: '1980s IBM data center mainframe style',
        colors: {
          bg: '#000a2e',
          fg: '#6dd5ed',
          accent: '#00ffff',
          scanlineDark: 0.18,
          grilleR: 0.01,
          grilleG: 0.03,
          grilleB: 0.06,
          flickerIntensity: 0.04,
          chromaBlue: 'rgba(100,200,255,.15)',
          chromaRed: 'rgba(50,100,200,.08)',
        },
        effects: {
          scanlines: true,
          sweep: true,
          flicker: true,
          chroma: true,
        }
      },
      'sepia': {
        name: 'Warm Sepia',
        description: 'Aged vintage paper aesthetic',
        colors: {
          bg: '#1a1410',
          fg: '#d4a574',
          accent: '#e8c4a0',
          scanlineDark: 0.35,
          grilleR: 0.06,
          grilleG: 0.03,
          grilleB: 0.01,
          flickerIntensity: 0.05,
          chromaBlue: 'rgba(200,150,100,.1)',
          chromaRed: 'rgba(210,140,80,.12)',
        },
        effects: {
          scanlines: true,
          sweep: true,
          flicker: true,
          chroma: false,
        }
      }
    };

    this.currentScheme = 'oldschool';
    this.loadSchemeFromStorage();
  }

  loadSchemeFromStorage() {
    const saved = StorageManager.get('terminal-colorscheme');
    if (saved && this.schemes[saved]) {
      this.currentScheme = saved;
    }
  }

  saveSchemeToStorage() {
    StorageManager.set('terminal-colorscheme', this.currentScheme);
  }

  setScheme(schemeName) {
    if (!this.schemes[schemeName]) {
      console.warn(`Scheme "${schemeName}" not found`);
      return false;
    }

    this.currentScheme = schemeName;
    this.saveSchemeToStorage();
    this.applyScheme();
    return true;
  }

  applyScheme() {
    const scheme = this.schemes[this.currentScheme];
    if (!scheme) return;

    const root = document.documentElement;
    const colors = scheme.colors;

    // Apply colors
    root.style.setProperty('--bg', colors.bg);
    root.style.setProperty('--fg', colors.fg);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--scanline-dark', colors.scanlineDark);
    root.style.setProperty('--grille-r', colors.grilleR);
    root.style.setProperty('--grille-g', colors.grilleG);
    root.style.setProperty('--grille-b', colors.grilleB);
    root.style.setProperty('--flicker-intensity', colors.flickerIntensity);
    root.style.setProperty('--chroma-blue', colors.chromaBlue);
    root.style.setProperty('--chroma-red', colors.chromaRed);

    // Apply effects if CRT effects exist
    if (window.crtEffects) {
      Object.entries(scheme.effects).forEach(([effect, enabled]) => {
        window.crtEffects.setEffect(effect, enabled);
      });
    }

    console.log(`Color scheme changed to: ${scheme.name}`);
  }

  getScheme(schemeName) {
    return this.schemes[schemeName];
  }

  getAllSchemes() {
    return Object.entries(this.schemes).map(([key, scheme]) => ({
      id: key,
      name: scheme.name,
      description: scheme.description
    }));
  }

  addScheme(schemeName, schemeData) {
    this.schemes[schemeName] = schemeData;
  }

  getCurrentScheme() {
    return {
      id: this.currentScheme,
      ...this.schemes[this.currentScheme]
    };
  }
}

// Make it globally available
window.TerminalColorSchemes = TerminalColorSchemes;

// Initialize color schemes when DOM is ready using DOMInitializer
window.onDOMReady(() => {
  window.colorSchemes = new TerminalColorSchemes();
  window.colorSchemes.applyScheme();
}, 5); // Priority 5 - early initialization