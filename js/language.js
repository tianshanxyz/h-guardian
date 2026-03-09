// Language switcher functionality
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.languages = ['en', 'fr', 'es', 'ar'];
        this.translations = {};
        this.isInitialized = false;
        this.init();
    }
    
    async init() {
        console.log('LanguageManager: Initializing...');
        
        // Load all language files
        for (const lang of this.languages) {
            try {
                console.log(`LanguageManager: Loading ${lang}.json...`);
                const response = await fetch(`lang/${lang}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                this.translations[lang] = await response.json();
                console.log(`LanguageManager: ${lang} loaded successfully`);
            } catch (error) {
                console.error(`LanguageManager: Failed to load ${lang} translations:`, error);
            }
        }
        
        // Get saved language or detect browser language
        let targetLang = 'en';
        const savedLang = localStorage.getItem('h-guardian-lang');
        
        if (savedLang && this.languages.includes(savedLang)) {
            targetLang = savedLang;
            console.log('LanguageManager: Using saved language:', targetLang);
        } else {
            const browserLang = navigator.language.split('-')[0];
            if (this.languages.includes(browserLang)) {
                targetLang = browserLang;
                console.log('LanguageManager: Using browser language:', targetLang);
            }
        }
        
        // Apply language
        this.setLanguage(targetLang, false);
        
        // Set up language switcher events
        this.setupLanguageSwitcher();
        this.isInitialized = true;
        console.log('LanguageManager: Initialization complete');
    }
    
    setupLanguageSwitcher() {
        const languageLinks = document.querySelectorAll('[data-lang]');
        
        languageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = link.getAttribute('data-lang');
                console.log('LanguageManager: Language clicked:', lang);
                this.setLanguage(lang, true);
                
                // Close dropdown
                const dropdown = link.closest('.language-dropdown');
                if (dropdown) {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                }
            });
        });
        
        this.updateLanguageButton();
    }
    
    setLanguage(lang, shouldSave = true) {
        console.log('LanguageManager: setLanguage called with:', lang);
        
        if (!this.languages.includes(lang)) {
            console.error('LanguageManager: Language not available:', lang);
            return;
        }
        
        if (!this.translations[lang]) {
            console.error('LanguageManager: Translations not loaded for:', lang);
            return;
        }
        
        this.currentLang = lang;
        
        if (shouldSave) {
            localStorage.setItem('h-guardian-lang', lang);
        }
        
        console.log('LanguageManager: Applying translations for:', lang);
        this.updatePageContent();
        this.updateLanguageButton();
        this.updateDirection(lang);
        
        console.log('LanguageManager: Language changed to:', lang);
    }
    
    updatePageContent() {
        const translations = this.translations[this.currentLang];
        
        if (!translations) {
            console.error('LanguageManager: No translations found for:', this.currentLang);
            return;
        }
        
        // Update all elements with data-translate attribute
        let translatedCount = 0;
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                element.textContent = translations[key];
                translatedCount++;
            }
        });
        
        // Update placeholder texts
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[key]) {
                element.setAttribute('placeholder', translations[key]);
            }
        });
        
        // Update alt texts for images
        document.querySelectorAll('[data-translate-alt]').forEach(element => {
            const key = element.getAttribute('data-translate-alt');
            if (translations[key]) {
                element.setAttribute('alt', translations[key]);
            }
        });
        
        // Update page title
        if (translations['page_title']) {
            document.title = translations['page_title'];
        }
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && translations['meta_description']) {
            metaDescription.setAttribute('content', translations['meta_description']);
        }
        
        console.log(`LanguageManager: Translated ${translatedCount} elements`);
    }
    
    updateLanguageButton() {
        const languageBtn = document.querySelector('.language-btn');
        if (languageBtn) {
            const langNames = {
                'en': 'English',
                'fr': 'Français',
                'es': 'Español',
                'ar': 'العربية'
            };
            
            languageBtn.innerHTML = `<i class="fas fa-globe"></i> ${langNames[this.currentLang].substring(0, 2).toUpperCase()}`;
        }
    }
    
    updateDirection(lang) {
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = lang;
        }
    }
    
    getTranslation(key, params = {}) {
        let translation = this.translations[this.currentLang]?.[key] || key;
        
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    }
    
    addLanguage(langCode) {
        if (!this.languages.includes(langCode)) {
            this.languages.push(langCode);
        }
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Export for use in other scripts
window.getTranslation = (key, params) => languageManager.getTranslation(key, params);
window.languageManager = languageManager;
