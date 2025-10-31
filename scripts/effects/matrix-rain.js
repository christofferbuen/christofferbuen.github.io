/**
 * Matrix Rain Effect
 * Creates an animated Matrix-style falling characters background effect
 * Optional easter egg feature that can be toggled with the 'matrix' command
 * 
 * @class MatrixRain
 */
class MatrixRain {
  /**
   * Creates a new MatrixRain instance
   * @param {Object} config - Configuration options for Matrix rain effect
   */
  constructor(config = {}) {
    this.config = {
      enabled: false,         // Start disabled - easter egg!
      density: 0.5,           // 0-1: how many columns have active rain
      speed: 1,               // 0.5-3: speed multiplier
      characterSet: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
      opacity: 0.3,           // 0-1: overall opacity
      fontSize: 14,           // Font size in pixels
      ...config,
    };

    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.columns = [];
    this.storageKey = 'matrix-rain-config';
    this.init();
  }

  init() {
    this.loadConfig();
    this.createCanvas();
    this.setupColumns();
    if (this.config.enabled) {
      this.start();
    }
  }

  loadConfig() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (e) {
        console.warn('Failed to load Matrix config:', e);
      }
    }
    
    // Load font size from settings modal storage
    const fontSize = localStorage.getItem('matrix-fontsize');
    if (fontSize) {
      this.config.fontSize = parseInt(fontSize);
    }
  }

  saveConfig() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.config));
  }

  createCanvas() {
    // Create and style canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'matrix-rain-canvas';
    
    // Enable high DPI support
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2;
      pointer-events: none;
      opacity: ${this.config.opacity};
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    `;

    document.body.insertBefore(this.canvas, document.body.firstChild);
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.ctx.imageSmoothingEnabled = false;
    this.dpr = dpr;

    // Set canvas size
    this.resizeCanvas();
    
    // Debounce resize handler to prevent excessive calls
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resizeCanvas(), 250);
    });
  }

  resizeCanvas() {
    const dpr = this.dpr || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Only resize if dimensions actually changed
    if (this.screenWidth === width && this.screenHeight === height) {
      return;
    }
    
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.ctx.scale(dpr, dpr);
    this.screenWidth = width;
    this.screenHeight = height;
    this.setupColumns();
  }

  setupColumns() {
    const fontSize = this.config.fontSize;
    const columnCount = Math.floor(this.screenWidth / fontSize);
    
    this.columns = [];
    for (let i = 0; i < columnCount; i++) {
      if (Math.random() < this.config.density) {
        const speed = (0.4 + Math.random() * 1.2) * this.config.speed;  // Varied speed: 0.4-1.6x
        
        this.columns.push({
          x: i,
          chars: [],              // Array of {char, y, age}
          spawnEvery: fontSize,   // Spawn a new char every fontSize pixels
          distanceSinceSpawn: Math.random() * fontSize,  // Track distance traveled
          fadeTime: Math.floor(80 + Math.random() * 120),  // Random fade time: 80-200 frames
          currentY: Math.random() * this.screenHeight,  // Current spawn position
          speed: speed,
        });
      }
    }
  }

  getRandomCharacter() {
    return this.config.characterSet.charAt(
      Math.floor(Math.random() * this.config.characterSet.length)
    );
  }

  animate() {
    const fontSize = this.config.fontSize;
    
    // Clear canvas completely
    this.ctx.fillStyle = 'rgba(12, 29, 18, 1)';
    this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // Get color from current theme
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    this.ctx.fillStyle = accentColor;
    this.ctx.font = `bold ${fontSize}px monospace`;
    this.ctx.textAlign = 'center';

    this.columns.forEach((column) => {
      // Move the spawn position down
      column.currentY += column.speed;
      
      // Track distance traveled
      column.distanceSinceSpawn += column.speed;
      
      // Spawn new character when we've moved fontSize distance
      if (column.distanceSinceSpawn >= column.spawnEvery) {
        column.distanceSinceSpawn -= column.spawnEvery;
        
        // New character spawns at currentY and stays there
        column.chars.push({
          char: this.getRandomCharacter(),
          y: column.currentY,  // Fixed position at spawn time - doesn't move!
          age: 0,
        });
      }

      // Update and draw all characters in this column
      column.chars.forEach((charData, index) => {
        // Age the character (NO movement - characters stay in place!)
        charData.age += 1;

        // Only draw if on screen
        if (charData.y > -fontSize && charData.y < this.screenHeight) {
          // Fade out based on age
          const alpha = Math.max(0, 1 - (charData.age / column.fadeTime));
          this.ctx.globalAlpha = alpha;
          this.ctx.fillText(charData.char, column.x * fontSize + fontSize / 2, charData.y);
        }
      });

      this.ctx.globalAlpha = 1;

      // Remove aged-out characters (only fade, not position-based)
      column.chars = column.chars.filter(c => c.age < column.fadeTime);
      
      // Wrap spawn position if it goes off screen (but don't clear trail - let it fade naturally)
      if (column.currentY > this.screenHeight) {
        column.currentY = -20;
        // DON'T clear chars - they will fade out based on age
      }
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (!this.animationId) {
      this.animate();
      this.config.enabled = true;
      this.saveConfig();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      this.config.enabled = false;
      this.saveConfig();
      
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  toggle() {
    if (this.config.enabled) {
      this.stop();
    } else {
      this.start();
    }
  }

  setOption(key, value) {
    if (key in this.config) {
      this.config[key] = value;
      this.saveConfig();

      if (key === 'opacity') {
        this.canvas.style.opacity = value;
      } else if (key === 'density' || key === 'speed') {
        // These will be applied on next column regeneration
      }
    }
  }

  setFontSize(size) {
    this.config.fontSize = size;
    this.saveConfig();
    // Regenerate columns with new font size
    this.setupColumns();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.matrixRain = new MatrixRain();
  });
} else {
  window.matrixRain = new MatrixRain();
}
