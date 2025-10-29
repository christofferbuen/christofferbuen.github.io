# Retro Terminal Portfolio

A cyberpunk-themed portfolio website with a retro terminal interface, complete with CRT effects, customizable color schemes, and Unix-like commands.

![Terminal Portfolio](https://img.shields.io/badge/Terminal-Retro-00ff00?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Features

- 🖥️ **Retro CRT Effects**: Authentic scanlines, phosphor glow, and screen curvature
- 🎨 **Multiple Color Schemes**: Classic terminal themes (Amber, Green, Phosphor, Matrix, etc.)
- ⌨️ **Unix-like Commands**: ls, cd, cat, grep, tree, and more
- 🎵 **Optional Sound Effects**: Keyboard typing sounds (configurable)
- 📁 **Virtual Filesystem**: Navigate projects and content like a real terminal
- 🌈 **Matrix Rain**: Optional Matrix-style background effect
- ⚙️ **Settings Panel**: Customize effects, sounds, and appearance
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yourrepo.git
   cd yourrepo
   ```

2. **Option A: Simple HTTP Server (Python)**
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

3. **Option B: Live Reload Server (Recommended for Development)**
   ```bash
   pip install livereload
   python serve.py
   ```
   Opens automatically at `http://localhost:9999` with live reload on file changes.

### GitHub Pages Deployment

This site is ready to deploy to GitHub Pages:

1. Push to your GitHub repository
2. Go to Settings → Pages
3. Select `main` branch as source
4. Your site will be live at `https://yourusername.github.io`

## 🎨 Customization

### Update Your Portfolio Information

Edit `scripts/portfolio-data.js` to customize your information:

```javascript
const portfolioData = {
  name: 'Your Name',
  title: 'Your Title',
  bio: 'Your bio here',
  social: [
    { name: 'GitHub', url: 'https://github.com/yourusername' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/yourusername' },
    { name: 'Email', url: 'mailto:you@example.com' },
  ],
  projects: [
    {
      title: 'Project Name',
      description: 'Project description',
      tags: ['Tag1', 'Tag2'],
      url: 'https://project-url.com',
    },
    // Add more projects...
  ],
};
```

### Add Custom Commands

Create a file based on `scripts/terminal-custom-commands.example.js`:

```javascript
retroTerminal.registerCommand('hello', 'Say hello', () => {
  return 'Hello, World!';
});
```

Then include it in `index.html`:
```html
<script src="scripts/terminal-custom-commands.js"></script>
```

### Configure Sound Effects

Based on `scripts/retro-terminal-sound-setup.example.js`, create your own sound setup:

```javascript
terminal.setSoundPath('spacebar', 'sounds/spacebar.mp3');
terminal.setSoundPath('enter', 'sounds/enter.mp3');
await terminal.reloadSounds();
```

### Customize Color Schemes

Edit `scripts/terminal-colorschemes.js` to add or modify themes:

```javascript
schemes: {
  'my-theme': {
    name: 'My Custom Theme',
    description: 'My awesome color scheme',
    background: '#1a1a1a',
    foreground: '#00ff00',
    accent: '#ffaa00',
    // ... more colors
  }
}
```

## 📁 Project Structure

```
.
├── index.html                 # Main HTML file
├── serve.py                   # Development server with live reload
├── styles/
│   ├── base.css              # Base styles and layout
│   ├── controls.css          # UI controls and buttons
│   ├── crt-effects.css       # CRT screen effects
│   ├── retro-terminal.css    # Terminal-specific styles
│   └── settings-modal.css    # Settings panel styles
├── scripts/
│   ├── portfolio-data.js     # ✏️ EDIT THIS: Your portfolio content
│   ├── portfolio-renderer.js # Renders portfolio to DOM
│   ├── retro-terminal.js     # Core terminal functionality
│   ├── terminal-banner.js    # Startup banner
│   ├── bootup-sequence.js    # Boot animation
│   ├── crt-effects.js        # CRT effect controls
│   ├── virtual-filesystem.js # Virtual file system
│   ├── unix-commands.js      # Unix-like commands
│   ├── terminal-keybinds.js  # Keyboard shortcuts
│   ├── terminal-colorschemes.js # Color theme system
│   ├── terminal-glitch.js    # Glitch effects
│   ├── matrix-rain.js        # Matrix background effect
│   ├── settings-modal.js     # Settings UI
│   ├── ansi-colors.js        # ANSI color support
│   └── *.example.js          # Example/template files
└── old/                       # Legacy files (can be removed)
```

## ⌨️ Available Commands

Type `help` in the terminal to see all available commands:

- `ls` - List directory contents
- `cd` - Change directory
- `cat` - Display file contents
- `pwd` - Print working directory
- `tree` - Display directory tree
- `clear` - Clear the terminal screen
- `whoami` - Display user information
- `neofetch` - Display system information
- `theme` - Change color scheme
- `matrix` - Toggle Matrix rain effect
- `glitch` - Trigger glitch effect
- `settings` - Open settings panel
- `man <command>` - Show command documentation

### Keyboard Shortcuts

- `Tab` - Autocomplete commands and files
- `Ctrl+L` - Clear screen
- `Ctrl+C` - Clear current input
- `Ctrl+U` / `Ctrl+K` - Clear line
- `Arrow Up/Down` - Navigate command history

## 🎮 Interactive Features

### Settings Panel
Press `Ctrl+,` or type `settings` to open the settings panel where you can:
- Toggle CRT effects (scanlines, glow, curvature)
- Enable/disable sound effects
- Adjust sound volume
- Toggle Matrix rain effect
- Save preferences to localStorage

### Easter Eggs
Try typing these commands:
- `matrix` - Toggle Matrix rain background
- `glitch` - Trigger a glitch effect
- `neofetch` - See system info in retro style

## 🛠️ Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS Animations** - Hardware-accelerated effects
- **Web Audio API** - Sound effects (optional)
- **LocalStorage API** - Persistent settings

## 📝 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎨 Credits

Inspired by classic terminal interfaces and 1980s-1990s CRT monitors.

---

**Made with ❤️ and nostalgia for the command line**

