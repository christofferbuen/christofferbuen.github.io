/**
 * ANSI Color Support for Retro Terminal
 * Allows styling terminal output with colors and text effects
 */

class ANSIColors {
  constructor() {
    this.colors = {
      // Basic colors
      'black': '#000000',
      'red': '#ff0000',
      'green': '#00ff00',
      'yellow': '#ffff00',
      'blue': '#0000ff',
      'magenta': '#ff00ff',
      'cyan': '#00ffff',
      'white': '#ffffff',
      
      // Bright colors
      'bright-black': '#808080',
      'bright-red': '#ff6b6b',
      'bright-green': '#69ff69',
      'bright-yellow': '#ffff69',
      'bright-blue': '#6b69ff',
      'bright-magenta': '#ff69ff',
      'bright-cyan': '#69ffff',
      'bright-white': '#ffffff',
    };

    this.styles = {
      'reset': 'reset',
      'bold': 'font-weight: bold',
      'dim': 'opacity: 0.7',
      'italic': 'font-style: italic',
      'underline': 'text-decoration: underline',
      'reverse': 'filter: invert(1)',
    };
  }

  /**
   * Parse ANSI color codes and return HTML/CSS
   * Usage: ansi.colorize('${red}Error${reset}: Something went wrong')
   */
  colorize(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    // Replace color tags with span elements
    let html = text;

    // Handle color codes
    Object.entries(this.colors).forEach(([colorName, colorValue]) => {
      const regex = new RegExp(`\\$\\{${colorName}\\}`, 'g');
      html = html.replace(regex, `<span style="color: ${colorValue}">`);
    });

    // Handle style codes
    Object.entries(this.styles).forEach(([styleName, styleValue]) => {
      const regex = new RegExp(`\\$\\{${styleName}\\}`, 'g');
      if (styleName === 'reset') {
        html = html.replace(regex, '</span>');
      } else {
        html = html.replace(regex, `<span style="${styleValue}">`);
      }
    });

    // Close any unclosed spans
    const openSpans = (html.match(/<span/g) || []).length;
    const closeSpans = (html.match(/<\/span>/g) || []).length;
    for (let i = 0; i < openSpans - closeSpans; i++) {
      html += '</span>';
    }

    return html;
  }

  /**
   * Helper methods for common colors
   */
  red(text) {
    return `${'{red}'}${text}${'{reset}'}`;
  }

  green(text) {
    return `${'{green}'}${text}${'{reset}'}`;
  }

  yellow(text) {
    return `${'{yellow}'}${text}${'{reset}'}`;
  }

  cyan(text) {
    return `${'{cyan}'}${text}${'{reset}'}`;
  }

  magenta(text) {
    return `${'{magenta}'}${text}${'{reset}'}`;
  }

  blue(text) {
    return `${'{blue}'}${text}${'{reset}'}`;
  }

  bold(text) {
    return `${'{bold}'}${text}${'{reset}'}`;
  }

  dim(text) {
    return `${'{dim}'}${text}${'{reset}'}`;
  }
}

// Make it globally available
window.ANSIColors = ANSIColors;