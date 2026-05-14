/**
 * Component Loader with Data Binding
 * Loads templates and JSON data, renders components
 */
class ComponentLoader {
  constructor() {
    this.templateCache = new Map();
    this.dataCache = new Map();
    this.isInitialized = false;
    this.renderedCount = 0;
    this.totalComponents = 0;
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    console.log('ComponentLoader initialized');
    this.renderAllComponents();
  }

  /**
   * Load template with caching
   * @param {string} path - Path relative to /templates/ (e.g., 'layout/sidebar')
   */
  async loadTemplate(path) {
    // Если путь уже содержит слэш, считаем его полным относительно templates/
    // Иначе ищем в папке components/ (для обратной совместимости)
    let fullPath = path.includes('/') ? path : `components/${path}`;
    
    // Добавляем расширение .html если нет
    if (!fullPath.endsWith('.html')) {
      fullPath += '.html';
    }

    const cacheKey = fullPath;
    
    if (this.templateCache.has(cacheKey)) {
      console.log(`📦 From cache: ${fullPath}`);
      return this.templateCache.get(cacheKey);
    }

    try {
      const response = await fetch(`templates/${fullPath}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const html = await response.text();
      this.templateCache.set(cacheKey, html);
      console.log(`✅ Loaded template: ${fullPath}`);
      return html;
    } catch (error) {
      console.error(`❌ Error loading template: ${fullPath}`, error);
      return '<div class="art-error">Template not found: ' + fullPath + '</div>';
    }
  }

  /**
   * Load JSON data
   */
  async loadData(sourceName) {
    if (!sourceName) return {};
    
    if (this.dataCache.has(sourceName)) {
      return this.dataCache.get(sourceName);
    }

    try {
      const response = await fetch(`data/${sourceName}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      this.dataCache.set(sourceName, data);
      return data;
    } catch (error) {
      console.error(`❌ Error loading data: ${sourceName}`, error);
      return {};
    }
  }

  /**
   * Simple template compiler (replaces {{key}} with data.key)
   */
  compile(template, data) {
    if (!data) return template;
    
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const keys = key.trim().split('.');
      let value = data;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return match; // Key not found
        }
      }
      
      return value !== undefined ? value : match;
    });
  }

  /**
   * Render single component
   */
  async renderComponent(element, index) {
    const componentName = element.dataset.component;
    const sourceName = element.dataset.source;
    
    if (!componentName) return;

    console.log(`🔧 Loading component: ${componentName}`);

    // Load template and data in parallel
    const [template, data] = await Promise.all([
      this.loadTemplate(componentName),
      this.loadData(sourceName)
    ]);

    // Compile and render
    const html = this.compile(template, data);
    element.innerHTML = html;
    
    console.log(`✓ Rendered: ${componentName} (index ${index})`);
    
    this.renderedCount++;
    this.checkComplete();
  }

  /**
   * Render all components on page
   */
  async renderAllComponents() {
    const components = document.querySelectorAll('[data-component]');
    this.totalComponents = components.length;
    
    if (this.totalComponents === 0) {
      console.log('No components found. Dispatching componentsReady.');
      window.dispatchEvent(new Event('componentsReady'));
      return;
    }

    console.log(`Found ${this.totalComponents} components to render.`);

    // Render sequentially to preserve order (important for layout)
    for (let i = 0; i < components.length; i++) {
      await this.renderComponent(components[i], i);
    }
  }

  /**
   * Check if all components rendered
   */
  checkComplete() {
    if (this.renderedCount >= this.totalComponents) {
      console.log(`All ${this.totalComponents} components rendered.`);
      window.dispatchEvent(new Event('componentsReady'));
    }
  }
}

// Make globally available
window.ComponentLoader = ComponentLoader;
