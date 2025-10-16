/**
 * Unix Shell Commands for Retro Terminal
 * Implements common Unix utilities for a realistic shell experience
 */

class UnixCommands {
  constructor(terminal, filesystem) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.env = this.initializeEnvironment();
    this.commandHistory = [];
    this.registerCommands();
  }

  initializeEnvironment() {
    return {
      USER: 'guest',
      HOSTNAME: 'retro',
      PWD: '.',
      HOME: '.',
      TERM: 'vt100',
      SHELL: '/bin/bash',
      LANG: 'en_US.UTF-8',
      PATH: '/usr/bin:/bin:/usr/sbin:/sbin',
      EDITOR: 'vi'
    };
  }

  registerCommands() {
    this.registerPwdCommand();
    this.registerTouchCommand();
    this.registerMkdirCommand();
    this.registerRmCommand();
    this.registerCpCommand();
    this.registerMvCommand();
    this.registerHeadCommand();
    this.registerTailCommand();
    this.registerGrepCommand();
    this.registerWcCommand();
    this.registerSortCommand();
    this.registerHistoryCommand();
    this.registerEnvCommand();
    this.registerUnameCommand();
    this.registerWhoCommand();
    this.registerFindCommand();
  }

  registerPwdCommand() {
    this.terminal.registerCommand('pwd', 'Print working directory', () => {
      const pwd = this.terminal.currentDirectory === '.' ? '~' : this.terminal.currentDirectory;
      return pwd;
    }, [], {
      usage: 'pwd',
      description: 'Print the full pathname of the current working directory.',
      examples: ['pwd'],
      notes: ['Shows ~ for home directory']
    });
  }

  registerTouchCommand() {
    this.terminal.registerCommand('touch', 'Create or update file', (args) => {
      if (!args) {
        return 'touch: missing file operand';
      }

      const filename = args.toLowerCase().trim();
      
      // Create file in current directory
      const fullPath = this.terminal.currentDirectory === '.' ? filename : `${this.terminal.currentDirectory}${filename}`;
      
      this.filesystem.addFile(fullPath, '', 'file');
      return `${filename} [created]`;
    }, [], {
      usage: 'touch <filename>',
      description: 'Create an empty file or update modification time.',
      examples: ['touch newfile.txt', 'touch myfile'],
      notes: ['Files are stored in browser localStorage as JSON objects']
    });
  }

  registerMkdirCommand() {
    this.terminal.registerCommand('mkdir', 'Make directory', (args) => {
      if (!args) {
        return 'mkdir: missing operand';
      }

      const dirname = args.toLowerCase().trim();
      if (!dirname.endsWith('/')) {
        const fullPath = `${dirname}/`;
        this.filesystem.addDirectory(fullPath);
        return `mkdir: created directory '${dirname}'`;
      }

      this.filesystem.addDirectory(dirname);
      return `mkdir: created directory '${dirname}'`;
    }, [], {
      usage: 'mkdir <dirname>',
      description: 'Create a new directory.',
      examples: ['mkdir projects', 'mkdir my-folder'],
      notes: ['Directory names automatically get / appended']
    });
  }

  registerRmCommand() {
    this.terminal.registerCommand('rm', 'Remove files', (args) => {
      if (!args) {
        return 'rm: missing operand';
      }

      const targets = args.split(' ').filter(a => a.trim());
      const results = [];

      targets.forEach(target => {
        const cleanTarget = target.toLowerCase().trim();
        
        // Check if it's a directory reference
        if (cleanTarget.endsWith('/')) {
          results.push(`rm: refusing to remove directory '${cleanTarget}' (use rm -r)`);
        } else if (this.filesystem.getFile(cleanTarget)) {
          this.filesystem.removeFile(cleanTarget);
          results.push(`rm: removed '${cleanTarget}'`);
        } else {
          results.push(`rm: cannot remove '${cleanTarget}': No such file or directory`);
        }
      });

      return results.join('\n');
    }, [], {
      usage: 'rm <file> [file2] ...',
      description: 'Remove files.',
      examples: ['rm oldfile.txt', 'rm file1 file2 file3'],
      notes: ['To remove directories, use rmdir. Use rm -r for recursive removal (not fully implemented)']
    });
  }

  registerCpCommand() {
    this.terminal.registerCommand('cp', 'Copy files', (args) => {
      if (!args || args.split(' ').length < 2) {
        return 'cp: missing file operand';
      }

      const parts = args.split(' ').filter(p => p.trim());
      if (parts.length < 2) {
        return 'cp: missing destination';
      }

      const source = parts[0].toLowerCase();
      const dest = parts[1].toLowerCase();

      const sourceFile = this.filesystem.getFile(source);
      if (!sourceFile) {
        return `cp: cannot open '${source}' for reading: No such file or directory`;
      }

      // Create copy
      this.filesystem.addFile(dest, sourceFile.content, 'file');
      return `${source} -> ${dest}`;
    }, [], {
      usage: 'cp <source> <destination>',
      description: 'Copy files.',
      examples: ['cp original.txt copy.txt', 'cp source dest'],
      notes: ['Directory copying with -r not implemented']
    });
  }

  registerMvCommand() {
    this.terminal.registerCommand('mv', 'Move or rename files', (args) => {
      if (!args || args.split(' ').length < 2) {
        return 'mv: missing operand';
      }

      const parts = args.split(' ').filter(p => p.trim());
      const source = parts[0].toLowerCase();
      const dest = parts[1].toLowerCase();

      const sourceFile = this.filesystem.getFile(source);
      if (!sourceFile) {
        return `mv: cannot stat '${source}': No such file or directory`;
      }

      // Copy to new location
      this.filesystem.addFile(dest, sourceFile.content, 'file');
      // Remove from old location
      this.filesystem.removeFile(source);

      return `${source} -> ${dest}`;
    }, ['rename'], {
      usage: 'mv <source> <destination>',
      description: 'Move or rename files.',
      examples: ['mv oldname.txt newname.txt', 'mv file.txt projects/'],
      notes: ['Moving to existing file overwrites it']
    });
  }

  registerHeadCommand() {
    this.terminal.registerCommand('head', 'Show start of file', (args) => {
      if (!args) {
        return 'head: missing file operand';
      }

      let lines = 10; // default
      let filename = args;

      // Parse -n flag
      if (args.includes('-n')) {
        const parts = args.split('-n');
        const numStr = parts[1].trim().split(' ')[0];
        lines = parseInt(numStr) || 10;
        filename = args.split(numStr)[1].trim();
      }

      const file = this.filesystem.readFile(filename);
      if (typeof file === 'string' && file.includes('No such file')) {
        return file;
      }

      const fileContent = typeof file === 'string' ? file : file.content || '';
      const fileLines = fileContent.split('\n');
      return fileLines.slice(0, lines).join('\n');
    }, [], {
      usage: 'head [options] <file>',
      description: 'Display the first lines of a file.',
      examples: ['head README.md', 'head -n 5 file.txt'],
      options: {
        '-n <number>': 'Show first <number> lines (default: 10)'
      }
    });
  }

  registerTailCommand() {
    this.terminal.registerCommand('tail', 'Show end of file', (args) => {
      if (!args) {
        return 'tail: missing file operand';
      }

      let lines = 10; // default
      let filename = args;

      // Parse -n flag
      if (args.includes('-n')) {
        const parts = args.split('-n');
        const numStr = parts[1].trim().split(' ')[0];
        lines = parseInt(numStr) || 10;
        filename = args.split(numStr)[1].trim();
      }

      const file = this.filesystem.readFile(filename);
      if (typeof file === 'string' && file.includes('No such file')) {
        return file;
      }

      const fileContent = typeof file === 'string' ? file : file.content || '';
      const fileLines = fileContent.split('\n');
      return fileLines.slice(-lines).join('\n');
    }, [], {
      usage: 'tail [options] <file>',
      description: 'Display the last lines of a file.',
      examples: ['tail README.md', 'tail -n 5 file.txt'],
      options: {
        '-n <number>': 'Show last <number> lines (default: 10)'
      }
    });
  }

  registerGrepCommand() {
    this.terminal.registerCommand('grep', 'Search text patterns', (args) => {
      if (!args) {
        return 'grep: missing pattern';
      }

      const parts = args.split(' ');
      if (parts.length < 2) {
        return 'grep: missing file operand';
      }

      const pattern = parts[0];
      const filename = parts.slice(1).join(' ');

      const file = this.filesystem.readFile(filename);
      if (typeof file === 'string' && file.includes('No such file')) {
        return file;
      }

      const fileContent = typeof file === 'string' ? file : file.content || '';
      const fileLines = fileContent.split('\n');
      
      // Simple string matching (not regex for simplicity)
      const matches = fileLines.filter(line => 
        line.toLowerCase().includes(pattern.toLowerCase())
      );

      return matches.length > 0 ? matches.join('\n') : '';
    }, ['search'], {
      usage: 'grep <pattern> <file>',
      description: 'Search for lines containing a pattern.',
      examples: ['grep ERROR logfile.txt', 'grep function script.js'],
      notes: ['Simple string matching, not full regex. Use quotes for patterns with spaces.']
    });
  }

  registerWcCommand() {
    this.terminal.registerCommand('wc', 'Count words/lines/bytes', (args) => {
      if (!args) {
        return 'wc: missing file operand';
      }

      const filename = args.trim().split(' ')[0];
      const file = this.filesystem.readFile(filename);
      
      if (typeof file === 'string' && file.includes('No such file')) {
        return file;
      }

      const fileContent = typeof file === 'string' ? file : file.content || '';
      const lines = fileContent.split('\n').length - 1;
      const words = fileContent.split(/\s+/).filter(w => w.length > 0).length;
      const bytes = new Blob([fileContent]).size;

      return `  ${lines}  ${words}  ${bytes} ${filename}`;
    }, [], {
      usage: 'wc [options] <file>',
      description: 'Count lines, words, and bytes.',
      examples: ['wc file.txt'],
      notes: ['Shows lines, words, bytes, and filename']
    });
  }

  registerSortCommand() {
    this.terminal.registerCommand('sort', 'Sort lines', (args) => {
      if (!args) {
        return 'sort: missing file operand';
      }

      const filename = args.trim().split(' ')[0];
      const file = this.filesystem.readFile(filename);

      if (typeof file === 'string' && file.includes('No such file')) {
        return file;
      }

      const fileContent = typeof file === 'string' ? file : file.content || '';
      const sorted = fileContent.split('\n').sort().join('\n');

      return sorted;
    }, [], {
      usage: 'sort <file>',
      description: 'Sort lines of a file.',
      examples: ['sort names.txt', 'sort data.txt'],
      notes: ['Alphabetical sorting, case-sensitive']
    });
  }

  registerHistoryCommand() {
    this.terminal.registerCommand('history', 'Show command history', () => {
      if (this.terminal.commandHistory.length === 0) {
        return 'history: no commands yet';
      }

      const lines = this.terminal.commandHistory.map((cmd, idx) => 
        `${String(idx + 1).padStart(4, ' ')}  ${cmd}`
      );

      return lines.join('\n');
    }, [], {
      usage: 'history',
      description: 'Display the command history.',
      examples: ['history'],
      notes: ['Shows all previously executed commands with line numbers']
    });
  }

  registerEnvCommand() {
    this.terminal.registerCommand('env', 'Show environment variables', () => {
      const envLines = Object.entries(this.env).map(
        ([key, value]) => `${key}=${value}`
      );

      return envLines.join('\n');
    }, ['set'], {
      usage: 'env',
      description: 'Display all environment variables.',
      examples: ['env'],
      notes: ['Shows shell environment configuration']
    });
  }

  registerUnameCommand() {
    this.terminal.registerCommand('uname', 'Print system information', (args) => {
      const options = {
        '-a': 'all information',
        '-s': 'kernel name',
        '-n': 'nodename',
        '-r': 'release',
        '-m': 'machine'
      };

      if (args === '-a') {
        return 'RetroOS 1.0 retro x86_64 BSD-compatible';
      } else if (args === '-s') {
        return 'RetroOS';
      } else if (args === '-n') {
        return 'retro';
      } else if (args === '-r') {
        return '1.0';
      } else if (args === '-m') {
        return 'x86_64';
      } else {
        return 'RetroOS';
      }
    }, [], {
      usage: 'uname [options]',
      description: 'Print system information.',
      examples: ['uname', 'uname -a', 'uname -s'],
      options
    });
  }

  registerWhoCommand() {
    this.terminal.registerCommand('who', 'Show logged-in users', () => {
      return `${this.env.USER}     pts/0        ${new Date().toLocaleString()}`;
    }, ['w'], {
      usage: 'who',
      description: 'Display information about logged-in users.',
      examples: ['who'],
      notes: ['Simulated user list']
    });
  }

  registerFindCommand() {
    this.terminal.registerCommand('find', 'Search for files', (args) => {
      if (!args) {
        args = '.';
      }

      // Simple find - just list all files in root for now
      const allFiles = Object.keys(this.filesystem.filesystem)
        .filter(key => this.filesystem.filesystem[key].type === 'file')
        .sort();

      if (allFiles.length === 0) {
        return 'find: no files found';
      }

      return allFiles.join('\n');
    }, [], {
      usage: 'find [path]',
      description: 'Search for files and directories.',
      examples: ['find', 'find .'],
      notes: ['Simplified implementation - shows all files']
    });
  }
}

// Initialize on terminal ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for terminal and filesystem to be ready
    setTimeout(() => {
      if (window.retroTerminal && window.virtualFilesystem) {
        window.unixCommands = new UnixCommands(window.retroTerminal, window.virtualFilesystem);
        console.log('Unix commands initialized');
      }
    }, 100);
  });
} else {
  if (window.retroTerminal && window.virtualFilesystem) {
    window.unixCommands = new UnixCommands(window.retroTerminal, window.virtualFilesystem);
    console.log('Unix commands initialized');
  }
}
