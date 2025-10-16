# Quick Start Guide - Retro Terminal

## Getting Started

1. **Open the terminal** - It loads automatically when you visit the page
2. **Type a command** - Start with `help` or `ls` to explore
3. **Use keyboard shortcuts** - Arrow keys navigate history, Tab completes commands
4. **Customize appearance** - Click ⚙ button or press Ctrl+Shift+S for settings

## Essential Commands

### See What's Available
```
help           # Show all commands
man ls         # Get help on specific command
history        # Show past commands
```

### Explore Files
```
ls             # List files
pwd            # Show current location
cd projects/   # Change directory
cat README.md  # View file contents
```

### Create & Manage Files
```
touch newfile.txt          # Create empty file
mkdir mydir                # Create directory
echo "Hello" > file.txt    # (future feature with redirection)
cp original.txt backup.txt # Copy file
mv oldname.txt newname.txt # Rename file
rm unwanted.txt            # Delete file
```

### Analyze Content
```
head README.md       # Show first 10 lines
tail -n 5 file.txt   # Show last 5 lines
grep pattern file    # Search for text
wc file.txt          # Count lines/words/bytes
sort data.txt        # Sort alphabetically
```

### System Info
```
whoami               # Show user
date                 # Show current time
uname -a             # System information
env                  # Environment variables
```

### Terminal Control
```
clear                # Clear screen
theme                # Change color scheme
Ctrl+L               # Clear screen (shortcut)
Ctrl+Shift+S         # Open settings modal
```

## Color Schemes

Switch between 10 retro color schemes:
```
theme                    # Show available themes
theme amber              # Try amber (1980s)
theme hacker-green       # Try hacker green (1990s)
theme phosphor-green     # Try phosphor green (classic)
theme oldschool          # Back to original
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Tab** | Auto-complete command |
| **Ctrl+L** | Clear screen |
| **Ctrl+Shift+S** | Open settings |
| **Arrow Up** | Previous command |
| **Arrow Down** | Next command |

## Settings Modal

Click the ⚙️ button (or Ctrl+Shift+S) to access:

- **Visual Theme** - Choose from 10 color schemes
- **CRT Effects** - Toggle scanlines, flicker, sweep, chromatic aberration
- **Terminal Settings** - Audio, glitch effects, cursor blink
- **System Info** - View configuration and storage usage
- **Reset Button** - Restore all defaults

## Filesystem

All files are stored locally in your browser - they persist across refreshes!

```
Files created with touch stay in the system
Directories created with mkdir are navigable
Use cd to navigate: cd projects/ then cd ..
Everything is saved automatically
```

## Command Categories

### Navigation (6 commands)
pwd, cd, ls, tree, find, mkdir

### File Operations (7 commands)
cat, echo, touch, cp, mv, rm, sort

### Analysis (4 commands)
head, tail, grep, wc

### System (5 commands)
date, whoami, who, uname, env

### Terminal (6 commands)
clear, help, man, history, theme, matrix

**Total: 34 commands**

## Common Tasks

### Create and organize files
```
mkdir documents
touch documents/notes.txt
cd documents/
ls
cat notes.txt
cd ..
```

### Search for files
```
find                    # List all files
grep important file.txt # Search file content
```

### View file information
```
head myfile.txt         # First 10 lines
tail myfile.txt         # Last 10 lines
wc myfile.txt           # Size info
sort myfile.txt         # Sorted view
```

### System overview
```
whoami                  # Who am I?
date                    # What time?
uname -a                # System details
env                     # Configuration
who                     # Logged in users
```

## Tips & Tricks

- **Auto-complete**: Type first letters of command, press Tab
- **History**: Press Arrow Up to repeat last command
- **Clear**: Use Ctrl+L shortcut instead of typing `clear`
- **Themes**: Experiment with different color schemes - they're all unique!
- **Settings**: Customize CRT effects in settings modal

## Troubleshooting

### Command not found?
- Type `help` to see all available commands
- Type `man command` for help on a specific command
- Check spelling (case-insensitive but must be complete)

### Files disappeared?
- Check if you're in the right directory with `pwd`
- Use `find` to search all files
- Browser cleared localStorage? Files would reset

### Effects too intense?
- Open settings with ⚙️ button or Ctrl+Shift+S
- Adjust flicker intensity slider
- Toggle effects on/off

## Advanced Usage

### View command history
```
history               # Show all past commands
```

### Check environment
```
env                  # See all variables
```

### Manual pages
```
man pwd              # Help on pwd command
man ls               # Help on ls command
man cd               # Help on cd command
```

## Fun Commands

### Matrix effect (Easter egg)
```
matrix              # Cool green matrix animation
```

### System info
```
uname -a            # Fun system information
```

## Performance

- **Fast**: All processing happens in your browser
- **Persistent**: Files saved automatically to localStorage
- **Responsive**: Works on desktop and mobile
- **Effects**: Hardware-accelerated CRT rendering

## Learning Resources

See included documentation:
- `UNIX_COMMANDS.md` - Detailed command reference
- `COMMAND_INVENTORY.md` - Full command list
- `SETTINGS_MODAL.md` - Settings system documentation
- `PROJECT_SUMMARY.md` - Complete project overview

## Quick Command Reference

```
pwd                    # Print working directory
ls                     # List files
cd <dir>               # Change directory
cat <file>             # View file
echo "text"            # Print text
touch <file>           # Create file
mkdir <dir>            # Create directory
cp <src> <dst>         # Copy file
mv <src> <dst>         # Move/rename
rm <file>              # Delete file
head <file>            # First lines
tail <file>            # Last lines
grep <pattern> <file>  # Search
wc <file>              # Count words/lines
sort <file>            # Sort lines
date                   # Current date/time
whoami                 # Current user
uname -a               # System info
env                    # Environment
clear                  # Clear screen
help                   # Show commands
man <cmd>              # Get help
history                # Show history
theme                  # Change theme
```

## Next Steps

1. **Explore**: Use `ls` and `cd` to navigate
2. **Create**: Make some files with `touch`
3. **Customize**: Try different color schemes with `theme`
4. **Experiment**: Try all 34 commands!
5. **Learn**: Read the documentation files

Enjoy your retro terminal experience! 🎮✨
