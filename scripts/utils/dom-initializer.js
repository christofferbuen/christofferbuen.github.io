/**
 * DOM Initializer Utility
 * Centralized DOM ready handling to reduce boilerplate across modules
 * 
 * @class DOMInitializer
 */
class DOMInitializer {
  constructor() {
    this.callbacks = [];
    this.isReady = document.readyState !== 'loading';
    
    if (this.isReady) {
      // DOM is already ready, execute callbacks immediately
      this.executeCallbacks();
    } else {
      // Wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', () => {
        this.isReady = true;
        this.executeCallbacks();
      });
    }
  }

  /**
   * Register a callback to execute when DOM is ready
   * @param {Function} callback - Function to execute
   * @param {number} priority - Execution priority (lower = earlier, default: 100)
   */
  onReady(callback, priority = 100) {
    if (typeof callback !== 'function') {
      console.error('DOMInitializer: Callback must be a function');
      return;
    }

    this.callbacks.push({ callback, priority });
    
    // Sort by priority (lower numbers first)
    this.callbacks.sort((a, b) => a.priority - b.priority);

    // If DOM is already ready, execute immediately
    if (this.isReady) {
      callback();
    }
  }

  /**
   * Execute all registered callbacks
   */
  executeCallbacks() {
    this.callbacks.forEach(({ callback }) => {
      try {
        callback();
      } catch (error) {
        console.error('DOMInitializer: Error executing callback:', error);
      }
    });
  }

  /**
   * Wait for a specific element to be available
   * @param {string} selector - CSS selector
   * @param {Function} callback - Callback to execute when element is found
   * @param {number} timeout - Max time to wait in ms (default: 5000)
   */
  waitForElement(selector, callback, timeout = 5000) {
    const startTime = Date.now();
    
    const checkElement = () => {
      const element = document.querySelector(selector);
      
      if (element) {
        callback(element);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        console.warn(`DOMInitializer: Timeout waiting for element "${selector}"`);
        return;
      }
      
      requestAnimationFrame(checkElement);
    };
    
    this.onReady(checkElement);
  }

  /**
   * Wait for multiple elements to be available
   * @param {string[]} selectors - Array of CSS selectors
   * @param {Function} callback - Callback to execute when all elements are found
   * @param {number} timeout - Max time to wait in ms (default: 5000)
   */
  waitForElements(selectors, callback, timeout = 5000) {
    const startTime = Date.now();
    const elements = {};
    
    const checkElements = () => {
      let allFound = true;
      
      selectors.forEach(selector => {
        if (!elements[selector]) {
          const element = document.querySelector(selector);
          if (element) {
            elements[selector] = element;
          } else {
            allFound = false;
          }
        }
      });
      
      if (allFound) {
        callback(elements);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        console.warn('DOMInitializer: Timeout waiting for elements:', selectors);
        return;
      }
      
      requestAnimationFrame(checkElements);
    };
    
    this.onReady(checkElements);
  }

  /**
   * Wait for a global variable to be defined
   * @param {string} variableName - Name of the global variable
   * @param {Function} callback - Callback to execute when variable is defined
   * @param {number} timeout - Max time to wait in ms (default: 5000)
   */
  waitForGlobal(variableName, callback, timeout = 5000) {
    const startTime = Date.now();
    
    const checkGlobal = () => {
      if (window[variableName] !== undefined) {
        callback(window[variableName]);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        console.warn(`DOMInitializer: Timeout waiting for global "${variableName}"`);
        return;
      }
      
      setTimeout(checkGlobal, 50);
    };
    
    this.onReady(checkGlobal);
  }

  /**
   * Wait for multiple global variables
   * @param {string[]} variableNames - Array of global variable names
   * @param {Function} callback - Callback with object containing all variables
   * @param {number} timeout - Max time to wait in ms (default: 5000)
   */
  waitForGlobals(variableNames, callback, timeout = 5000) {
    const startTime = Date.now();
    const globals = {};
    
    const checkGlobals = () => {
      let allFound = true;
      
      variableNames.forEach(name => {
        if (globals[name] === undefined && window[name] !== undefined) {
          globals[name] = window[name];
        }
        if (globals[name] === undefined) {
          allFound = false;
        }
      });
      
      if (allFound) {
        callback(globals);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        console.warn('DOMInitializer: Timeout waiting for globals:', variableNames);
        return;
      }
      
      setTimeout(checkGlobals, 50);
    };
    
    this.onReady(checkGlobals);
  }
}

// Create global instance
window.domInitializer = new DOMInitializer();

// Convenience function for quick usage
window.onDOMReady = (callback, priority) => {
  window.domInitializer.onReady(callback, priority);
};

