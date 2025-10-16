/**
 * Terminal Banner
 * ASCII art banner and welcome message
 */

const TERMINAL_BANNER = `
  ██▓     █    ██  ▄████▄ ▓██   ██▓
  ▓██▒    ██  ▓██▒▒██▀ ▀██▒▒██  ██▒
  ▒██░   ▓██  ▒██░▒▓█    ▄ ░ ▀██▄▄░▒
  ▒██░   ▓███  ░██░▒▓▓▄ ▄██▒  ░▀▀█▄ ▒
  ░██████▒▒░░  ░██░▒ ▓███▀ ░  ░  ▐▌▒
  ░ ▒░▓  ░░     ░░░░ ░▒ ▒  ░░░  ░    
  ░ ░ ▒  ░ ░    ░░  ░  ▒   ░░  ░    
    ░ ░    ░░   ░  ░          ░    
      ░     ░  ░░ ░ ░            
            ░  ░               

  Linguistic Universal Computing Yield Engine
  v1.0.0 LIVE

  [ SYSTEM INITIALIZED ]
  [ "The future is already here—it's just not evenly distributed" ]
  [ "I didn't expect LUCY to say that..." | "Hack the planet!" ]
  [ Type 'help' for available commands | 'man <cmd>' for documentation ]

`;

class TerminalBanner {
  static display() {
    return TERMINAL_BANNER;
  }

  static getWelcomeMessage() {
    const hour = new Date().getHours();
    const userName = localStorage.getItem('terminal-user') || 'wanderer';
    
    let greeting = "Welcome back";
    let emoji = "🌙";

    if (hour < 5) {
      greeting = "The night owl awakens";
      emoji = "🦉";
    } else if (hour < 12) {
      greeting = "Good morning, rise and grind";
      emoji = "☀️";
    } else if (hour < 17) {
      greeting = "Good afternoon, coding vibes";
      emoji = "🎯";
    } else if (hour < 20) {
      greeting = "Golden hour hacker mode";
      emoji = "🌅";
    } else {
      greeting = "Night mode activated";
      emoji = "🌙";
    }

    return `${emoji} ${greeting}, ${userName}!`;
  }
}

window.TerminalBanner = TerminalBanner;
