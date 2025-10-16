# Unix Shell Commands Reference

This retro terminal implements a comprehensive set of common Unix shell commands for a realistic command-line experience.

## Command Categories

### File System Navigation
- **pwd** - Print working directory
- **cd** - Change directory  
- **ls** - List directory contents
- **tree** - Show directory tree structure

### File Operations
- **cat** - Display file contents
- **touch** - Create empty file
- **cp** - Copy files
- **mv** - Move/rename files
- **rm** - Remove files
- **mkdir** - Create directory
- **find** - Search for files

### File Inspection & Analysis
- **head** - Show start of file (default 10 lines)
- **tail** - Show end of file (default 10 lines)
- **grep** - Search text patterns in files
- **wc** - Count lines, words, bytes
- **sort** - Sort lines alphabetically

### System Information
- **date** - Show current date and time
- **whoami** - Show current user
- **who** - Show logged-in users
- **uname** - Print system information
- **env** - Show environment variables

### Terminal Control
- **clear** - Clear the terminal screen
- **echo** - Print text to screen
- **history** - Show command history
- **help** - Show available commands
- **man** - Show manual page for command

### Special Commands
- **theme** - Switch color scheme
- **matrix** - Show matrix effect

## Detailed Command Reference

### Navigation & Listing

#### pwd
Print the current working directory.
```
pwd
```
Output: `~` (or directory path)

#### cd
Change directory.
```
cd projects/
cd ..
cd ~
```
- `cd projects/` - Enter projects directory
- `cd ..` - Go back to parent directory
- `cd ~` or `cd .` - Go to home

#### ls
List files in current directory.
```
ls
```
Shows all files and directories.

#### tree
Display directory structure in tree format.
```
tree
```
Shows hierarchical view of current directory and subdirectories.

### File Operations

#### cat
Display file contents.
```
cat filename.txt
cat README.md
```

#### echo
Print text to screen.
```
echo "Hello, World!"
echo "This is some text"
```

#### touch
Create a new empty file or update modification time.
```
touch newfile.txt
touch myfile
```
Returns: `newfile.txt [created]`

#### mkdir
Create a new directory.
```
mkdir my-folder
mkdir projects
```

#### cp
Copy a file to a new location.
```
cp original.txt backup.txt
cp source destination
```

#### mv
Move or rename a file.
```
mv oldname.txt newname.txt
mv document.txt projects/
```

#### rm
Remove/delete files.
```
rm filename.txt
rm file1 file2 file3
```

#### find
Search for files.
```
find
find .
```
Returns list of all files in the filesystem.

### File Analysis

#### head
Show the first lines of a file.
```
head README.md
head -n 5 file.txt
```
- Default: 10 lines
- `-n 5`: Show first 5 lines

#### tail
Show the last lines of a file.
```
tail README.md
tail -n 5 file.txt
```
- Default: 10 lines
- `-n 5`: Show last 5 lines

#### grep
Search for lines containing a pattern.
```
grep error logfile.txt
grep function script.js
grep search pattern
```
Returns: All matching lines (case-insensitive)

#### wc
Count lines, words, and bytes.
```
wc file.txt
```
Output: `  lines  words  bytes  filename`

#### sort
Sort lines alphabetically.
```
sort names.txt
sort data.txt
```
Returns: File contents sorted alphabetically.

### System Information

#### date
Show current date and time.
```
date
```
Output: Current timestamp

#### whoami
Show current user.
```
whoami
```
Output: `guest`

#### who
Show logged-in users.
```
who
```
Output: User information

#### uname
Print system information.
```
uname
uname -a
uname -s
```
Options:
- `-a`: All information
- `-s`: Kernel name
- `-n`: Nodename
- `-r`: Release version
- `-m`: Machine type

#### env
Show environment variables.
```
env
```
Output: All environment variables in KEY=VALUE format

### Terminal Control

#### clear
Clear the terminal screen.
```
clear
```
Removes all output and shows fresh prompt.

#### history
Show command history.
```
history
```
Returns: Numbered list of previously executed commands

#### help
Show available commands.
```
help
```
Returns: List of all available commands with descriptions

#### man
Show manual page for a command.
```
man pwd
man ls
man cat
```
Returns: Detailed help for the specified command

### Customization

#### theme
Switch color scheme.
```
theme
theme amber
theme hacker-green
```
- No argument: Show available themes
- With theme name: Switch to that theme

#### matrix
Show matrix effect (Easter egg).
```
matrix
```

## Examples

### Create and organize files
```
mkdir documents
touch documents/note.txt
echo "This is my note" > documents/note.txt  (would create content)
```

### Search and analyze
```
grep "important" documents/note.txt
wc documents/note.txt
head -n 5 documents/note.txt
```

### Navigation and listing
```
pwd
ls
cd documents/
pwd
cd ..
tree
```

### System information
```
whoami
date
uname -a
env
```

## Features

### localStorage Integration
- Files are stored as JSON objects in browser localStorage
- Persists across page refreshes
- No actual filesystem access (sandboxed)

### Command History
- All commands are tracked
- Accessible via `history` command
- Use Arrow Up/Down to navigate history (terminal keybind)

### Environment Variables
- User: `guest`
- Hostname: `retro`
- Shell: `/bin/bash`
- Supports `env` command to view

### Case Insensitivity
- Most commands are case-insensitive
- File names are converted to lowercase for consistency

## Tips & Tricks

### Navigation Shortcuts
- Use `pwd` to see current location
- Use `cd ..` to go up one level
- Use `cd` or `cd .` to go to home

### File Operations
- `cp` a file before deleting with `rm`
- Use `touch` to create placeholder files
- `mv` can rename or move files

### Searching & Analyzing
- `grep` is case-insensitive
- `wc` shows three numbers: lines, words, bytes
- `sort` is alphabetical

### System Info
- `env` shows your shell configuration
- `uname -a` shows system details
- `whoami` confirms your user

## Limitations

- Directory removal (`rmdir`) not fully implemented
- Recursive operations (`rm -r`, `cp -r`) simplified
- `grep` uses string matching, not full regex
- `find` simplified implementation
- Text editor (`vi`, `nano`) not implemented
- Pipe operations not supported

## Extensibility

New commands can be added to `unix-commands.js`:

```javascript
registerMyCommand() {
  this.terminal.registerCommand('mycommand', 'Description', (args) => {
    // Command logic here
    return 'Output';
  }, ['alias1', 'alias2'], {
    usage: 'mycommand <args>',
    description: 'Full description',
    examples: ['mycommand arg1', 'mycommand arg2'],
    options: { '-f': 'Flag description' }
  });
}
```

Then call in `registerCommands()`:
```javascript
registerCommands() {
  // ... existing commands
  this.registerMyCommand();
}
```
