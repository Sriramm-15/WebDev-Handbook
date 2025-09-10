// Theme Management
class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.bindEvents();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeButton(theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
    }

    updateThemeButton(theme) {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    bindEvents() {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.activeSection = 'html';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showSection(this.activeSection);
    }

    bindEvents() {
        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
    }

    showSection(sectionId) {
        console.log('Showing section:', sectionId); // Debug log
        
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Section found and activated:', sectionId);
        } else {
            console.error('Section not found:', `${sectionId}-section`);
        }

        // Update navigation
        this.updateNavigation(sectionId);
        this.activeSection = sectionId;

        // Close mobile menu
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateNavigation(activeSection) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === activeSection) {
                btn.classList.add('active');
            }
        });
    }
}

// Code Copy Functionality
class CodeCopyManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
                const btn = e.target.classList.contains('copy-btn') ? e.target : e.target.closest('.copy-btn');
                this.copyCode(btn);
            }
        });
    }

    async copyCode(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code');
        
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code.textContent);
            this.showCopyFeedback(button);
        } catch (err) {
            console.error('Failed to copy code:', err);
            this.fallbackCopy(code.textContent);
            this.showCopyFeedback(button);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }

    showCopyFeedback(button) {
        const originalText = button.textContent;
        button.textContent = '✅';
        button.style.background = 'rgba(16, 185, 129, 0.2)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

// Interactive Demo Manager
class DemoManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindDemoEvents();
    }

    bindDemoEvents() {
        const demoBtn = document.getElementById('demo-btn');
        const changeColorBtn = document.getElementById('change-color-btn');
        const addTextBtn = document.getElementById('add-text-btn');
        const output = document.getElementById('demo-output');

        if (demoBtn && output) {
            demoBtn.addEventListener('click', () => {
                output.innerHTML = '<p style="color: #2563eb; font-weight: 600;">Button was clicked! 🎉</p>';
            });
        }

        if (changeColorBtn && output) {
            changeColorBtn.addEventListener('click', () => {
                const colors = ['#ff6b35', '#f7931e', '#667eea', '#764ba2', '#4facfe', '#00f2fe'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                output.style.backgroundColor = randomColor;
                output.style.color = 'white';
                output.innerHTML = '<p style="font-weight: 600;">Background color changed! ✨</p>';
            });
        }

        if (addTextBtn && output) {
            addTextBtn.addEventListener('click', () => {
                const newP = document.createElement('p');
                newP.textContent = `New paragraph added at ${new Date().toLocaleTimeString()}`;
                newP.style.color = '#10b981';
                newP.style.fontWeight = '500';
                newP.style.marginTop = '0.5rem';
                newP.style.padding = '0.5rem';
                newP.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                newP.style.borderRadius = '0.5rem';
                newP.style.border = '1px solid rgba(16, 185, 129, 0.2)';
                output.appendChild(newP);
            });
        }
    }
}

// Smooth Animations
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe topic cards for animation
        const topicCards = document.querySelectorAll('.topic-card');
        topicCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.handleKeyboardNavigation();
        this.improveScreenReaderSupport();
    }

    handleKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Handle Escape key to close mobile menu
            if (e.key === 'Escape') {
                const sidebar = document.getElementById('sidebar');
                if (sidebar && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            }

            // Handle Enter key on navigation buttons
            if (e.key === 'Enter' && e.target.classList.contains('nav-btn')) {
                e.target.click();
            }
        });
    }

    improveScreenReaderSupport() {
        // Add ARIA labels to interactive elements
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.setAttribute('aria-label', 'Toggle dark mode');
        }

        const mobileMenuBtn = document.getElementById('mobile-menu');
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        }

        // Add role attributes to navigation
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.setAttribute('role', 'navigation');
            sidebar.setAttribute('aria-label', 'Main navigation');
        }
    }
}

// Performance Manager
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeScrolling();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    optimizeScrolling() {
        let ticking = false;

        function updateScrollPosition() {
            // Add scroll-based effects here if needed
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        });
    }
}

// Global copy function for inline onclick handlers
function copyCode(button) {
    if (window.codeCopyManager) {
        window.codeCopyManager.copyCode(button);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    window.themeManager = new ThemeManager();
    window.navigationManager = new NavigationManager();
    window.codeCopyManager = new CodeCopyManager();
    window.demoManager = new DemoManager();
    window.animationManager = new AnimationManager();
    window.accessibilityManager = new AccessibilityManager();
    window.performanceManager = new PerformanceManager();

    // Add loading complete class for any CSS animations
    document.body.classList.add('loaded');

    console.log('🚀 Web Development Handbook loaded successfully!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page became visible - could refresh dynamic content here
        console.log('📖 Welcome back to the Web Development Handbook!');
    }
});

// Service Worker registration (if you want to add PWA features later)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}