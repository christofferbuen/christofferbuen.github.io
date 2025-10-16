# Retro Terminal - Architecture & System Design

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER WINDOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   RETRO TERMINAL UI                       │   │
│  │  (HTML/CSS/DOM - Terminal Display & Input)              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              △                                    │
│                              │                                    │
│  ┌────────────────────────────┴────────────────────────────┐    │
│  │         CORE SYSTEMS LAYER (JavaScript)                 │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │ RetroTerminal                                   │   │    │
│  │  │ ├─ Command Registry (Map)                       │   │    │
│  │  │ ├─ Command Execution Engine                     │   │    │
│  │  │ ├─ Input/Output Processing                      │   │    │
│  │  │ ├─ History Tracking                             │   │    │
│  │  │ └─ UI State Management                          │   │    │
│  │  └─────────────────────────────────────────────────┘   │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │ VirtualFilesystem                               │   │    │
│  │  │ ├─ File Operations (CRUD)                       │   │    │
│  │  │ ├─ Directory Management                         │   │    │
│  │  │ ├─ File Type Detection (Images)                 │   │    │
│  │  │ └─ JSON-based Storage                           │   │    │
│  │  └─────────────────────────────────────────────────┘   │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │ UnixCommands (34 commands)                      │   │    │
│  │  │ ├─ Navigation (pwd, cd, ls, tree, find, mkdir) │   │    │
│  │  │ ├─ File Ops (cat, echo, touch, cp, mv, rm)     │   │    │
│  │  │ ├─ Analysis (head, tail, grep, wc, sort)       │   │    │
│  │  │ ├─ System (date, whoami, who, uname, env)      │   │    │
│  │  │ └─ Terminal (clear, help, man, history)        │   │    │
│  │  └─────────────────────────────────────────────────┘   │    │
│  │                                                          │    │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            INPUT/INTERACTION LAYER                        │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │ TerminalKeybinds                                │   │    │
│  │  │ ├─ Command Auto-completion (Tab)                │   │    │
│  │  │ ├─ History Navigation (↑↓)                      │   │    │
│  │  │ ├─ Control Sequences (Ctrl+L/C/U/K)            │   │    │
│  │  │ └─ Settings Shortcut (Ctrl+Shift+S)            │   │    │
│  │  └─────────────────────────────────────────────────┘   │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │ Audio System (KeyboardSounds)                   │   │    │
│  │  │ ├─ Key Press Sounds                             │   │    │
│  │  │ ├─ Enter Sound                                  │   │    │
│  │  │ ├─ Backspace Sound                              │   │    │
│  │  │ └─ Random Typing Sounds                         │   │    │
│  │  └─────────────────────────────────────────────────┘   │    │
│  │                                                          │    │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              VISUAL EFFECTS LAYER                         │   │
│  │                                                          │   │
│  │  ┌──────────────────────────┐  ┌──────────────────────┐ │   │
│  │  │ CRTEffects               │  │ TerminalColorSchemes │ │   │
│  │  │ ├─ Scanlines             │  │ ├─ 10 Color Themes  │ │   │
│  │  │ ├─ Sweep Bar             │  │ ├─ Live Switching   │ │   │
│  │  │ ├─ Flicker Animation     │  │ ├─ Persistence      │ │   │
│  │  │ └─ Chromatic Aberration  │  │ └─ CSS Properties   │ │   │
│  │  └──────────────────────────┘  └──────────────────────┘ │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ TerminalGlitch                                  │   │   │
│  │  │ ├─ Scan Distortion                              │   │   │
│  │  │ ├─ Color Inversion                              │   │   │
│  │  │ └─ Chromatic Shift                              │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              SETTINGS & UI LAYER                          │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ SettingsModal                                   │   │   │
│  │  │ ├─ Theme Selection UI                           │   │   │
│  │  │ ├─ Effect Controls                              │   │   │
│  │  │ ├─ Settings Persistence                         │   │   │
│  │  │ ├─ Real-time Application                        │   │   │
│  │  │ └─ Reset Functionality                          │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ Controls Panel (Bottom Right)                   │   │   │
│  │  │ ├─ Settings Button (⚙)                          │   │   │
│  │  │ ├─ CRT Effects Toggle                           │   │   │
│  │  │ └─ Quick Settings                               │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            PERSISTENCE LAYER (localStorage)              │   │
│  │                                                          │   │
│  │  ├─ terminal-colorscheme: "theme-name"                  │   │
│  │  ├─ terminal-sounds: true/false                         │   │
│  │  ├─ terminal-glitches: true/false                       │   │
│  │  ├─ terminal-cursor-blink: true/false                   │   │
│  │  └─ filesystem: { "files": {...} }                      │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

```
USER INPUT
    │
    ▼
┌─────────────────┐
│ TerminalKeybinds│  ◄─── Intercepts Keyboard Events
└────────┬────────┘
         │
         ├─► Auto-complete (Tab)
         ├─► History Navigation (↑↓)
         ├─► Control Sequences (Ctrl+...)
         │
         ▼
    ┌─────────────────┐
    │ RetroTerminal   │  ◄─── Main Processor
    │ handleKeyPress()│
    └────────┬────────┘
             │
             ├─► Parse Input
             ├─► Execute Command
             │   └─► UnixCommands → handler()
             │
             ▼
    ┌─────────────────────┐
    │ VirtualFilesystem   │  ◄─── File Operations
    │ (if file command)   │
    └────────┬────────────┘
             │
             ├─► Read/Write
             ├─► Create/Delete
             └─► Track Changes
                 │
                 ▼
            ┌──────────────┐
            │ localStorage │  ◄─── Persistence
            └──────────────┘
             │
             ▼
    ┌──────────────────┐
    │ Return Response  │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Render Output        │
    │ (DOM Update)         │
    └────────┬─────────────┘
             │
             ├─► Add Line to Terminal
             ├─► Scroll to Bottom
             ├─► Cursor Updates
             │
             ▼
    ┌───────────────────────┐
    │ Apply Visual Effects  │
    │ (CSS Animations)      │
    └────────┬──────────────┘
             │
             ├─► CRTEffects (scanlines, sweep, etc)
             ├─► ColorScheme (theme colors)
             ├─► GlitchEffects (random distortion)
             │
             ▼
    ┌──────────────┐
    │ Display UI   │
    └──────────────┘
```

## Data Flow: Command Execution

```
Input: "cat README.md"
│
├─► Parse
│   ├─ Command: "cat"
│   └─ Args: "README.md"
│
├─► Lookup in Registry
│   └─ Find handler for "cat"
│
├─► Execute Handler
│   │
│   ├─► UnixCommands.handler("README.md")
│   │   │
│   │   ├─► VirtualFilesystem.readFile("readme.md")
│   │   │   │
│   │   │   ├─► Lookup in filesystem object
│   │   │   │   │
│   │   │   │   ├─ Check localStorage cache
│   │   │   │   ├─ Return file content or error
│   │   │   │   │
│   │   │   └─► Return content
│   │   │
│   │   └─► Return formatted output
│   │
│   └─► Return result
│
├─► Format Response
│   ├─ Check for special types (image, etc)
│   ├─ HTML encode output
│   └─ Add to DOM
│
└─► Update UI
    └─ Scroll, render, apply effects
```

## State Management

### Terminal State
```javascript
{
  currentLine: "user input here",
  currentDirectory: ".",
  history: ["command1", "command2", ...],
  commandHistory: ["full command1", "full command2", ...],
  audioEnabled: true,
  soundFiles: {...},
  commands: Map<name, handler>,
  focused: true/false
}
```

### Filesystem State (in localStorage)
```javascript
{
  "file.txt": {
    type: "file",
    content: "text content",
    created: "2025-10-16T..."
  },
  "dir/": {
    type: "directory",
    files: ["file.txt", "file2.txt"],
    created: "2025-10-16T..."
  }
}
```

### Settings State (in localStorage)
```javascript
{
  "terminal-colorscheme": "oldschool",
  "terminal-sounds": true,
  "terminal-glitches": true,
  "terminal-cursor-blink": true
}
```

## Event Flow

```
1. User Types Character
   │
   └─► window.onkeypress
       │
       ├─► KeyboardSounds (play sound)
       ├─► TerminalKeybinds (check for shortcuts)
       ├─► RetroTerminal.handleKeyPress()
       │   ├─► Update currentLine
       │   ├─► Update cursor position
       │   └─► Render to screen
       │
       └─► Display Updated

2. User Presses Enter
   │
   └─► window.onkeypress
       │
       └─► RetroTerminal.processCommand()
           │
           ├─► Parse input
           ├─► Execute command
           ├─► Get response
           ├─► Format output
           ├─► Add to DOM
           ├─► Update history
           ├─► Clear input
           ├─► Create new prompt
           │
           └─► Display Updated

3. Settings Changed
   │
   └─► SettingsModal.updateSetting()
       │
       ├─► Apply CSS variables
       ├─► Toggle CRT effects
       ├─► Update color scheme
       ├─► Save to localStorage
       │
       └─► Immediate Visual Update
```

## Module Dependencies

```
retro-terminal.js (Core)
├─ Depends: portfolio-renderer.js
├─ Provides: window.retroTerminal
└─ Provides: window.virtualFilesystem

unix-commands.js
├─ Depends: retro-terminal.js, virtual-filesystem.js
├─ Provides: window.unixCommands
└─ Registers: 34 commands into terminal.commands

terminal-keybinds.js
├─ Depends: retro-terminal.js
├─ Provides: Enhanced handleKeyPress()
└─ Features: Tab completion, history, shortcuts

terminal-colorschemes.js
├─ Depends: crt-effects.js
├─ Provides: window.colorSchemes
└─ Manages: 10 color themes

settings-modal.js
├─ Depends: terminal-colorschemes.js, crt-effects.js, terminal-glitch.js
├─ Provides: window.settingsModal
└─ Features: Settings UI, persistence

crt-effects.js
├─ Provides: window.crtEffects
└─ Features: Visual effects, control panel

terminal-glitch.js
├─ Provides: window.terminalGlitch
└─ Features: Random glitch animations

ansi-colors.js
├─ Provides: window.ANSIColors
└─ Features: Color utilities (largely unused)
```

## Performance Characteristics

### Time Complexity
- Command lookup: O(1) - HashMap
- File search: O(n) - linear scan
- Directory listing: O(1) - cached array
- Command execution: O(1-n) - depends on command

### Space Complexity
- Commands registry: O(34) - constant
- Filesystem: O(n) - varies with files
- Command history: O(k) - varies with usage
- localStorage: ~5MB typical

### Optimization Techniques
- CSS hardware acceleration for animations
- Debounced glitch effects
- Efficient DOM updates
- localStorage caching
- Event delegation for keyboard

## Security Considerations

- ✅ **No server access** - All processing client-side
- ✅ **localStorage sandboxed** - Per-domain isolation
- ✅ **No eval()** - All commands validated
- ✅ **HTML encoding** - Prevents XSS
- ✅ **Input validation** - Type checking

## Scalability

### Current Limits
- 34 commands registered
- ~100 files typical filesystem
- ~1000 command history entries
- 10 color schemes

### Can be Extended To
- 100+ commands (easy to add)
- 10,000+ files (localStorage dependent)
- Unlimited history (with archival)
- 50+ themes (minimal impact)

## Future Architecture Enhancements

```
Potential Additions:
├─ WebWorker for command processing
├─ IndexedDB for larger filesystem
├─ Service Worker for offline
├─ Plugin system for commands
├─ User authentication layer
├─ Multi-terminal support
└─ Network simulation layer
```

## Conclusion

The Retro Terminal uses a **layered, modular architecture** that:
- Separates concerns (UI, commands, effects, storage)
- Allows easy extension (registerCommand pattern)
- Maintains performance (efficient algorithms, CSS effects)
- Provides persistence (localStorage integration)
- Ensures security (sandboxed, no remote access)
