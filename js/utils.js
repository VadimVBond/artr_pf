/**
 * Utility functions for Arter Portfolio
 * Safe version without jQuery conflicts
 */

const Utils = {
  // Debounce function
  debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;

    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);

        inThrottle = true;

        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(el) {
    if (!el) return false;

    const rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Safe querySelector
  $(selector, parent = document) {
    if (typeof selector !== "string") {
      console.warn("Utils.$ expected string selector:", selector);
      return null;
    }

    try {
      return parent.querySelector(selector);
    } catch (error) {
      console.error("Invalid selector:", selector, error);
      return null;
    }
  },

  // Safe querySelectorAll
  $$(selector, parent = document) {
    if (typeof selector !== "string") {
      console.warn("Utils.$$ expected string selector:", selector);
      return [];
    }

    try {
      return parent.querySelectorAll(selector);
    } catch (error) {
      console.error("Invalid selector:", selector, error);
      return [];
    }
  },

  // Add event listener to multiple elements
  onAll(selector, event, callback) {
    this.$$(selector).forEach((el) => {
      el.addEventListener(event, callback);
    });
  },

  // Toggle class on element
  toggleClass(el, className) {
    if (el) {
      el.classList.toggle(className);
    }
  },

  // Add class to element
  addClass(el, className) {
    if (el) {
      el.classList.add(className);
    }
  },

  // Remove class from element
  removeClass(el, className) {
    if (el) {
      el.classList.remove(className);
    }
  },

  // Has class
  hasClass(el, className) {
    if (!el) return false;

    return el.classList.contains(className);
  },

  // Generate unique ID
  generateId(prefix = "id") {
    return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
  },

  // Format number with suffix
  formatNumber(num) {
    const number = Number(num);

    if (Number.isNaN(number)) return "0";

    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    }

    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }

    return number.toString();
  },

  // Wait for DOM ready
  ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }
};

// Export globally
window.Utils = Utils;

// IMPORTANT:
// Do NOT overwrite jQuery global "$"
// Safe aliases instead
window.dom$ = Utils.$.bind(Utils);
window.dom$$ = Utils.$$.bind(Utils);