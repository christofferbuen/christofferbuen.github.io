# Settings Modal Documentation

## Overview
The Settings Modal provides a comprehensive configuration interface for the retro terminal system. It overlays the terminal with a sleek modal dialog that allows users to customize visual effects, audio, themes, and more.

## Opening Settings

### Methods
1. **Settings Button** - Click the `⚙` button in the bottom-right corner
2. **Keyboard Shortcut** - Press `Ctrl+Shift+S` (or `Cmd+Shift+S` on Mac)
3. **Programmatically** - Call `window.settingsModal.open()` in the console

### Closing Settings
- Click the `✕` button in the top-right
- Press `Esc` (if implemented)
- Click outside the modal on the dark backdrop

## Settings Sections

### 1. Visual Theme
**Color Scheme Selection**
- Choose from 10 unique retro color schemes
- Each theme includes tailored CRT effects
- Changes apply instantly
- Preference is saved to localStorage

Available Themes:
- **oldschool** - Classic CRT monitor green
- **vibrant** - Bright neon cyberpunk style
- **amber** - Classic 1980s amber CRT terminals
- **phosphor-green** - 1970s-80s IBM 3270 phosphor green
- **apple-ii** - 1977 Apple II monochrome green
- **tektronix** - 1980s high-end workstation white
- **monochrome** - VT100 Unix terminals pure black and white
- **hacker-green** - 1990s Hollywood hacker movie vibe
- **cold-blue** - 1980s IBM data center mainframe style
- **sepia** - Aged vintage paper aesthetic

### 2. CRT Effects
**Visual Enhancement Controls**

| Setting | Description | Default |
|---------|-------------|---------|
| **Scanlines** | Horizontal line effect | ✓ Enabled |
| **Sweep Bar** | Horizontal sweep animation | ✓ Enabled |
| **Flicker** | Screen flicker effect | ✓ Enabled |
| **Flicker Intensity** | How intense the flicker (0-0.15) | 0.05 |
| **Chromatic Aberration** | RGB color shift effect | ✓ Enabled |

### 3. Terminal Settings
**Terminal Behavior Controls**

| Setting | Description | Default |
|---------|-------------|---------|
| **Keyboard Sounds** | Enable audio feedback | ✓ Enabled |
| **Glitch Effects** | Random visual glitches | ✓ Enabled |
| **Cursor Blink** | Animated blinking cursor | ✓ Enabled |

### 4. System Information
**Read-Only Status Display**

- **Terminal Version** - Application version
- **Current Theme** - Currently active color scheme
- **Storage Used** - localStorage usage in KB

## Features

### Real-time Application
All settings changes apply immediately without requiring a page refresh.

### Persistence
Settings are saved to browser localStorage and restored on page reload:
- Color scheme preference
- Terminal audio setting
- Glitch effects setting
- Cursor blink setting

### Action Buttons

#### Apply Changes
- Confirms all changes (visual feedback)
- Shows success notification

#### Reset to Default
- Resets ALL settings to factory defaults
- Requires confirmation
- Reverts these to:
  - Theme: oldschool
  - All CRT effects: enabled
  - Flicker intensity: 0.05
  - Audio: enabled
  - Glitches: enabled
  - Cursor blink: enabled

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+S` | Open Settings Modal |
| `Escape` | Close Settings Modal (future) |
| `Tab` | Navigate controls |

## Technical Details

### Files
- **settings-modal.js** - Main controller class
- **settings-modal.css** - Styling and animations
- **Integrated with:**
  - terminal-colorschemes.js
  - crt-effects.js
  - terminal-glitch.js

### Class: SettingsModal

#### Methods
```javascript
// Open the settings modal
window.settingsModal.open()

// Close the settings modal
window.settingsModal.close()

// Toggle open/closed state
window.settingsModal.toggle()

// Load current settings into UI
window.settingsModal.loadSettings()

// Apply a single setting change
window.settingsModal.updateSetting(element)

// Reset all to defaults
window.settingsModal.resetToDefaults()
```

#### Events
The modal listens for changes on all input elements with ids starting with `setting-`.

### localStorage Keys
- `terminal-colorscheme` - Current color scheme ID
- `terminal-sounds` - Keyboard sounds enabled (true/false)
- `terminal-glitches` - Glitch effects enabled (true/false)
- `terminal-cursor-blink` - Cursor blink enabled (true/false)

## Styling

### CSS Custom Properties Used
- `--bg` - Background color
- `--fg` - Foreground text color
- `--accent` - Accent/highlight color
- `--flicker-intensity` - Flicker animation intensity

### Responsive Design
- Fully responsive on mobile devices
- Adapts layout for small screens
- Touch-friendly controls

## Extensibility

### Adding New Settings

1. Add HTML in `createModalHTML()`:
```javascript
<div class="settings-row">
  <div class="settings-label">
    <span class="settings-label-main">New Setting</span>
    <span class="settings-label-description">Description</span>
  </div>
  <input type="checkbox" id="setting-newsetting" />
</div>
```

2. Handle in `updateSetting()`:
```javascript
case 'setting-newsetting':
  // Your logic here
  break;
```

3. Load in `loadSettings()`:
```javascript
document.getElementById('setting-newsetting').checked = /* value */;
```

## Examples

### Open settings programmatically
```javascript
window.settingsModal.open();
```

### Close after a delay
```javascript
setTimeout(() => window.settingsModal.close(), 5000);
```

### Change theme programmatically
```javascript
window.colorSchemes.setScheme('hacker-green');
window.settingsModal.updateThemeGrid();
```

### Check if settings are open
```javascript
const isOpen = window.settingsModal.backdropElement.classList.contains('active');
```

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid, Flexbox, and CSS Custom Properties
- Uses Web Storage API for persistence

## Future Enhancements
- [ ] Esc key to close modal
- [ ] Keyboard navigation (Tab, Arrow keys)
- [ ] Color picker for custom themes
- [ ] Audio volume slider
- [ ] Preset/profile system
- [ ] Export/import settings
- [ ] Advanced effect timing controls
