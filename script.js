// ===== MOBILE NAVIGATION =====
class MobileNavigation {
  constructor() {
    this.toggle = document.getElementById('mobileToggle');
    this.menu = document.getElementById('navMenu');
    this.links = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) return;

    // Toggle menu on button click
    this.toggle.addEventListener('click', () => this.toggleMenu());

    // Close menu when clicking on a link
    this.links.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.menu.classList.toggle('active');
    this.toggle.classList.toggle('active');
  }

  closeMenu() {
    this.menu.classList.remove('active');
    this.toggle.classList.remove('active');
  }
}

// ===== SMOOTH SCROLLING =====
class SmoothScrolling {
  constructor() {
    this.links = document.querySelectorAll('a[href^="#"]');
    this.init();
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const navHeight = document.querySelector('.nav').offsetHeight;
          const targetPosition = target.offsetTop - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// ===== ACTIVE NAVIGATION =====
class ActiveNavigation {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.updateActiveLink());
  }

  updateActiveLink() {
    const scrollPosition = window.scrollY + 100;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// ===== NAVBAR SCROLL EFFECT =====
class NavbarScrollEffect {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.lastScrollY = 0;
    this.init();
  }

  init() {
    if (!this.navbar) return;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > this.lastScrollY;

      // Add scrolled class when scrolled down
      if (currentScrollY > 100) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (isScrollingDown) {
        this.navbar.classList.add('hidden');
      } else {
        this.navbar.classList.remove('hidden');
      }

      this.lastScrollY = currentScrollY;
    });
  }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
class AnimationObserver {
  constructor() {
    this.elements = document.querySelectorAll('.text-block, .step-card, .info-box, .contact-card');
    this.init();
  }

  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.elements.forEach(element => {
      observer.observe(element);
    });
  }
}

// ===== CONTACT FORM HANDLING =====
class ContactForm {
  constructor(validator) {
    this.form = document.getElementById('contactForm');
    this.validator = validator;
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  handleSubmit() {
    if (this.validator && !this.validator.validateForm()) {
      this.showMessage('Controleer de gemarkeerde velden hierboven.', 'error');
      return;
    }

    // Get form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Simulate form submission
    console.log('Form data:', data);

    // Show success message
    this.showMessage('Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.', 'success');

    // Reset form
    this.form.reset();
  }

  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      padding: 1rem;
      border-radius: 12px;
      margin-top: 1rem;
      text-align: center;
      font-weight: 600;
      background: ${type === 'success' ? '#F4C06A' : '#F5C6AA'};
      color: white;
      animation: fadeInUp 0.3s ease-out;
    `;

    this.form.appendChild(messageDiv);

    // Remove message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// ===== FORM VALIDATION =====
class FormValidation {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    if (!this.form) return;

    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();

    if (field.hasAttribute('required') && !value) {
      this.showError(field, 'Dit veld is verplicht');
      return false;
    }

    if (field.id === 'name' && value && value.length < 2) {
      this.showError(field, 'Voer je volledige naam in');
      return false;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(field, 'Voer een geldig e-mailadres in');
        return false;
      }
    }

    if (field.type === 'tel' && value) {
      const phoneRegex = /^[+]?[\d\s()-]{8,20}$/;
      if (!phoneRegex.test(value)) {
        this.showError(field, 'Voer een geldig telefoonnummer in');
        return false;
      }
    }

    if (field.id === 'message' && value && value.length < 10) {
      this.showError(field, 'Geef iets meer uitleg in je bericht (minimaal 10 tekens)');
      return false;
    }

    this.clearError(field);
    return true;
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea');
    let isValid = true;
    let firstInvalidField = null;

    inputs.forEach(input => {
      const fieldIsValid = this.validateField(input);
      if (!fieldIsValid) {
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = input;
        }
      }
    });

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  showError(field, message) {
    this.clearError(field);
    
    field.style.borderColor = '#F5C6AA';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #5E6652;
      font-size: 0.85rem;
      margin-top: 0.5rem;
      font-weight: 600;
    `;
    
    field.parentElement.appendChild(errorDiv);
  }

  clearError(field) {
    field.style.borderColor = '';
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }
}

// ===== SCROLL TO TOP =====
class ScrollToTop {
  constructor() {
    this.createButton();
    this.init();
  }

  createButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTop';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Scroll naar boven');
    button.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #F4C06A;
      color: white;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(244, 192, 106, 0.3);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    document.body.appendChild(button);
    this.button = button;
  }

  init() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        this.button.style.opacity = '1';
        this.button.style.visibility = 'visible';
      } else {
        this.button.style.opacity = '0';
        this.button.style.visibility = 'hidden';
      }
    });

    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    this.button.addEventListener('mouseenter', () => {
      this.button.style.transform = 'translateY(-5px)';
      this.button.style.boxShadow = '0 6px 30px rgba(244, 192, 106, 0.4)';
    });

    this.button.addEventListener('mouseleave', () => {
      this.button.style.transform = 'translateY(0)';
      this.button.style.boxShadow = '0 4px 20px rgba(244, 192, 106, 0.3)';
    });
  }
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all classes
  new MobileNavigation();
  new SmoothScrolling();
  new ActiveNavigation();
  new NavbarScrollEffect();
  new AnimationObserver();
  const formValidation = new FormValidation();
  new ContactForm(formValidation);
  new ScrollToTop();

  // Log success message
  console.log('✨ De Vertelplek website geladen');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images if needed
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}