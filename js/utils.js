/**
 * Utility functions for Arter Portfolio
 */

const Utils = {
  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Get element by selector
  $(selector) {
    return document.querySelector(selector);
  },

  // Get all elements by selector
  $$(selector) {
    return document.querySelectorAll(selector);
  },

  // Add event listener to multiple elements
  onAll(selector, event, callback) {
    this.$$(selector).forEach(el => el.addEventListener(event, callback));
  },

  // Toggle class on element
  toggleClass(el, className) {
    el.classList.toggle(className);
  },

  // Add class to element
  addClass(el, className) {
    el.classList.add(className);
  },

  // Remove class from element
  removeClass(el, className) {
    el.classList.remove(className);
  },

  // Has class
  hasClass(el, className) {
    return el.classList.contains(className);
  },

  // Generate unique ID
  generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  },

  // Format number with suffix
  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
};

// Export globally
window.Utils = Utils;
window.$ = Utils.$;
window.$$ = Utils.$$;
