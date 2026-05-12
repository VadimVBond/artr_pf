/**
 * Components Loader for Arter Portfolio
 * Loads HTML fragments into elements with data-component attribute
 */
document.addEventListener("DOMContentLoaded", () => {
    const components = document.querySelectorAll('[data-component]');
    let loadedCount = 0;

    if (components.length === 0) return;

    console.log(`Found ${components.length} components to load.`);
    
    components.forEach(async (el) => {
        const componentName = el.getAttribute('data-component');
        const componentPath = `components/${componentName}.html`;
        console.log(`Loading component: ${componentName} from ${componentPath}`);
        
        try {
            const response = await fetch(componentPath);
            if (response.ok) {
                const html = await response.text();
                el.innerHTML = html;
                console.log(`Successfully loaded: ${componentName}`);
            } else {
                console.error(`Component not found: ${componentName} (Status: ${response.status})`);
            }
        } catch (err) {
            console.error(`Error loading component: ${componentName}`, err);
        } finally {
            loadedCount++;
            if (loadedCount === components.length) {
                console.log('All components loaded, dispatching componentsReady');
                window.dispatchEvent(new Event('componentsReady'));
            }
        }
    });
});
