// load-components.js
class ComponentLoader {
    constructor() {
        this.components = ['header', 'footer', 'head'];
    }
    
    async loadComponent(componentName) {
        try {
            const response = await fetch(`/includes/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName}`);
            }
            const html = await response.text();
            
            if (componentName === 'head') {
                document.head.insertAdjacentHTML('beforeend', html);
            } else {
                const container = document.createElement('div');
                container.innerHTML = html;
                document.body.prepend(container.firstChild);
            }
            
            console.log(`✓ Loaded ${componentName}`);
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
        }
    }
    
    async loadAll() {
        for (const component of this.components) {
            await this.loadComponent(component);
        }
    }
}

// 在页面加载时自动加载组件
document.addEventListener('DOMContentLoaded', () => {
    const loader = new ComponentLoader();
    loader.loadAll();
});