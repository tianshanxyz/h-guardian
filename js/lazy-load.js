/**
 * Lazy Loading Script
 * Implements intersection observer for lazy loading images
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    // Check if browser supports WebP
    function supportsWebP() {
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    }

    // Get WebP version of image path
    function getWebPPath(src) {
        if (!src) return src;
        // Only convert jpg/jpeg/png to webp
        if (/\.(jpg|jpeg|png)$/i.test(src)) {
            return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        return src;
    }

    // Create picture element with WebP support
    function createPictureElement(img) {
        const src = img.getAttribute('data-src') || img.src;
        const alt = img.alt || '';
        const className = img.className || '';
        
        // Skip if already processed or no src
        if (!src || img.dataset.lazyProcessed) return;

        // Create picture element
        const picture = document.createElement('picture');
        if (className) picture.className = className;

        // Add WebP source
        const webpSrc = getWebPPath(src);
        if (webpSrc !== src) {
            const webpSource = document.createElement('source');
            webpSource.srcset = webpSrc;
            webpSource.type = 'image/webp';
            picture.appendChild(webpSource);
        }

        // Add original format fallback
        const originalSource = document.createElement('source');
        originalSource.srcset = src;
        if (/\.jpg$/i.test(src)) originalSource.type = 'image/jpeg';
        else if (/\.jpeg$/i.test(src)) originalSource.type = 'image/jpeg';
        else if (/\.png$/i.test(src)) originalSource.type = 'image/png';
        picture.appendChild(originalSource);

        // Move image into picture
        img.dataset.lazyProcessed = 'true';
        img.removeAttribute('data-src');
        
        const newImg = img.cloneNode(true);
        newImg.src = src;
        picture.appendChild(newImg);

        // Replace original image with picture
        img.parentNode.replaceChild(picture, img);
    }

    // Lazy load image
    function loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Create picture element for WebP support
        if (supportsWebP()) {
            createPictureElement(img);
        } else {
            img.src = src;
            img.removeAttribute('data-src');
        }

        img.classList.add('lazy-loaded');
    }

    // Initialize lazy loading
    function initLazyLoading() {
        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images immediately
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(loadImage);
            return;
        }

        // Create intersection observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, CONFIG);

        // Observe all images with data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));

        // Also observe images with loading="lazy" for browsers that support it
        const nativeLazyImages = document.querySelectorAll('img[loading="lazy"]');
        nativeLazyImages.forEach(img => {
            if (!img.getAttribute('data-src')) {
                // Convert to data-src for consistent handling
                const src = img.src;
                img.setAttribute('data-src', src);
                img.removeAttribute('src');
                
                // Add placeholder
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                
                imageObserver.observe(img);
            }
        });
    }

    // Add CSS for lazy loading
    function addLazyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            img[data-src] {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            img.lazy-loaded {
                opacity: 1;
            }
            .image-placeholder {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: lazy-loading 1.5s infinite;
            }
            @keyframes lazy-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addLazyStyles();
            initLazyLoading();
        });
    } else {
        addLazyStyles();
        initLazyLoading();
    }

    // Re-initialize on dynamic content load
    window.initLazyLoading = initLazyLoading;
})();
