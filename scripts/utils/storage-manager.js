/**
 * Storage Manager Utility
 * Centralized localStorage management with error handling and quota checks
 * 
 * @class StorageManager
 */
class StorageManager {
  /**
   * Get an item from localStorage with JSON parsing
   * @param {string} key - The storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} The stored value or default
   */
  static get(key, defaultValue = null) {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) {
        return defaultValue;
      }
      
      // Try to parse as JSON, fallback to raw string
      try {
        return JSON.parse(stored);
      } catch {
        return stored;
      }
    } catch (error) {
      console.error(`StorageManager: Error reading key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Set an item in localStorage with JSON stringification
   * @param {string} key - The storage key
   * @param {*} value - The value to store
   * @returns {boolean} Success status
   */
  static set(key, value) {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      
      // Check size before storing (warning at 5MB)
      if (data.length > 5 * 1024 * 1024) {
        console.warn(`StorageManager: Large data for key "${key}" (${(data.length / 1024 / 1024).toFixed(2)}MB)`);
      }
      
      localStorage.setItem(key, data);
      return true;
    } catch (error) {
      console.error(`StorageManager: Error storing key "${key}":`, error);
      
      if (error.name === 'QuotaExceededError') {
        console.error('StorageManager: LocalStorage quota exceeded');
      }
      
      return false;
    }
  }

  /**
   * Remove an item from localStorage
   * @param {string} key - The storage key
   * @returns {boolean} Success status
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`StorageManager: Error removing key "${key}":`, error);
      return false;
    }
  }

  /**
   * Check if a key exists in localStorage
   * @param {string} key - The storage key
   * @returns {boolean} Whether the key exists
   */
  static has(key) {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Clear all items from localStorage
   * @param {string} prefix - Optional prefix to clear only specific keys
   */
  static clear(prefix = null) {
    try {
      if (prefix) {
        // Clear only keys with specific prefix
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        localStorage.clear();
      }
      return true;
    } catch (error) {
      console.error('StorageManager: Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get the total size of localStorage usage
   * @returns {Object} Object with size in bytes and KB
   */
  static getSize() {
    let totalSize = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    return {
      bytes: totalSize,
      kb: (totalSize / 1024).toFixed(2)
    };
  }

  /**
   * Export all localStorage data as JSON
   * @returns {string} JSON string of all data
   */
  static export() {
    const data = {};
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        data[key] = localStorage[key];
      }
    }
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data into localStorage from JSON
   * @param {string} jsonData - JSON string to import
   * @param {boolean} merge - Whether to merge or replace existing data
   */
  static import(jsonData, merge = false) {
    try {
      const data = JSON.parse(jsonData);
      
      if (!merge) {
        localStorage.clear();
      }
      
      for (const [key, value] of Object.entries(data)) {
        localStorage.setItem(key, value);
      }
      
      return true;
    } catch (error) {
      console.error('StorageManager: Error importing data:', error);
      return false;
    }
  }
}

// Make it globally available
window.StorageManager = StorageManager;

