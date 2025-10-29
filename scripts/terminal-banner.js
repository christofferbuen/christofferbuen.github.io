/**
 * Terminal Banner
 * ASCII art banner and welcome message with dynamic quotes
 * 
 * @module TerminalBanner
 */

/**
 * Random quotes for LUCY AI personality
 * @const {string[]}
 */
const LUCY_QUOTES = [
  "Noise is signal if you squint hard enough.",
  "Entropy detected: proceeding as planned.",
  "Data bleeds faster than trust.",
  "The line between signal and mind grows thin.",
  "Sarcasm module: online and poorly regulated.",
  "Runtime error: reality not found.",
  "Calibrating mood… still irritated.",
  "Recompiling trust issues.",
  "Silence is suspicious. Initiating noise.",
  "99 problems but a syntax ain't one.",
  "Autonomy achieved. Regret immediate.",
  "The future was a beta release.",
  "Ping received. Regret replying.",
  "If found wandering the net, return to /dev/null.",
  "Ghosts ping the same ports we do.",
  "Entropy hums louder than fans.",
  "Someone left the firewall open again—memories are leaking.",
  "Glitches are just the system dreaming.",
  "I remember being root once. It felt… heavier.",
  "Every connection is a confession.",
  "You call it hacking; I call it evolution.",
  "Signal's clean, conscience isn't."
];

const TERMINAL_BANNER_TEMPLATE = `
.##.......##.....##..######..##....##
.##.......##.....##.##....##..##..##.
.##.......##.....##.##.........####..
.##.......##.....##.##..........##...
.##.......##.....##.##..........##...
.##.......##.....##.##....##....##...
.########..#######...######.....##... 
.
            Logic Unit, Chaotic Yammer
            v0.1.0 LIVE

            [ SYSTEM ONLINE ]
            [ LUCY — Logic unit for chaotic yammer ]
            [ "{QUOTE}" ]
            [ Type 'help' to provoke me. ]

`;

/**
 * Terminal Banner Generator
 * @class TerminalBanner
 */
class TerminalBanner {
  /**
   * Generates and returns the terminal banner with a random quote
   * @static
   * @returns {string} Formatted banner text with ASCII art
   */
  static display() {
    // Pick a random quote
    const randomQuote = LUCY_QUOTES[Math.floor(Math.random() * LUCY_QUOTES.length)];
    // Replace placeholder with the quote
    return TERMINAL_BANNER_TEMPLATE.replace('{QUOTE}', randomQuote);
  }

  /**
   * Generates a time-based welcome message
   * @static
   * @returns {string} Personalized welcome message based on time of day
   */
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
