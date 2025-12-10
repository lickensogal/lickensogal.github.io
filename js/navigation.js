// Enhanced Navigation with Dropdown Support

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileMenu();
    handleScrollHeader();
    setActiveNavLink();
});

function initNavigation() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    
    // Handle mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
    
    // Handle dropdown on mobile
    initMobileDropdowns();
}

function initMobileDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const navItem = toggle.closest('.nav-item');
                navItem.classList.toggle('active');
            }
        });
    });
}

function initMobileMenu() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    
    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navbar.classList.remove('active');
                document.getElementById('menu-toggle').classList.remove('active');
            }
        });
    });
}

function handleScrollHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    // Remove all active classes
    navLinks.forEach(link => link.classList.remove('active'));
    dropdownItems.forEach(item => item.classList.remove('active'));
    
    // Set active class based on current path
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        if (currentPath === linkPath || 
            (linkPath !== '/' && currentPath.includes(linkPath))) {
            link.classList.add('active');
        }
    });
    
    // Set active for dropdown items
    dropdownItems.forEach(item => {
        const itemPath = new URL(item.href).pathname;
        
        if (currentPath === itemPath || currentPath.includes(itemPath)) {
            item.classList.add('active');
            
            // Also mark the parent dropdown as active
            const parentDropdown = item.closest('.nav-item').querySelector('.dropdown-toggle');
            if (parentDropdown) {
                parentDropdown.classList.add('active');
            }
        }
    });
    
    // Special handling for services pages
    if (currentPath.includes('/services/')) {
        const servicesLink = document.querySelector('.nav-link.dropdown-toggle');
        if (servicesLink) {
            servicesLink.classList.add('active');
        }
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const navbar = document.getElementById('navbar');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (window.innerWidth > 768) {
            navbar.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
        }
    }, 250);
});
