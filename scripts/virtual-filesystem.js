/**
 * Retro Terminal Virtual Filesystem
 * Provides a fake filesystem for terminal commands
 */

class VirtualFilesystem {
  constructor() {
    // Default filesystem structure
    this.defaultFilesystem = {
      'portfolio.txt': {
        type: 'file',
        content: 'Welcome to my retro portfolio!\n\nThis is a fun terminal-style interface.\nUse "ls" to explore and "cat" to read files.',
        created: '2025-10-16'
      },
      'README.md': {
        type: 'file',
        content: 'RETRO TERMINAL\n==============\n\nA nostalgic terminal interface with CRT effects.\nType "help" for available commands.',
        created: '2025-10-16'
      },
      'contact.info': {
        type: 'file',
        content: 'Contact Information\n===================\n\nEmail: guest@lucy.local\nLocation: The Matrix\nStatus: Online',
        created: '2025-10-16'
      },
      'skills.dat': {
        type: 'file',
        content: 'SKILLS DATABASE\n===============\n\nJavaScript - Expert\nHTML/CSS - Expert\nTerminal UI - Enthusiast\nRetro Computing - Fan\nCRT Effects - Specialist',
        created: '2025-10-16'
      },
      'projects/': {
        type: 'directory',
        files: ['retro-terminal.js', 'crt-effects.js', 'terminal-keybinds.js']
      },
      'projects/retro-terminal.js': {
        type: 'file',
        content: 'Main terminal implementation with command registry system.',
        created: '2025-10-16'
      },
      'projects/crt-effects.js': {
        type: 'file',
        content: 'CRT monitor effects including scanlines, flicker, and sweep animations.',
        created: '2025-10-16'
      },
      'projects/terminal-keybinds.js': {
        type: 'file',
        content: 'Terminal keybinds including tab completion, history navigation, and control codes.',
        created: '2025-10-16'
      },
      'secrets/': {
        type: 'directory',
        files: ['hidden.txt']
      },
      'secrets/hidden.txt': {
        type: 'file',
        content: '> You found the hidden directory!\n> Here be dragons... or easter eggs.\n> Try "matrix" command for a surprise.',
        created: '2025-10-16'
      },
      'config.json': {
        type: 'file',
        content: '{\n  "theme": "retro-green",\n  "flicker_intensity": 0.05,\n  "sound_enabled": true,\n  "animations": ["scanlines", "sweep", "flicker", "chroma"]\n}',
        created: '2025-10-16'
      },
      'images/': {
        type: 'directory',
        files: ['sample.jpg']
      },
      'images/sample.jpg': {
        type: 'file',
        isImage: true,
        content: 'https://plus.unsplash.com/premium_photo-1752542964592-815e143c42f0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740',
        alt: 'Sample image',
        created: '2025-10-16'
      }
    };

    // Try to load from localStorage, otherwise use defaults
    this.filesystem = this.loadFromStorage() || JSON.parse(JSON.stringify(this.defaultFilesystem));
  }

  loadFromStorage() {
    /**
     * Load filesystem from localStorage
     * Returns null if not found
     */
    try {
      const stored = localStorage.getItem('terminal-filesystem');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading filesystem from storage:', error);
    }
    return null;
  }

  saveToStorage() {
    /**
     * Save filesystem to localStorage
     */
    try {
      localStorage.setItem('terminal-filesystem', JSON.stringify(this.filesystem));
      return true;
    } catch (error) {
      console.error('Error saving filesystem to storage:', error);
      return false;
    }
  }

  resetToDefaults() {
    /**
     * Reset filesystem to default state
     */
    this.filesystem = JSON.parse(JSON.stringify(this.defaultFilesystem));
    this.saveToStorage();
  }

  getFile(path) {
    /**
     * Get a file from the filesystem
     * Returns: { type: 'file', content: '...' } or null
     */
    const cleanPath = path.trim().toLowerCase();
    
    if (this.filesystem[cleanPath]) {
      const item = this.filesystem[cleanPath];
      if (item.type === 'file') {
        return item;
      }
    }
    
    return null;
  }

  getDirectory(path = '.') {
    /**
     * Get directory listing
     * Returns array of filenames or null if not found
     */
    const cleanPath = path.trim().toLowerCase();
    
    // Root directory listing
    if (cleanPath === '.' || cleanPath === '' || cleanPath === '/') {
      return Object.keys(this.filesystem)
        .filter(key => !key.includes('/') || key.endsWith('/'))
        .sort();
    }
    
    // Specific directory
    if (this.filesystem[cleanPath] && this.filesystem[cleanPath].type === 'directory') {
      return this.filesystem[cleanPath].files || [];
    }
    
    return null;
  }

  listDirectory(path = '.') {
    /**
     * Format directory listing for terminal display
     */
    const items = this.getDirectory(path);
    
    if (!items) {
      return `ls: cannot access '${path}': No such file or directory`;
    }
    
    return items.join('  ');
  }

  readFile(path) {
    /**
     * Read file content
     */
    const file = this.getFile(path);
    
    if (!file) {
      return `cat: ${path}: No such file or directory`;
    }
    
    // For image files, return a special object that indicates it's an image
    if (file.type === 'file' && file.isImage) {
      return {
        isImage: true,
        src: file.content,
        alt: file.alt || path
      };
    }
    
    return file.content;
  }

  addFile(path, content, type = 'file') {
    /**
     * Add a new file to the filesystem
     */
    this.filesystem[path] = {
      type: type,
      content: content,
      created: new Date().toISOString()
    };
    this.saveToStorage();
  }

  addDirectory(path) {
    /**
     * Add a new directory to the filesystem
     */
    const cleanPath = path.toLowerCase().trim();
    const dirPath = cleanPath.endsWith('/') ? cleanPath : cleanPath + '/';
    
    this.filesystem[dirPath] = {
      type: 'directory',
      files: [],
      created: new Date().toISOString()
    };
    this.saveToStorage();
  }

  exists(path) {
    /**
     * Check if a file or directory exists
     */
    return !!this.filesystem[path.toLowerCase().trim()];
  }

  removeFile(path) {
    /**
     * Remove a file from the filesystem
     */
    const cleanPath = path.toLowerCase().trim();
    if (this.filesystem[cleanPath]) {
      delete this.filesystem[cleanPath];
      this.saveToStorage();
      return true;
    }
    return false;
  }

  addDirectory(path) {
    /**
     * Add a new directory to the filesystem
     */
    const cleanPath = path.toLowerCase().trim();
    const dirPath = cleanPath.endsWith('/') ? cleanPath : cleanPath + '/';
    
    this.filesystem[dirPath] = {
      type: 'directory',
      files: [],
      created: new Date().toISOString()
    };
  }

  findFiles(pattern) {
    /**
     * Find files matching a pattern
     */
    const regex = new RegExp(pattern, 'i');
    return Object.keys(this.filesystem).filter(key =>
      regex.test(key) && this.filesystem[key].type === 'file'
    );
  }

  export() {
    /**
     * Export filesystem as JSON
     */
    return JSON.stringify(this.filesystem, null, 2);
  }
}

// Make it globally available
window.VirtualFilesystem = VirtualFilesystem;