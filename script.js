/* ============================================
   REHAN'S MULTICUISINE RESTAURANT - SCRIPTS
   Interactive Functionality
   ============================================ */

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ============================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// 3D IMAGE CAROUSEL FUNCTIONALITY
// ============================================

class Carousel3D {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.thumbnails = [];
        this.autoSlideInterval = null;
        this.progressInterval = null;
        
        // Carousel image filenames - using menu images from rehan-menu folder
        this.carouselImages = [];
        for (let i = 1; i <= 11; i++) {
            this.carouselImages.push(`rehan-menu/menu${i}.jpeg`);
        }
        
        this.init();
    }
    
    init() {
        const carouselTrack = document.getElementById('carouselTrack');
        const carouselThumbnails = document.getElementById('carouselThumbnails');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const currentSlideNum = document.getElementById('currentSlideNum');
        const totalSlidesNum = document.getElementById('totalSlidesNum');
        const progressBar = document.getElementById('progressBar');
        
        if (!carouselTrack) return;
        
        // Set total slides
        if (totalSlidesNum) {
            totalSlidesNum.textContent = String(this.carouselImages.length).padStart(2, '0');
        }
        
        // Create 3D slide elements
        this.carouselImages.forEach((image, index) => {
            // Create slide
            const slide = document.createElement('div');
            slide.className = 'carousel-3d-slide';
            slide.setAttribute('data-index', index);
            
            const img = document.createElement('img');
            img.src = `assets/${image}`;
            img.alt = `Carousel image ${index + 1}`;
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/1200x600/0B0B0B/F4B43A?text=Carousel+Image+' + (index + 1);
            };
            
            slide.appendChild(img);
            carouselTrack.appendChild(slide);
            this.slides.push(slide);
            
            // Create thumbnail
            if (carouselThumbnails) {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'carousel-thumbnail';
                if (index === 0) thumbnail.classList.add('active');
                
                const thumbImg = document.createElement('img');
                thumbImg.src = `assets/${image}`;
                thumbImg.alt = `Thumbnail ${index + 1}`;
                
                thumbnail.appendChild(thumbImg);
                thumbnail.addEventListener('click', () => this.goToSlide(index));
                carouselThumbnails.appendChild(thumbnail);
                this.thumbnails.push(thumbnail);
            }
        });
        
        // Initialize slides
        this.updateSlides();
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });
        
        // Auto-slide functionality
        this.startAutoSlide();
        
        // Progress bar animation
        this.startProgress();
    }
    
    updateSlides() {
        const currentSlideNum = document.getElementById('currentSlideNum');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        this.slides.forEach((slide, index) => {
            slide.classList.remove('prev', 'active', 'next');
            
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else if (index === this.currentSlide - 1 || (this.currentSlide === 0 && index === this.slides.length - 1)) {
                slide.classList.add('prev');
            } else if (index === this.currentSlide + 1 || (this.currentSlide === this.slides.length - 1 && index === 0)) {
                slide.classList.add('next');
            }
        });
        
        // Update thumbnails
        this.thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update counter
        if (currentSlideNum) {
            currentSlideNum.textContent = String(this.currentSlide + 1).padStart(2, '0');
        }
        
        // Update navigation buttons
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlides();
        this.resetProgress();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
        this.resetProgress();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
        this.resetProgress();
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    startProgress() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        
        this.resetProgress();
        this.progressInterval = setInterval(() => {
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            if (currentWidth >= 100) {
                this.resetProgress();
            } else {
                progressBar.style.width = (currentWidth + 0.5) + '%';
            }
        }, 30);
    }
    
    resetProgress() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        this.startProgress();
    }
}

// Initialize 3D carousel when DOM is loaded
let carousel3D;
document.addEventListener('DOMContentLoaded', () => {
    carousel3D = new Carousel3D();
});

// ============================================
// MENU BOOK FUNCTIONALITY
// ============================================

class MenuBook {
    constructor() {
        this.currentPage = 0;
        this.menuImages = [];
        
        // Menu image filenames from assets/rehan-menu folder
        for (let i = 1; i <= 11; i++) {
            this.menuImages.push(`rehan-menu/menu${i}.jpeg`);
        }
        
        this.totalPages = this.menuImages.length;
        this.pagesPerView = 2; // Show 2 pages at a time (left and right)
        
        this.init();
    }
    
    init() {
        const menuBook = document.getElementById('menuBook');
        const bookPrev = document.getElementById('bookPrev');
        const bookNext = document.getElementById('bookNext');
        const currentPageSpan = document.getElementById('currentPage');
        const totalPagesSpan = document.getElementById('totalPages');
        const menuModal = document.getElementById('menuModal');
        const modalClose = document.getElementById('modalClose');
        const modalImage = document.getElementById('modalImage');
        const modalPrev = document.getElementById('modalPrev');
        const modalNext = document.getElementById('modalNext');
        
        if (!menuBook) return;
        
        // Set total pages
        if (totalPagesSpan) {
            totalPagesSpan.textContent = this.totalPages;
        }
        
        // Create menu book pages
        this.menuImages.forEach((imagePath, index) => {
            const page = document.createElement('div');
            page.className = 'menu-page';
            page.setAttribute('data-page', index + 1);
            page.setAttribute('data-index', index);
            
            const img = document.createElement('img');
            img.src = `assets/${imagePath}`;
            img.alt = `Menu page ${index + 1}`;
            
            page.appendChild(img);
            menuBook.appendChild(page);
            
            // Add click event to open modal
            page.addEventListener('click', () => {
                this.openModal(index);
            });
        });
        
        // Initialize page display
        this.updatePages();
        
        // Navigation buttons
        if (bookPrev) {
            bookPrev.addEventListener('click', () => {
                this.prevPage();
            });
        }
        
        if (bookNext) {
            bookNext.addEventListener('click', () => {
                this.nextPage();
            });
        }
        
        // Keyboard navigation for book
        document.addEventListener('keydown', (e) => {
            if (menuModal && menuModal.classList.contains('active')) {
                // Modal is open, handle modal navigation
                if (e.key === 'Escape') {
                    this.closeModal();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevMenu();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextMenu();
                }
            } else {
                // Book navigation
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevPage();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextPage();
                }
            }
        });
        
        // Handle window resize for responsive book
        window.addEventListener('resize', () => {
            this.updatePages();
        });
        
        // Modal functionality
        if (modalClose && menuModal) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (menuModal) {
            menuModal.addEventListener('click', (e) => {
                if (e.target === menuModal) {
                    this.closeModal();
                }
            });
        }
        
        if (modalPrev) {
            modalPrev.addEventListener('click', () => {
                this.prevMenu();
            });
        }
        
        if (modalNext) {
            modalNext.addEventListener('click', () => {
                this.nextMenu();
            });
        }
    }
    
    updatePages() {
        const pages = document.querySelectorAll('.menu-page');
        const currentPageSpan = document.getElementById('currentPage');
        const bookPrev = document.getElementById('bookPrev');
        const bookNext = document.getElementById('bookNext');
        
        // Check if mobile view (single page)
        const isMobile = window.innerWidth <= 768;
        const pagesToShow = isMobile ? 1 : 2;
        
        pages.forEach((page, index) => {
            page.classList.remove('left', 'right', 'active', 'hidden');
            
            const pageIndex = parseInt(page.getAttribute('data-index'));
            
            if (isMobile) {
                // Mobile: show only one page at a time
                if (pageIndex === this.currentPage) {
                    page.classList.add('left', 'active');
                } else {
                    page.classList.add('hidden');
                }
            } else {
                // Desktop: show 2 pages at a time
                const leftPageIndex = this.currentPage;
                const rightPageIndex = this.currentPage + 1;
                
                if (pageIndex === leftPageIndex && leftPageIndex < this.totalPages) {
                    page.classList.add('left', 'active');
                } else if (pageIndex === rightPageIndex && rightPageIndex < this.totalPages) {
                    page.classList.add('right', 'active');
                } else {
                    page.classList.add('hidden');
                }
            }
        });
        
        // Update page indicator
        if (currentPageSpan) {
            currentPageSpan.textContent = this.currentPage + 1;
        }
        
        // Update navigation button states
        if (bookPrev) {
            bookPrev.disabled = this.currentPage === 0;
        }
        if (bookNext) {
            if (isMobile) {
                bookNext.disabled = this.currentPage >= this.totalPages - 1;
            } else {
                bookNext.disabled = this.currentPage >= this.totalPages - 2;
            }
        }
    }
    
    nextPage() {
        const isMobile = window.innerWidth <= 768;
        const increment = isMobile ? 1 : 2;
        const maxPage = isMobile ? this.totalPages - 1 : this.totalPages - 2;
        
        if (this.currentPage < maxPage) {
            this.currentPage += increment;
            this.updatePages();
        }
    }
    
    prevPage() {
        const isMobile = window.innerWidth <= 768;
        const decrement = isMobile ? 1 : 2;
        
        if (this.currentPage > 0) {
            this.currentPage -= decrement;
            this.updatePages();
        }
    }
    
    openModal(index) {
        const menuModal = document.getElementById('menuModal');
        const modalImage = document.getElementById('modalImage');
        
        if (!menuModal || !modalImage) return;
        
        this.currentMenuIndex = index;
        modalImage.src = `assets/${this.menuImages[index]}`;
        modalImage.alt = `Menu page ${index + 1}`;
        
        menuModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const menuModal = document.getElementById('menuModal');
        if (menuModal) {
            menuModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    nextMenu() {
        this.currentMenuIndex = (this.currentMenuIndex + 1) % this.menuImages.length;
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.src = `assets/${this.menuImages[this.currentMenuIndex]}`;
            modalImage.alt = `Menu page ${this.currentMenuIndex + 1}`;
        }
    }
    
    prevMenu() {
        this.currentMenuIndex = (this.currentMenuIndex - 1 + this.menuImages.length) % this.menuImages.length;
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.src = `assets/${this.menuImages[this.currentMenuIndex]}`;
            modalImage.alt = `Menu page ${this.currentMenuIndex + 1}`;
        }
    }
}

// Initialize menu book when DOM is loaded
let menuBook;
document.addEventListener('DOMContentLoaded', () => {
    menuBook = new MenuBook();
});

// ============================================
// GALLERY FUNCTIONALITY - MASONRY WITH FILTERS
// ============================================

class GalleryShowcase {
    constructor() {
        this.currentLightboxIndex = 0;
        
        // Gallery images - using menu images from rehan-menu folder
        this.galleryImages = [];
        for (let i = 1; i <= 11; i++) {
            this.galleryImages.push(`rehan-menu/menu${i}.jpeg`);
        }
        
        this.init();
    }
    
    init() {
        const galleryShowcase = document.getElementById('galleryShowcase');
        const lightbox = document.getElementById('galleryLightbox');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        
        if (!galleryShowcase) return;
        
        // Create gallery items with staggered animation
        this.galleryImages.forEach((imagePath, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-index', index);
            
            // Stagger animation delay
            galleryItem.style.animationDelay = `${index * 0.1}s`;
            
            const img = document.createElement('img');
            img.src = `assets/${imagePath}`;
            img.alt = `Gallery image ${index + 1}`;
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/400x600/0B0B0B/F4B43A?text=Gallery+' + (index + 1);
            };
            
            galleryItem.appendChild(img);
            galleryItem.addEventListener('click', () => this.openLightbox(index));
            
            galleryShowcase.appendChild(galleryItem);
        });
        
        // Lightbox controls
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.closeLightbox());
        }
        
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });
        }
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => this.prevLightbox());
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => this.nextLightbox());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    this.prevLightbox();
                } else if (e.key === 'ArrowRight') {
                    this.nextLightbox();
                }
            }
        });
    }
    
    openLightbox(index) {
        const lightbox = document.getElementById('galleryLightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCounter = document.getElementById('lightboxCounter');
        
        if (!lightbox || !lightboxImage) return;
        
        this.currentLightboxIndex = index;
        this.updateLightbox();
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        const lightbox = document.getElementById('galleryLightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    updateLightbox() {
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCounter = document.getElementById('lightboxCounter');
        
        if (!lightboxImage || this.galleryImages.length === 0) return;
        
        lightboxImage.src = `assets/${this.galleryImages[this.currentLightboxIndex]}`;
        lightboxImage.alt = `Gallery image ${this.currentLightboxIndex + 1}`;
        
        if (lightboxCounter) {
            lightboxCounter.textContent = `${this.currentLightboxIndex + 1} / ${this.galleryImages.length}`;
        }
    }
    
    nextLightbox() {
        this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.galleryImages.length;
        this.updateLightbox();
    }
    
    prevLightbox() {
        this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        this.updateLightbox();
    }
}

// Initialize gallery when DOM is loaded
let galleryShowcase;
document.addEventListener('DOMContentLoaded', () => {
    galleryShowcase = new GalleryShowcase();
});

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate required fields
        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Format message for WhatsApp
        let whatsappMessage = `Hello! I'm interested in contacting Rehan's Multicuisine Restaurant.\n\n`;
        whatsappMessage += `*Name:* ${name}\n`;
        whatsappMessage += `*Email:* ${email}\n`;
        if (phone) {
            whatsappMessage += `*Phone:* ${phone}\n`;
        }
        whatsappMessage += `*Message:*\n${message}\n\n`;
        whatsappMessage += `---\nSent from Rehan's Multicuisine Restaurant Website`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // WhatsApp number (remove spaces and special characters, keep + and digits)
        const whatsappNumber = '917200484111'; // +91 72004 84111
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappURL, '_blank');
        
        // Show success message
        alert('Redirecting to WhatsApp... Please send your message there!');
        
        // Reset form after a short delay
        setTimeout(() => {
            contactForm.reset();
        }, 500);
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.about, .menu, .why-choose-us, .gallery, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// ============================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// ============================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// LOADING ANIMATION (Optional)
// ============================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
