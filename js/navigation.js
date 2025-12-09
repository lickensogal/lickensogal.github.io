// ============================================
// NAVIGATION HANDLING
// ============================================

class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.navbar = document.getElementById('navbar');
        this.menuToggle = document.getElementById('menu-toggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initScrollEffects();
        this.initActiveLink();
    }

    // Mobile Menu Toggle
    initMobileMenu() {
        if (!this.menuToggle || !this.navbar) return;

        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            this.navbar.classList.toggle('active');
            document.body.style.overflow = this.navbar.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking nav link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.menuToggle.classList.remove('active');
                this.navbar.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && 
                !this.menuToggle.contains(e.target) && 
                this.navbar.classList.contains('active')) {
                this.menuToggle.classList.remove('active');
                this.navbar.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navbar.classList.contains('active')) {
                this.menuToggle.classList.remove('active');
                this.navbar.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Smooth Scroll for Anchor Links
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip if href is just "#"
                if (href === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = this.header ? this.header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll Effects (Sticky Header, Hide/Show on Scroll)
    initScrollEffects() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add scrolled class when scrolling down
            if (currentScroll > 100) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }

            // Hide/Show header on scroll (optional - uncomment to enable)
            /*
            if (currentScroll > this.lastScroll && currentScroll > 500) {
                this.header?.classList.add('header-hidden');
            } else {
                this.header?.classList.remove('header-hidden');
            }
            */

            this.lastScroll = currentScroll;
        });
    }

    // Active Link Highlighting
    initActiveLink() {
        // Get current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Highlight active page in navigation
        this.navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });

        // For single page sections, highlight based on scroll position
        if (currentPage === 'index.html' || currentPage === '') {
            window.addEventListener('scroll', () => {
                this.highlightSectionLink();
            });
        }
    }

    // Highlight navigation link based on current section in view
    highlightSectionLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Back to Top Functionality
    initBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new Navigation();
    navigation.initBackToTop();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
                }
