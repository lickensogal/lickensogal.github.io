// ============================================
// TYPED.JS ANIMATION
// ============================================
document.addEventListener("DOMContentLoaded", function() {
    if (typeof Typed !== 'undefined') {
        new Typed(".typed-text", {
            strings: [
                "Software Developer",
                "Graphic Designer", 
                "UI/UX Designer",
                "Digital Marketer",
                "Video Editor",
                "AI Enthusiast"
            ],
            typeSpeed: 50,
            backSpeed: 50,
            backDelay: 1000,
            loop: true
        });
    }
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");

if (menuIcon && navbar) {
    menuIcon.addEventListener("click", function() {
        navbar.classList.toggle("active");
        
        // Toggle icon
        if (menuIcon.classList.contains("fa-bars")) {
            menuIcon.classList.remove("fa-bars");
            menuIcon.classList.add("fa-times");
        } else {
            menuIcon.classList.remove("fa-times");
            menuIcon.classList.add("fa-bars");
        }
    });

    // Close navbar when clicking a link
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            navbar.classList.remove("active");
            menuIcon.classList.remove("fa-times");
            menuIcon.classList.add("fa-bars");
        });
    });
}

// ============================================
// ACTIVE NAVIGATION ON SCROLL
// ============================================
window.addEventListener("scroll", function() {
    let sections = document.querySelectorAll("section");
    let navLinks = document.querySelectorAll(".navbar a");
    let header = document.querySelector(".header");
    
    let current = "";
    let scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 150) {
            current = section.getAttribute("id");
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
    
    // Sticky header
    if (header) {
        if (scrollY > 100) {
            header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.15)";
        } else {
            header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
        }
    }
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        
        if (target) {
            const headerHeight = document.querySelector(".header").offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", function() {
    const animateElements = document.querySelectorAll(
        ".skill-card, .service-card, .project-card, .contact-wrapper > *"
    );
    
    animateElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease";
        observer.observe(el);
    });
});

// ============================================
// FORM SUBMISSION
// ============================================
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        const button = this.querySelector("button[type='submit']");
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        button.disabled = true;
        
        // Form will submit to Formspree
        // This is just for UX feedback
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    });
}

// ============================================
// BACK TO TOP FUNCTIONALITY
// ============================================
const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
    window.addEventListener("scroll", function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = "1";
        } else {
            backToTop.style.opacity = "0.7";
        }
    });
}

// ============================================
// CURSOR EFFECT (OPTIONAL)
// ============================================
document.addEventListener("mousemove", function(e) {
    const cursor = document.createElement("div");
    cursor.style.position = "fixed";
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    cursor.style.width = "5px";
    cursor.style.height = "5px";
    cursor.style.background = "var(--primary-color)";
    cursor.style.borderRadius = "50%";
    cursor.style.pointerEvents = "none";
    cursor.style.opacity = "0.5";
    cursor.style.transition = "all 0.3s ease";
    
    document.body.appendChild(cursor);
    
    setTimeout(() => {
        cursor.remove();
    }, 300);
});

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener("load", function() {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";
    
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
});

// ============================================
// PROJECT CARD TILT EFFECT (OPTIONAL)
// ============================================
document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mousemove", function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener("mouseleave", function() {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
});

console.log("Portfolio loaded successfully! 🚀");
