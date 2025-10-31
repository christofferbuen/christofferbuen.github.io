/**
 * File System Commands
 * Commands for navigating and interacting with the virtual filesystem
 */
class FileCommands {
  constructor(terminal, filesystem) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.registerCommands();
  }

  registerCommands() {
    this.registerLsCommand();
    this.registerCdCommand();
    this.registerCatCommand();
    this.registerTreeCommand();
    this.registerPwdCommand();
  }

  registerLsCommand() {
    this.terminal.registerCommand('ls', 'List files', () => {
      return this.filesystem.listDirectory('.');
    }, [], {
      usage: 'ls [directory]',
      description: 'Lists files and directories in the current directory.',
      examples: ['ls', 'ls projects/'],
      notes: ['Use "cd" to change directories']
    });
  }

  registerCdCommand() {
    this.terminal.registerCommand('cd', 'Change directory', (args) => {
      if (!args || args === '/') {
        this.terminal.currentDirectory = '.';
        return null;
      }

      if (args === '..') {
        this.terminal.currentDirectory = '.';
        return null;
      }

      const targetDir = args.toLowerCase().trim();
      const dirWithSlash = targetDir.endsWith('/') ? targetDir : targetDir + '/';
      
      // Check if directory exists
      if (this.filesystem.getDirectory(dirWithSlash)) {
        this.terminal.currentDirectory = dirWithSlash;
        return null;
      } else {
        return `cd: ${args}: No such directory`;
      }
    }, [], {
      usage: 'cd <directory>',
      description: 'Change the current directory.',
      examples: ['cd projects', 'cd secrets', 'cd ..'],
      notes: ['Use ".." to go back to root']
    });
  }

  registerCatCommand() {
    this.terminal.registerCommand('cat', 'Display file contents', (args) => {
      if (!args) {
        return 'Usage: cat <filename>';
      }
      const result = this.filesystem.readFile(args);
      
      // Check if result is an image object
      if (result && typeof result === 'object' && result.isImage) {
        // Return special marker that we'll handle in executeCommand
        return result;
      }
      
      return result;
    }, [], {
      usage: 'cat <filename>',
      description: 'Display the contents of a file or image.',
      examples: ['cat portfolio.txt', 'cat README.md', 'cat image.jpg'],
      options: {
        'portfolio.txt': 'Main portfolio file',
        'README.md': 'Project README',
        'contact.info': 'Contact information',
        'skills.dat': 'Skills database'
      }
    });
  }

  registerTreeCommand() {
    this.terminal.registerCommand('tree', 'Display directory structure', (args) => {
      const lines = [];
      const items = this.filesystem.getDirectory('.');
      
      lines.push('.');
      items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const prefix = isLast ? '└── ' : '├── ';
        lines.push(prefix + item);
      });

      return lines.join('\n');
    }, [], {
      usage: 'tree',
      description: 'Display directory structure as a tree.',
      examples: ['tree'],
      notes: ['Shows all files and directories from root']
    });
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
}

// Initialize when terminal and filesystem are ready
window.onDOMReady(() => {
  window.domInitializer.waitForGlobals(['retroTerminal', 'virtualFilesystem'], ({ retroTerminal, virtualFilesystem }) => {
    window.fileCommands = new FileCommands(retroTerminal, virtualFilesystem);
  });
}, 20); // Priority 20 - after base commands

