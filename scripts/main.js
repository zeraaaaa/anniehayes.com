// Main navigation and site interactions

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScrolling();
    highlightActivePage();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', isActive);
            
            // Close menu when clicking outside
            if (isActive) {
                document.addEventListener('click', closeMenuOnOutsideClick);
            } else {
                document.removeEventListener('click', closeMenuOnOutsideClick);
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.removeEventListener('click', closeMenuOnOutsideClick);
            });
        });
    }
}

function closeMenuOnOutsideClick(event) {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu && mobileMenuToggle && 
        !navMenu.contains(event.target) && 
        !mobileMenuToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeMenuOnOutsideClick);
    }
}

// Smooth Scrolling for anchor links
function initSmoothScrolling() {
    // Check if smooth scrolling is supported
    if ('scrollBehavior' in document.documentElement.style) {
        // Native smooth scrolling is supported
        return;
    }
    
    // Fallback for browsers that don't support smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Highlight active page in navigation
function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
