/**
 * Optimized Lazy Loading Script
 * High-performance intersection observer for lazy loading images
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        rootMargin: '100px 0px', // Increased margin for earlier loading
        threshold: 0,
        enableWebP: true
    };

    // Check if browser supports WebP
    const supportsWebP = (function() {
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    })();

    // Get WebP version of image path
    function getWebPPath(src) {
        if (!src || !CONFIG.enableWebP || !supportsWebP) return src;
        // Only convert jpg/jpeg/png to webp
        if (/\.(jpg|jpeg|png)$/i.test(src)) {
            return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        return src;
    }

    // Load image with WebP support
    function loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Use WebP if supported
        const finalSrc = getWebPPath(src);
        
        // Create new image to preload
        const preloadImg = new Image();
        preloadImg.onload = function() {
            img.src = finalSrc;
            img.removeAttribute('data-src');
            img.classList.add('lazy-loaded');
            img.classList.remove('lazy-loading');
        };
        preloadImg.onerror = function() {
            // Fallback to original format
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('lazy-loaded');
            img.classList.remove('lazy-loading');
        };
        preloadImg.src = finalSrc;
        
        img.classList.add('lazy-loading');
    }

    // Initialize lazy loading
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (!lazyImages.length) return;

        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images immediately
            lazyImages.forEach(loadImage);
            return;
        }

        // Create intersection observer with optimized settings
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: CONFIG.rootMargin,
            threshold: CONFIG.threshold
        });

        // Observe all lazy images
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add optimized CSS for lazy loading
    function addLazyStyles() {
        if (document.getElementById('lazy-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'lazy-styles';
        style.textContent = `
            img[data-src] {
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
                background-size: 200% 100%;
            }
            img.lazy-loading {
                animation: lazy-shimmer 1.5s infinite;
            }
            img.lazy-loaded {
                opacity: 1;
                animation: none;
                background: none;
            }
            @keyframes lazy-shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addLazyStyles();
            initLazyLoading();
        });
    } else {
        addLazyStyles();
        initLazyLoading();
    }

    // Expose for dynamic content
    window.initLazyLoading = initLazyLoading;
})();
