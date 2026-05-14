/**
 * Render helper for Arter Portfolio
 * Renders lists of components from data arrays
 */

class ListRenderer {
  constructor(loader) {
    this.loader = loader;
  }

  async renderList(containerSelector, componentName, dataName, itemKey) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error(`Container not found: ${containerSelector}`);
      return;
    }

    const data = await this.loader.loadData(dataName);
    if (!data || !data[itemKey]) {
      console.error(`Data not found: ${dataName}.${itemKey}`);
      return;
    }

    const items = data[itemKey];
    const template = await this.loader.loadTemplate(componentName);

    if (!template) {
      console.error(`Template not found: ${componentName}`);
      return;
    }

    container.innerHTML = items.map(item => this.loader.renderTemplate(template, item)).join('');
    console.log(`✓ Rendered list: ${componentName} (${items.length} items)`);
  }
}

// Export for use in main.js
window.ListRenderer = ListRenderer;
