/**
 * Matrix Rain Effect V2
 * Enhanced version with cluster rain and character cycling
 * Features:
 * - Cluster rain: groups of columns falling together with synchronized speeds
 * - Character cycling: characters can morph/glitch through different symbols in-place
 * - All original features from v1
 * 
 * @class MatrixRainV2
 */
class MatrixRainV2 {
  /**
   * Creates a new MatrixRainV2 instance
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
      
      // V2 Features
      clusterMode: true,      // Enable cluster rain mode
      clusterSize: 6,         // Number of columns in each cluster (2-8)
      clusterSpread: 2,       // How spread out cluster columns are (1-5)
      clusterDensity: 0.5,    // 0-1: how many clusters vs individual columns
      
      characterCycling: true, // Enable character cycling/morphing
      cycleSpeed: 0.03,       // 0-1: probability of character changing per frame
      cycleDecay: 0.95,       // 0-1: how quickly cycling slows down with age
      ...config,
    };

    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.columns = [];
    this.clusters = [];      // Track clusters of columns
    this.storageKey = 'matrix-rain-v2-config';
    this.init();
  }

  init() {
    this.loadConfig();
    this.createCanvas();
    this.setupColumnsAndClusters();
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
        console.warn('Failed to load Matrix V2 config:', e);
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
    this.canvas.id = 'matrix-rain-v2-canvas';
    
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
    this.setupColumnsAndClusters();
  }

  /**
   * Setup columns with cluster support
   */
  setupColumnsAndClusters() {
    const fontSize = this.config.fontSize;
    const columnCount = Math.floor(this.screenWidth / fontSize);
    
    this.columns = [];
    this.clusters = [];
    
    if (!this.config.clusterMode) {
      // Original mode - independent columns
      this.setupIndependentColumns(columnCount, fontSize);
      return;
    }
    
    // V2 Cluster Mode
    const usedColumns = new Set();
    
    // Create clusters
    while (usedColumns.size < columnCount * this.config.density) {
      // Random starting column for this cluster
      let startCol = Math.floor(Math.random() * columnCount);
      
      // Skip if already used
      if (usedColumns.has(startCol)) continue;
      
      // Decide if this should be a cluster or solo column
      const isCluster = Math.random() < this.config.clusterDensity;
      
      if (isCluster) {
        const cluster = this.createCluster(startCol, columnCount, usedColumns, fontSize);
        if (cluster.columns.length > 0) {
          this.clusters.push(cluster);
        }
      } else {
        // Solo column
        if (!usedColumns.has(startCol)) {
          usedColumns.add(startCol);
          this.columns.push(this.createColumn(startCol, fontSize, null));
        }
      }
    }
  }

  /**
   * Create a cluster of columns that fall together like a raindrop
   */
  createCluster(startCol, maxCols, usedColumns, fontSize) {
    const clusterSize = Math.floor(2 + Math.random() * (this.config.clusterSize - 1));
    const spread = this.config.clusterSpread;
    
    // Shared cluster properties - all columns move together
    const clusterSpeed = (0.4 + Math.random() * 1.2) * this.config.speed;
    const clusterFadeTime = Math.floor(80 + Math.random() * 120);
    const clusterStartY = Math.random() * this.screenHeight;
    
    const cluster = {
      speed: clusterSpeed,
      fadeTime: clusterFadeTime,
      centerY: clusterStartY, // Center point of the cluster
      columns: [],
    };
    
    // Create columns in a raindrop formation
    for (let i = 0; i < clusterSize; i++) {
      // Spread columns out horizontally
      const colIndex = startCol + Math.floor(i * spread * (Math.random() * 0.5 + 0.75));
      
      if (colIndex >= maxCols || usedColumns.has(colIndex)) continue;
      
      usedColumns.add(colIndex);
      
      // Create raindrop shape: columns near center are ahead (lower Y), outer columns trail behind
      // This creates a teardrop/blob formation
      const distanceFromCenter = Math.abs(i - clusterSize / 2);
      const maxDistance = clusterSize / 2;
      const verticalOffset = (distanceFromCenter / maxDistance) * fontSize * 5; // Outer columns trail by up to 5 chars
      
      const column = this.createColumn(colIndex, fontSize, cluster, verticalOffset);
      cluster.columns.push(column);
      this.columns.push(column);
    }
    
    return cluster;
  }

  /**
   * Create a single column
   */
  createColumn(columnIndex, fontSize, cluster, verticalOffset = 0) {
    const baseSpeed = cluster ? cluster.speed : (0.4 + Math.random() * 1.2) * this.config.speed;
    
    // For clustered columns, position relative to cluster center
    const startY = cluster 
      ? cluster.centerY + verticalOffset
      : Math.random() * this.screenHeight;
    
    return {
      x: columnIndex,
      chars: [],              // Array of {char, y, age, cycleRate}
      spawnEvery: fontSize,
      distanceSinceSpawn: Math.random() * fontSize,
      fadeTime: cluster ? cluster.fadeTime : Math.floor(80 + Math.random() * 120),
      currentY: startY,
      speed: baseSpeed,       // Exact same speed for clustered columns
      cluster: cluster,       // Reference to parent cluster if any
      offsetFromCluster: verticalOffset, // Fixed offset from cluster center
    };
  }

  /**
   * Setup independent columns (original mode)
   */
  setupIndependentColumns(columnCount, fontSize) {
    for (let i = 0; i < columnCount; i++) {
      if (Math.random() < this.config.density) {
        this.columns.push(this.createColumn(i, fontSize, null));
      }
    }
  }

  getRandomCharacter() {
    return this.config.characterSet.charAt(
      Math.floor(Math.random() * this.config.characterSet.length)
    );
  }

  /**
   * Cycle/morph a character to a new one
   */
  cycleCharacter(charData) {
    if (!this.config.characterCycling) return;
    
    // Probability decreases with age (older chars cycle less)
    const ageFactor = Math.pow(this.config.cycleDecay, charData.age / 10);
    const cycleChance = this.config.cycleSpeed * ageFactor;
    
    if (Math.random() < cycleChance) {
      charData.char = this.getRandomCharacter();
    }
  }

  animate() {
    const fontSize = this.config.fontSize;
    
    // Clear canvas completely
    this.ctx.fillStyle = 'rgba(12, 29, 18, 1)';
    this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // Get color from current theme
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    this.ctx.font = `bold ${fontSize}px monospace`;
    this.ctx.textAlign = 'center';

    // Update cluster centers first
    if (this.config.clusterMode) {
      this.clusters.forEach(cluster => {
        cluster.centerY += cluster.speed;
        
        // Wrap cluster position
        if (cluster.centerY > this.screenHeight + fontSize * 20) {
          cluster.centerY = -fontSize * 10;
        }
      });
    }

    this.columns.forEach((column) => {
      if (column.cluster) {
        // Clustered columns: maintain position relative to cluster center
        column.currentY = column.cluster.centerY + column.offsetFromCluster;
      } else {
        // Independent columns: move on their own
        column.currentY += column.speed;
        
        // Wrap independent columns
        if (column.currentY > this.screenHeight) {
          column.currentY = -20;
        }
      }
      
      // Track distance traveled for spawning
      column.distanceSinceSpawn += column.speed;
      
      // Spawn new character when we've moved fontSize distance
      if (column.distanceSinceSpawn >= column.spawnEvery) {
        column.distanceSinceSpawn -= column.spawnEvery;
        
        // New character spawns at currentY and stays there
        column.chars.push({
          char: this.getRandomCharacter(),
          y: column.currentY,
          age: 0,
          cycleRate: 0.5 + Math.random() * 0.5, // Individual cycling speed multiplier
        });
      }

      // Update and draw all characters in this column
      column.chars.forEach((charData, index) => {
        // Age the character
        charData.age += 1;
        
        // Cycle/morph character
        this.cycleCharacter(charData);

        // Only draw if on screen
        if (charData.y > -fontSize && charData.y < this.screenHeight) {
          // Fade out based on age
          const alpha = Math.max(0, 1 - (charData.age / column.fadeTime));
          
          // Brightest at the head (youngest chars)
          const brightness = charData.age < 5 ? 1.2 - (charData.age * 0.04) : 1;
          
          this.ctx.globalAlpha = alpha;
          
          // Draw with brightness variation (head of trail is brighter)
          if (brightness > 1) {
            this.ctx.fillStyle = this.brightenColor(accentColor, brightness);
          } else {
            this.ctx.fillStyle = accentColor;
          }
          
          this.ctx.fillText(charData.char, column.x * fontSize + fontSize / 2, charData.y);
        }
      });

      this.ctx.globalAlpha = 1;

      // Remove aged-out characters
      column.chars = column.chars.filter(c => c.age < column.fadeTime);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Brighten a color for the head of the rain trail
   */
  brightenColor(color, factor) {
    // Simple brightness boost for the leading characters
    return color; // For now, keep it simple
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
      } else if (key === 'density' || key === 'speed' || key === 'clusterMode' || key.startsWith('cluster')) {
        // These require regenerating columns
        this.setupColumnsAndClusters();
      }
    }
  }

  setFontSize(size) {
    this.config.fontSize = size;
    this.saveConfig();
    // Regenerate columns with new font size
    this.setupColumnsAndClusters();
  }

  /**
   * Toggle cluster mode on/off
   */
  toggleClusterMode() {
    this.config.clusterMode = !this.config.clusterMode;
    this.saveConfig();
    this.setupColumnsAndClusters();
    return this.config.clusterMode;
  }

  /**
   * Toggle character cycling on/off
   */
  toggleCharacterCycling() {
    this.config.characterCycling = !this.config.characterCycling;
    this.saveConfig();
    return this.config.characterCycling;
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.matrixRainV2 = new MatrixRainV2();
  });
} else {
  window.matrixRainV2 = new MatrixRainV2();
}

