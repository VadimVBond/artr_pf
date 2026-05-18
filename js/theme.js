/**
 * Theme Switcher for Arter Portfolio
 * Handles color theme switching and persistence
 */

class ThemeSwitcher {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'color-4';
    this.availableThemes = ['color-1', 'color-2', 'color-3', 'color-4'];
  }

  init() {
    this.applyTheme(this.currentTheme);
    console.log(`✓ Theme initialized: ${this.currentTheme}`);
  }

  applyTheme(themeName) {
    // Remove existing theme CSS
    const existingTheme = document.querySelector('link[href*="color-"]');
    if (existingTheme) {
      existingTheme.remove();
    }

    // Add new theme CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./css/${themeName}.css`;
    link.id = 'current-theme';
    document.head.appendChild(link);

    const themeColors = {
      'color-1': '#FFC107',
      'color-2': '#f44336',
      'color-3': '#4CAF50',
      'color-4': '#64B5F6'
    };
    const primaryColor = themeColors[themeName] || '#FFC107';
    document.documentElement.style.setProperty('--primary-color', primaryColor);

    this.currentTheme = themeName;
    localStorage.setItem('theme', themeName);
    console.log(`✓ Theme applied: ${themeName}`);
  }

  setTheme(themeName) {
    if (this.availableThemes.includes(themeName)) {
      this.applyTheme(themeName);
    } else {
      console.warn(`Theme not found: ${themeName}`);
    }
  }

  nextTheme() {
    const currentIndex = this.availableThemes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.availableThemes.length;
    this.setTheme(this.availableThemes[nextIndex]);
  }

  getTheme() {
    return this.currentTheme;
  }
}

// Global instance
window.themeSwitcher = new ThemeSwitcher();
