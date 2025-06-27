document.addEventListener('DOMContentLoaded', function() {
  // Initialize for both desktop and mobile
  const mobileGalleryEl = document.querySelector('.mobile-gallery');
  const desktopGalleryEl = document.querySelector('.desktop-gallery');
  
  // Mobile Slider Implementation
  if (window.innerWidth < 768 && mobileGalleryEl) {
    const slider = document.querySelector('.gallery-slider');
    const slides = document.querySelectorAll('.gallery-slide');
    let dotsContainer = document.querySelector('.slider-dots');
    let prevBtn = document.querySelector('.slider-prev');
    let nextBtn = document.querySelector('.slider-next');
    
    // Create controls if they don't exist
    if (!dotsContainer || !prevBtn || !nextBtn) {
      const controlsHTML = `
        <div class="slider-controls">
          <button class="slider-prev">❮</button>
          <div class="slider-dots"></div>
          <button class="slider-next">❯</button>
        </div>
      `;
      mobileGalleryEl.insertAdjacentHTML('beforeend', controlsHTML);
      
      dotsContainer = document.querySelector('.slider-dots');
      prevBtn = document.querySelector('.slider-prev');
      nextBtn = document.querySelector('.slider-next');
    }
    
    let currentSlide = 0;
    const maxSlide = slides.length - 1;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    // Create dots indicator
    function createDots() {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        dot.dataset.slide = idx;
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
      updateDots();
    }
    
    function updateDots() {
      document.querySelectorAll('.slider-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }
    
    function goToSlide(slide) {
      currentSlide = slide;
      const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(slides[0]).marginRight);
      slider.scrollTo({
        left: slide * slideWidth,
        behavior: 'smooth'
      });
      updateDots();
    }
    
    function nextSlide() {
      if (currentSlide === maxSlide) {
        goToSlide(0);
      } else {
        goToSlide(currentSlide + 1);
      }
    }
    
    function prevSlide() {
      if (currentSlide === 0) {
        goToSlide(maxSlide);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
    
    // Initialize lightGallery for mobile
    const mobileGallery = lightGallery(mobileGalleryEl, {
      selector: '.gallery-slide',
      download: false,
      zoom: true,
      thumbnail: true,
      mobileSettings: {
        controls: true,
        showCloseIcon: true
      }
    });
    
    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Handle scroll events to detect current slide
    slider.addEventListener('scroll', () => {
      const slideWidth = slides[0].offsetWidth;
      currentSlide = Math.round(slider.scrollLeft / slideWidth);
      updateDots();
    }, { passive: true });
    
    // Add click event to open lightGallery
    slides.forEach((slide) => {
      slide.style.cursor = 'pointer';
      slide.addEventListener('click', function(e) {
        // Only open gallery if not dragging
        if (!isDragging) {
          const index = Array.from(slides).indexOf(this);
          mobileGallery.openGallery(index);
        }
      });
    });
    
    // Touch event handlers to detect drag
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      startPos = e.touches[0].clientX;
    }, { passive: true });
    
    slider.addEventListener('touchend', () => {
      isDragging = false;
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
      if (isDragging) {
        const currentPosition = e.touches[0].clientX;
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    }, { passive: true });
  }
  
  // Desktop Grid Implementation
  if (window.innerWidth >= 768 && desktopGalleryEl) {
    lightGallery(desktopGalleryEl, {
      selector: '.gallery-item',
      download: false,
      zoom: true,
      thumbnail: true
    });
  }
  
  // Handle window resize between mobile and desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768 && desktopGalleryEl) {
      // Switch to desktop view
      if (document.querySelector('.mobile-gallery.lg-show')) {
        lightGallery.destroy('.mobile-gallery');
      }
      lightGallery(desktopGalleryEl, {
        selector: '.gallery-item',
        download: false,
        zoom: true,
        thumbnail: true
      });
    }
  });

  // navbar function
const nav = document.querySelector('.main-nav');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.menu-overlay');
const menuBtn = document.querySelector('.mobile-menu-btn');
const closeBtn = document.querySelector('.menu-close-btn');
const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');

// Scroll effect navbar
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  
  // Highlight active section
  const scrollPosition = window.scrollY + 100;
  
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      const id = section.getAttribute('id');
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${id}`) {
          item.classList.add('active');
        }
      });
    }
  });
});

// Mobile menu 
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  overlay.classList.toggle('active');
  menuBtn.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

closeBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('active');
  overlay.classList.remove('active');
  menuBtn.classList.remove('active');
  document.body.style.overflow = '';
});

overlay.addEventListener('click', () => {
  mobileMenu.classList.remove('active');
  overlay.classList.remove('active');
  menuBtn.classList.remove('active');
  document.body.style.overflow = '';
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Close mobile menu
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      menuBtn.classList.remove('active');
      document.body.style.overflow = '';
      
      // Smooth scroll
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});

  // Crfloating partikel struktur
  function createParticles() {
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 4 + 1;
      const posX = Math.random() * window.innerWidth;
      const delay = Math.random() * 15;
      const duration = Math.random() * 15 + 10;
      const opacity = Math.random() * 0.3 + 0.1;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}px`;
      particle.style.bottom = `-10px`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.opacity = opacity;
      
      document.body.appendChild(particle);
    }
  }

  // swipe indikator mobile
  function createSwipeIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'swipe-indicator';
    indicator.innerHTML = `
      <div class="text">Geser ke bawah</div>
      <div class="icon">↓</div>
    `;
    document.body.appendChild(indicator);
    
    let timeout;
    const hideIndicator = () => {
      timeout = setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => {
          indicator.style.display = 'none';
        }, 300);
      }, 9000); 
    };

    // Reset timeout saat user scroll
    window.addEventListener('scroll', () => {
      indicator.style.opacity = '1';
      clearTimeout(timeout);
      hideIndicator();
      
      if (window.scrollY > 100) {
        indicator.style.display = 'none';
      }
    });

    hideIndicator();
  }

  // Initialize enhancements
  createParticles();
  
  if (window.innerWidth <= 768) {
    createSwipeIndicator();
  }
});