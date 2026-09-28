// ===== MOBILE NAVIGATION =====
class MobileNavigation {
  constructor() {
    this.toggle = document.getElementById('mobileToggle');
    this.menu = document.getElementById('navMenu');
    this.navbar = document.getElementById('navbar');
    this.links = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) return;

    this.toggle.setAttribute('aria-controls', 'navMenu');
    this.toggle.setAttribute('aria-expanded', 'false');

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

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeMenu();
    });

    // Close menu when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1200) this.closeMenu();
    });
  }

  toggleMenu() {
    if (this.menu.classList.contains('active')) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.menu.classList.add('active');
    this.toggle.classList.add('active');
    this.toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');

    // Header vastzetten zodat het menu er netjes onder blijft hangen
    if (this.navbar) {
      this.navbar.classList.remove('hidden');
      this.navbar.classList.add('menu-open');
    }
  }

  closeMenu() {
    this.menu.classList.remove('active');
    this.toggle.classList.remove('active');
    this.toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');

    if (this.navbar) this.navbar.classList.remove('menu-open');
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
    this.lastScrollY = window.scrollY;
    this.navHeight = 0;
    this.init();
  }

  init() {
    if (!this.navbar) return;

    this.updateNavHeight();
    window.addEventListener('load', () => this.updateNavHeight());
    window.addEventListener('resize', () => this.updateNavHeight());
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    this.handleScroll();
  }

  // Hoogte van de header doorgeven aan de CSS (gebruikt door het mobiele menu)
  updateNavHeight() {
    this.navHeight = this.navbar.offsetHeight;
    document.documentElement.style.setProperty('--nav-height', `${this.navHeight}px`);
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > this.lastScrollY;
    const isPinned = this.navbar.classList.contains('scrolled');

    // Niets veranderen zolang het mobiele menu open staat
    if (this.navbar.classList.contains('menu-open')) {
      this.lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY <= 0) {
      // Bovenaan de pagina: header hoort weer bij de hero en schuift mee
      this.navbar.classList.remove('scrolled', 'hidden');
    } else if (!isPinned) {
      // Header schuift mee met de hero en mag pas terugkomen
      // wanneer hij volledig uit beeld is gescrold
      if (currentScrollY > this.navHeight) {
        this.pinNavbar();
      }
    } else {
      // Vastgezette header: verbergen bij omlaag scrollen, tonen bij omhoog
      this.navbar.classList.toggle('hidden', isScrollingDown);
    }

    this.lastScrollY = currentScrollY;
  }

  // Overschakelen naar de vaste header: start buiten beeld, zonder zichtbare sprong
  pinNavbar() {
    this.navbar.classList.add('no-transition', 'scrolled', 'hidden');
    void this.navbar.offsetHeight; // forceer een reflow
    this.navbar.classList.remove('no-transition');
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
// Verstuurt het formulier naar Web3Forms zonder de pagina te verlaten.
// De access key staat als verborgen veld in index.html, zodat het formulier
// ook werkt wanneer JavaScript niet laadt.
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  const originalText = submitBtn.textContent;
  let resetTimer = null;

  // Knop terug in de normale staat
  const resetButton = () => {
    submitBtn.textContent = originalText;
    submitBtn.classList.remove('is-sending', 'is-sent');
    submitBtn.disabled = false;
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearTimeout(resetTimer);

    const formData = new FormData(contactForm);

    submitBtn.textContent = 'Bezig met versturen...';
    submitBtn.classList.add('is-sending');
    submitBtn.classList.remove('is-sent');
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Bevestiging: knop wordt groen met een vinkje, formulier leeg
        contactForm.reset();
        submitBtn.textContent = 'Bericht verzonden';
        submitBtn.classList.remove('is-sending');
        submitBtn.classList.add('is-sent');

        resetTimer = setTimeout(resetButton, 5000);
      } else {
        alert('Fout: ' + data.message);
        resetButton();
      }
    } catch (error) {
      alert('Er ging iets mis. Probeer het later opnieuw.');
      resetButton();
    }
  });
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