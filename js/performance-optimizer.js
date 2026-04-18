/**
 * Performance Optimizer
 * Optimizes CSS and JS loading for better page speed
 */

(function() {
    'use strict';

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            { href: 'css/style.css', as: 'style' },
            { href: 'css/responsive.css', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = function() {
                    this.rel = 'stylesheet';
                };
            }
            document.head.appendChild(link);
        });
    }

    // Defer non-critical CSS
    function deferNonCriticalCSS() {
        const nonCriticalStyles = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];

        nonCriticalStyles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = href;
            link.as = 'style';
            link.onload = function() {
                this.rel = 'stylesheet';
            };
            document.head.appendChild(link);
        });
    }

    // Lazy load iframes and videos
    function lazyLoadMedia() {
        const mediaElements = document.querySelectorAll('iframe[data-src], video[data-src]');
        
        if (!('IntersectionObserver' in window)) {
            mediaElements.forEach(el => {
                const src = el.getAttribute('data-src');
                if (src) {
                    el.src = src;
                    el.removeAttribute('data-src');
                }
            });
            return;
        }

        const mediaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const src = el.getAttribute('data-src');
                    if (src) {
                        el.src = src;
                        el.removeAttribute('data-src');
                    }
                    mediaObserver.unobserve(el);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });

        mediaElements.forEach(el => mediaObserver.observe(el));
    }

    // Optimize third-party scripts
    function optimizeThirdPartyScripts() {
        // Defer Google Fonts loading
        const googleFontsLink = document.querySelector('link[href*="fonts.googleapis.com"]');
        if (googleFontsLink) {
            googleFontsLink.setAttribute('media', 'print');
            googleFontsLink.onload = function() {
                this.setAttribute('media', 'all');
            };
        }
    }

    // Add resource hints
    function addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
            { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            link.rel = hint.rel;
            link.href = hint.href;
            document.head.appendChild(link);
        });
    }

    // Remove render-blocking resources
    function removeRenderBlocking() {
        // Move non-critical scripts to the end of body
        const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
        nonCriticalScripts.forEach(script => {
            script.setAttribute('defer', '');
            script.removeAttribute('data-defer');
        });
    }

    // Initialize performance optimizations
    function init() {
        // Add resource hints
        addResourceHints();

        // Preload critical resources
        preloadCriticalResources();

        // Defer non-critical CSS
        deferNonCriticalCSS();

        // Lazy load media
        lazyLoadMedia();

        // Optimize third-party scripts
        optimizeThirdPartyScripts();

        // Remove render-blocking resources
        removeRenderBlocking();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for manual initialization
    window.PerformanceOptimizer = {
        init: init,
        lazyLoadMedia: lazyLoadMedia
    };
})();
