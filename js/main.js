// ============================================
// MAIN JAVASCRIPT - CORE FUNCTIONALITY
// ============================================

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.initTypedText();
        this.initFormValidation();
        this.initFilterButtons();
        this.initImageLazyLoading();
        this.initTooltips();
        this.initModalFunctionality();
        this.logWelcomeMessage();
    }

    // Typed Text Animation
    initTypedText() {
        const typedElement = document.querySelector('.typed-text');
        if (!typedElement || typeof Typed === 'undefined') return;

        new Typed('.typed-text', {
            strings: [
                'Software Developer',
                'Graphic Designer',
                'UI/UX Designer',
                'Digital Marketer',
                'Video Editor',
                'AI Enthusiast',
                'WordPress Developer'
            ],
            typeSpeed: 70,
            backSpeed: 50,
            backDelay: 1500,
            loop: true,
            showCursor: false
        });
    }

    // Form Validation
    initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (!this.validateForm(form)) {
                    return;
                }

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                try {
                    // Submit form (FormSpree handles this automatically)
                    const formData = new FormData(form);
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                        form.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    this.showNotification('Oops! Something went wrong. Please try again.', 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showInputError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
                this.showInputError(input, 'Please enter a valid email address');
                isValid = false;
            } else {
                this.clearInputError(input);
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showInputError(input, message) {
        this.clearInputError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error';
        errorDiv.style.color = 'var(--primary-orange)';
        errorDiv.style.fontSize = 'var(--text-sm)';
        errorDiv.style.marginTop = 'var(--space-2)';
        errorDiv.textContent = message;
        
        input.style.borderColor = 'var(--primary-orange)';
        input.parentNode.appendChild(errorDiv);
    }

    clearInputError(input) {
        const errorDiv = input.parentNode.querySelector('.input-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.style.borderColor = '';
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '16px 24px',
            background: type === 'success' ? 'var(--primary-orange)' : '#e74c3c',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideInRight 0.3s ease-out',
            maxWidth: '400px'
        });

        document.body.appendChild(notification);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Filter Buttons for Projects/Blog
    initFilterButtons() {
        const filterBtns = document.querySelectorAll('.filter-btn, .category-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from siblings
                const siblings = btn.parentElement.querySelectorAll('.filter-btn, .category-btn');
                siblings.forEach(sibling => sibling.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
            });
        });
    }

    // Lazy Loading Images
    initImageLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Tooltips
    initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = el.dataset.tooltip;
                
                Object.assign(tooltip.style, {
                    position: 'absolute',
                    background: 'var(--secondary-navy)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    whiteSpace: 'nowrap',
                    zIndex: '9999',
                    pointerEvents: 'none'
                });
                
                document.body.appendChild(tooltip);
                
                const rect = el.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
                
                el.addEventListener('mouseleave', () => {
                    tooltip.remove();
                }, { once: true });
            });
        });
    }

    // Modal Functionality
    initModalFunctionality() {
        const modals = document.querySelectorAll('.modal');
        const modalTriggers = document.querySelectorAll('[data-modal]');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                const modal = document.getElementById(modalId);
                if (modal) {
                    this.openModal(modal);
                }
            });
        });

        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close, [data-modal-close]');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(modal));
            }
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.classList.contains('active')) {
                        this.closeModal(modal);
                    }
                });
            }
        });
    }

    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Copy to Clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy', 'error');
        });
    }

    // Share Functionality
    async share(title, text, url) {
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            this.copyToClipboard(url);
        }
    }

    // Welcome Message in Console
    logWelcomeMessage() {
        const style = 'color: #FF6B35; font-size: 20px; font-weight: bold;';
        console.log('%c👋 Hello! Welcome to my portfolio', style);
        console.log('%cInterested in the code? Feel free to reach out!', 'color: #1E3A5F; font-size: 14px;');
        console.log('%c🔗 GitHub: https://github.com/lickensogal', 'color: #666;');
    }
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyle);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
                }
