/**
 * Components Loader for Arter Portfolio
 * Loads HTML fragments and renders them with data from /data/*.json
 */

class ComponentLoader {
  constructor() {
    this.cache = new Map();
    this.dataCache = new Map();
    this.loadedCount = 0;
    this.totalComponents = 0;
  }

  async loadData(dataName) {
    if (this.dataCache.has(dataName)) {
      return this.dataCache.get(dataName);
    }

    try {
      const response = await fetch(`data/${dataName}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.dataCache.set(dataName, data);
      return data;
    } catch (err) {
      console.error(`Error loading data: ${dataName}`, err);
      return null;
    }
  }

  async loadTemplate(componentName) {
    if (this.cache.has(componentName)) {
      return this.cache.get(componentName);
    }

    // Try multiple paths for different component types
    const paths = [
      `templates/components/${componentName}.html`,
      `templates/cards/${componentName}.html`,
      `templates/sections/${componentName}.html`,
      `templates/layout/${componentName}.html`
    ];

    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const html = await response.text();
          this.cache.set(componentName, html);
          console.log(`Loaded template from: ${path}`);
          return html;
        }
      } catch (err) {
        // Try next path
      }
    }

    console.error(`Error loading template: ${componentName} (tried ${paths.join(', ')})`);
    return null;
  }

  renderTemplate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return data[key] !== undefined ? data[key] : `{{${key}}}`;
    });
  }

  async renderComponent(el) {
    const componentName = el.getAttribute('data-component');
    const dataName = el.getAttribute('data-source') || componentName;
    const index = el.getAttribute('data-index');

    console.log(`Loading component: ${componentName}`);

    const template = await this.loadTemplate(componentName);
    if (!template) {
      this.loadedCount++;
      this.checkComplete();
      return;
    }

    const data = await this.loadData(dataName);
    if (!data) {
      el.innerHTML = `<!-- Error: data '${dataName}' not found -->`;
      this.loadedCount++;
      this.checkComplete();
      return;
    }

    // Определяем массив данных для рендеринга
    let itemsArray = null;
    
    // Сначала пробуем найти массив по ключу, совпадающему с именем компонента или data-source
    // Например, для counters.json ищем data.counters, для services.json ищем data.services или data.items
    const possibleKeys = [dataName, 'items', 'data'];
    
    for (const key of possibleKeys) {
      if (data[key] && Array.isArray(data[key])) {
        itemsArray = data[key];
        break;
      }
    }
    
    // Если не нашли, пробуем первый ключ в объекте
    if (!itemsArray) {
      const firstKey = Object.keys(data)[0];
      if (firstKey && Array.isArray(data[firstKey])) {
        itemsArray = data[firstKey];
      }
    }

    // Если указан индекс, рендерим конкретный элемент массива
    if (index !== null && itemsArray) {
      const item = itemsArray[parseInt(index)];
      if (item) {
        el.innerHTML = this.renderTemplate(template, item);
        console.log(`✓ Rendered: ${componentName} (index ${index})`);
      } else {
        console.warn(`Item at index ${index} not found in ${dataName}`);
      }
    } else if (itemsArray && itemsArray.length > 0) {
      // Если нет индекса, но есть массив - рендерим первый элемент
      el.innerHTML = this.renderTemplate(template, itemsArray[0]);
      console.log(`✓ Rendered: ${componentName} (first item)`);
    } else {
      // Иначе рендерим данные как объект
      el.innerHTML = this.renderTemplate(template, data);
      console.log(`✓ Rendered: ${componentName} (object)`);
    }

    this.loadedCount++;
    this.checkComplete();
  }

  checkComplete() {
    if (this.loadedCount === this.totalComponents) {
      console.log(`All ${this.totalComponents} components rendered.`);
      window.dispatchEvent(new Event('componentsReady'));
    }
  }

  async init() {
    const components = document.querySelectorAll('[data-component]');
    this.totalComponents = components.length;

    if (this.totalComponents === 0) {
      window.dispatchEvent(new Event('componentsReady'));
      return;
    }

    console.log(`Found ${this.totalComponents} components to render.`);

    components.forEach(el => this.renderComponent(el));
  }
}

// Auto-init on DOM ready
// document.addEventListener('DOMContentLoaded', () => {
//   const loader = new ComponentLoader();
//   loader.init();
// });
