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
      const response = await fetch(`templates/${fullPath}`, { cache: 'no-store' });
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
      const response = await fetch(`data/${sourceName}.json`, { cache: 'no-store' });
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
   * Resolve dot-notated value from current context with root fallback
   */
  getValue(path, context, root = context) {
    if (!path || path === '.' || path === 'this') {
      return context;
    }

    const resolveFrom = (source) => {
      if (source == null) return undefined;

      const keys = path.trim().split('.');
      let value = source;

      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return undefined;
        }
      }

      return value;
    };

    const localValue = resolveFrom(context);
    return localValue !== undefined ? localValue : resolveFrom(root);
  }

  /**
   * Find matching closing block for nested {{#each}} / {{#if}} sections
   */
  findMatchingBlock(template, startIndex, blockType) {
    const tagRegex = /\{\{(#|\/)(each|if)\b(?:\s+[^}]*)?\}\}/g;
    tagRegex.lastIndex = startIndex;

    let depth = 1;
    let match;

    while ((match = tagRegex.exec(template)) !== null) {
      const [, marker, type] = match;

      if (type !== blockType) continue;

      if (marker === '#') {
        depth++;
      } else {
        depth--;
        if (depth === 0) {
          return {
            start: match.index,
            end: tagRegex.lastIndex
          };
        }
      }
    }

    return null;
  }

  /**
   * Render template with minimal block support used by current templates
   */
  renderTemplate(template, context, root = context) {
    if (typeof template !== 'string') return '';

    let output = '';
    let cursor = 0;
    const tagRegex = /\{\{([^}]+)\}\}/g;
    let match;

    while ((match = tagRegex.exec(template)) !== null) {
      output += template.slice(cursor, match.index);

      const expression = match[1].trim();

      if (expression.startsWith('#each ')) {
        const path = expression.slice(6).trim();
        const block = this.findMatchingBlock(template, tagRegex.lastIndex, 'each');

        if (!block) {
          output += match[0];
          cursor = tagRegex.lastIndex;
          continue;
        }

        const items = this.getValue(path, context, root);
        const innerTemplate = template.slice(tagRegex.lastIndex, block.start);

        if (Array.isArray(items)) {
          output += items
            .map(item => this.renderTemplate(innerTemplate, item, root))
            .join('');
        }

        cursor = block.end;
        tagRegex.lastIndex = block.end;
        continue;
      }

      if (expression.startsWith('#if ')) {
        const path = expression.slice(4).trim();
        const block = this.findMatchingBlock(template, tagRegex.lastIndex, 'if');

        if (!block) {
          output += match[0];
          cursor = tagRegex.lastIndex;
          continue;
        }

        const value = this.getValue(path, context, root);
        const innerTemplate = template.slice(tagRegex.lastIndex, block.start);

        if (value) {
          output += this.renderTemplate(innerTemplate, context, root);
        }

        cursor = block.end;
        tagRegex.lastIndex = block.end;
        continue;
      }

      if (expression.startsWith('/')) {
        cursor = tagRegex.lastIndex;
        continue;
      }

      const value = this.getValue(expression, context, root);
      output += value !== undefined && value !== null ? String(value) : '';
      cursor = tagRegex.lastIndex;
    }

    output += template.slice(cursor);
    return output;
  }

  /**
   * Backward-compatible alias used by legacy list renderer
   */
  compile(template, data) {
    return this.renderTemplate(template, data, data);
  }

  /**
   * Resolve component-specific data context from dataset attributes
   */
  resolveComponentData(element, data) {
    let resolvedData = data;
    const { key, index } = element.dataset;

    if (key && resolvedData && typeof resolvedData === 'object') {
      resolvedData = resolvedData[key];
    }

    if (index !== undefined) {
      const itemIndex = Number(index);

      if (Array.isArray(resolvedData)) {
        resolvedData = resolvedData[itemIndex];
      } else if (resolvedData && Array.isArray(resolvedData.items)) {
        resolvedData = resolvedData.items[itemIndex];
      }
    }

    return resolvedData ?? {};
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
    const componentData = this.resolveComponentData(element, data);
    const html = this.renderTemplate(template, componentData, componentData);
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
