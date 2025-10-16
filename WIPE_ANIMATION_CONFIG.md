# Wipe Animation Configuration Guide

The wipe animation is now fully configurable! You can customize timing, effects, messages, and styling by modifying the `getWipeAnimationConfig()` method in `settings-modal.js`.

## Quick Configuration Examples

### Example 1: Faster, More Dramatic Animation
```javascript
getWipeAnimationConfig() {
  const config = {
    // Speed it up!
    glitchDuration: 800,           // Shorter glitch
    lineDelay: 40,                 // Faster line updates
    progressBarDelay: 80,          // Faster progress bars
    
    // More visual effects
    glitchIntensity: 1.0,          // Maximum glitch intensity
    colorGlitch: true,             // Keep color effects
    enableCascadeAnimation: true,  // Cascading animations
    
    // ... rest of config
  };
  return config;
}
```

### Example 2: Slower, More Readable Animation
```javascript
getWipeAnimationConfig() {
  const config = {
    glitchDuration: 2000,          // Longer glitch period
    lineDelay: 200,                // Slower line updates
    progressBarDelay: 300,         // Slower progress bars
    progressBarSteps: 12,          // More progress updates
    
    glitchIntensity: 0.4,          // Subtle glitch
    colorGlitch: false,            // No color shifts
    enableCascadeAnimation: true,  // Keep animations
    
    // ... rest of config
  };
  return config;
}
```

### Example 3: Minimal, Clean Animation
```javascript
getWipeAnimationConfig() {
  const config = {
    glitchDuration: 500,           // Quick glitch
    lineDelay: 100,                // Normal speed
    
    glitchIntensity: 0.2,          // Very subtle
    colorGlitch: false,            // No color effects
    enableCascadeAnimation: false, // No cascade
    
    // ... rest of config
  };
  return config;
}
```

## Configuration Properties Explained

### Timing (all in milliseconds)
| Property | Default | Description |
|----------|---------|-------------|
| `glitchDuration` | 1200 | How long the initial screen glitch lasts |
| `glitchInterval` | 50 | How often to update the glitch effect |
| `commandDelay` | 200 | Delay before animation queue starts |
| `lineDelay` | 80 | Base delay between each message line |
| `progressBarSteps` | 8 | How many progress bar updates (1-24) |
| `progressBarDelay` | 150 | Delay between progress bar updates |
| `finalDelay` | 500 | Delay before showing the final prompt |

### Visual Effects
| Property | Type | Description |
|----------|------|-------------|
| `glitchIntensity` | 0-1 | How intense the glitch is (0=subtle, 1=maximum) |
| `colorGlitch` | boolean | Enable hue/saturation shifts during glitch |
| `enableCascadeAnimation` | boolean | Animate each line sliding in from the left |

### Messages
The messages configuration allows you to customize every text output:

```javascript
messages: {
  warning: '⚠ WARNING: Deleting entire filesystem...',
  wipePaths: [
    'Removing: /root',
    'Removing: /home',
    // ... add or remove paths here
  ],
  inProgress: '💥 SYSTEM WIPE IN PROGRESS...',
  erasing: '⏳ Erasing all traces...',
  successMessages: [
    '✓ Filesystem successfully wiped',
    '✓ All data removed',
    '✓ System reset to defaults'
  ],
  welcome: '> Welcome back to a fresh system!'
}
```

### Styling
Each message type has custom CSS styling:

```javascript
styles: {
  command: 'color: #ff6b6b; font-weight: bold; text-shadow: 0 0 10px #ff6b6b;',
  warning: 'color: #ff6b6b; font-weight: bold; text-shadow: 0 0 15px #ff6b6b;',
  progress: 'color: #00ff99; font-family: monospace; letter-spacing: 2px; font-weight: bold;',
  removing: 'color: #ffaa00; opacity: 0.8; font-size: 12px;',
  success: 'color: #00ff99; font-weight: bold; text-shadow: 0 0 8px #00ff99;',
  welcome: 'color: var(--accent); font-weight: bold; text-shadow: 0 0 8px var(--accent); margin-top: 8px;'
}
```

## Pro Tips

1. **Adjust `progressBarSteps`** to control how many intermediate progress bars you see (higher = more steps)
2. **Modify `wipePaths`** to customize which directories appear to be deleted
3. **Change colors** in the `styles` object to match your theme
4. **Custom messages** - add your own dramatic text in the `messages` object
5. **Cascade timing** - each line starts `queueIndex * 0.02s` after the previous one when cascading is enabled

## Animation Flow

```
1. Terminal clears (glitch effect active)
2. Command "rm -rf /" appears
3. Glitch subsides (after glitchDuration)
4. Warning message
5. File paths appear one by one (with lineDelay between each)
6. "SYSTEM WIPE IN PROGRESS" message
7. Progress bars animate to 100% (progressBarSteps updates)
8. "Erasing all traces" message
9. Success messages appear
10. "Welcome back" message
11. New prompt appears (ready for input)
```

## Total Animation Time Calculation

```
Total = glitchDuration 
      + commandDelay 
      + (messages.length * lineDelay) 
      + (progressBarSteps * progressBarDelay) 
      + finalDelay
```

For default config: 1200 + 200 + (45 * 80) + (8 * 150) + 500 ≈ **6.5 seconds**
