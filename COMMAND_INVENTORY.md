# Retro Terminal - Complete Command Inventory

## Quick Command List

### Navigation (6 commands)
| Command | Alias | Description |
|---------|-------|-------------|
| `pwd` | - | Print working directory |
| `cd` | - | Change directory |
| `ls` | - | List directory contents |
| `tree` | - | Display directory tree |
| `find` | - | Search for files |
| `mkdir` | - | Make directory |

### File Operations (7 commands)
| Command | Alias | Description |
|---------|-------|-------------|
| `cat` | - | Display file contents |
| `echo` | - | Print text |
| `touch` | - | Create/update file |
| `cp` | - | Copy files |
| `mv` | `rename` | Move/rename files |
| `rm` | - | Remove files |
| `sort` | - | Sort lines |

### File Analysis (5 commands)
| Command | Alias | Description |
|---------|-------|-------------|
| `head` | - | Show start of file |
| `tail` | - | Show end of file |
| `grep` | `search` | Search patterns |
| `wc` | - | Count words/lines |

### System Info (5 commands)
| Command | Alias | Description |
|---------|-------|-------------|
| `date` | - | Show date/time |
| `whoami` | - | Show current user |
| `who` | `w` | Show logged-in users |
| `uname` | - | System information |
| `env` | `set` | Show environment vars |

### Terminal (6 commands)
| Command | Alias | Description |
|---------|-------|-------------|
| `clear` | - | Clear screen |
| `help` | - | Show commands |
| `man` | - | Manual pages |
| `history` | - | Command history |
| `theme` | - | Switch color scheme |
| `matrix` | - | Easter egg effect |

## Total: 34 Commands

### By Category

**Filesystem Navigation: 6**
- pwd, cd, ls, tree, find, mkdir

**File Operations: 7**
- cat, echo, touch, cp, mv, rm, sort

**File Analysis: 4**
- head, tail, grep, wc

**System Information: 5**
- date, whoami, who, uname, env

**Terminal/UI: 6**
- clear, help, man, history, theme, matrix

## Usage Examples

### Create and view files
```
mkdir projects
touch projects/readme.txt
echo "Hello World" 
cat projects/readme.txt
```

### Navigate filesystem
```
pwd
ls
cd projects/
tree
cd ..
find
```

### Analyze content
```
head projects/readme.txt
grep "text" projects/readme.txt
wc projects/readme.txt
sort projects/readme.txt
```

### System information
```
whoami
date
uname -a
env
who
```

### Terminal control
```
clear
history
help
man pwd
theme amber
matrix
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+L** | Clear terminal (same as `clear`) |
| **Ctrl+C** | Clear current input |
| **Ctrl+U** | Clear line from cursor to start |
| **Ctrl+K** | Clear line from cursor to end |
| **Ctrl+Shift+S** | Open settings modal |
| **Arrow Up/Down** | Navigate command history |
| **Tab** | Auto-complete commands |

## Data Storage

All files and directories are stored as JSON in browser localStorage:
- Persists across page refreshes
- No server-side storage required
- Completely sandboxed/safe

## Features

✅ Full Unix-like command interface
✅ Realistic error messages
✅ Command history and navigation
✅ Auto-completion with Tab
✅ Man pages for all commands
✅ Environment variables
✅ localStorage persistence
✅ Multiple color schemes
✅ CRT visual effects
✅ Keyboard sound effects
✅ Glitch animations

## Notable Behaviors

- Commands are **case-insensitive**
- File paths are **lowercase** internally
- Directories end with `/` 
- Use `..` to go to parent directory
- Use `.` or `~` for home directory
- `grep` uses **string matching** (not regex)
- `find` shows all files in system
- `history` shows all executed commands

## Extending with New Commands

To add a new command, create a method in `unix-commands.js`:

```javascript
registerMyCommand() {
  this.terminal.registerCommand('mycommand', 'Description', (args) => {
    // Your logic here
    return 'result';
  }, ['alias1'], {
    usage: 'mycommand <args>',
    description: 'Full description',
    examples: ['mycommand example'],
    notes: ['Any notes about usage']
  });
}
```

Then add to `registerCommands()` method.

## Next Steps / Potential Additions

- [ ] `less`/`more` - Pager simulation
- [ ] `chmod`/`chown` - Permission simulation
- [ ] `ps`/`kill` - Process simulation
- [ ] `vi`/`nano` - Text editor
- [ ] `curl`/`wget` - Network simulation
- [ ] `tar`/`zip` - Compression commands
- [ ] Pipe operations (`|`)
- [ ] Redirection (`>`, `>>`, `<`)
- [ ] Command aliases (`alias`)
- [ ] `cal` - Calendar
- [ ] `fortune` - Random quotes
- [ ] `cowsay` - ASCII art
