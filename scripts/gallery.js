// Image Gallery and Lightbox Functionality

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

function initGallery() {
    const gallery = document.getElementById('photo-gallery');
    
    if (!gallery) {
        return; // Gallery not on this page
    }
    
    const galleryItems = gallery.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => {
        const img = item.querySelector('.gallery-image');
        return {
            src: img.getAttribute('data-full') || img.getAttribute('src'),
            alt: img.getAttribute('alt') || ''
        };
    });
    
    // Open lightbox when clicking on gallery image
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
        
        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });
    
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        
        if (lightbox) {
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Focus management for accessibility
            if (lightboxClose) {
                lightboxClose.focus();
            }
        }
    }
    
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    function updateLightboxImage() {
        if (lightboxImage && images[currentImageIndex]) {
            lightboxImage.setAttribute('src', images[currentImageIndex].src);
            lightboxImage.setAttribute('alt', images[currentImageIndex].alt);
        }
        
        if (lightboxCaption && images[currentImageIndex]) {
            lightboxCaption.textContent = images[currentImageIndex].alt;
        }
        
        // Update prev/next button visibility
        if (lightboxPrev) {
            lightboxPrev.style.display = images.length > 1 ? 'block' : 'none';
        }
        if (lightboxNext) {
            lightboxNext.style.display = images.length > 1 ? 'block' : 'none';
        }
    }
    
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }
    
    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Previous image
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            showPreviousImage();
        });
    }
    
    // Next image
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            showNextImage();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) {
            return;
        }
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                showPreviousImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                showNextImage();
                break;
        }
    });
    
    // Prevent lightbox content clicks from closing
    const lightboxContent = lightbox?.querySelector('.lightbox-content');
    if (lightboxContent) {
        lightboxContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}
