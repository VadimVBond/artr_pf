/**
 * i18n Module for Arter Portfolio
 * Simple translation system with JSON locale files
 */

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'en';
    this.translations = {};
    this.fallbackLang = 'en';
  }

  async init() {
    await this.loadLocale(this.currentLang);
    await this.loadLocale(this.fallbackLang);
    this.applyTranslations();
    console.log(`✓ i18n initialized: ${this.currentLang}`);
  }

  async loadLocale(lang) {
    if (this.translations[lang]) return this.translations[lang];

    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.translations[lang] = data;
      return data;
    } catch (err) {
      console.warn(`Locale not found: ${lang}`, err);
      this.translations[lang] = {};
      return {};
    }
  }

  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];

    for (const k of keys) {
      value = value?.[k];
    }

    // Fallback to default language
    if (value === undefined) {
      let fallback = this.translations[this.fallbackLang];
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      value = fallback;
    }

    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (_, param) => params[param] || '');
    }

    return key;
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const params = JSON.parse(el.dataset.i18nParams || '{}');
      el.innerHTML = this.t(key, params);
    });

    // Update title if available
    const title = this.t('meta.title');
    if (title !== 'meta.title') {
      document.title = title;
    }

    console.log(`✓ Applied translations: ${Object.querySelectorAll('[data-i18n]').length} elements`);
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    this.init();
  }

  getLanguage() {
    return this.currentLang;
  }
}

// Global instance
window.i18n = new I18n();
