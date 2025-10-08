// ====================================
// MODERN PROFESSIONAL PORTFOLIO JS
// Enhanced Version with Advanced Features
// ====================================

class Portfolio {
  constructor() {
    this.init();
    this.setupEventListeners();
    this.setupScrollReveal();
    this.setupProjectsToggle();
    this.setupTestimonialsSlider();
    this.setupFormHandling();
    this.setupSmoothScrolling();
    this.setupNavbarScroll();
  }

  
  init() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Set current year (update both id and data-year spans)
    const yearElements = [
      ...document.querySelectorAll('[data-year]'),
      ...document.querySelectorAll('#footerYear'),
    ];
    yearElements.forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
      });
    }
    // Close mobile menu on nav link click
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', false);
      });
    });
    // Auto-hide menu on resize
    window.addEventListener('resize', ()=> {
      if (window.innerWidth > 900) {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  setupScrollReveal() {
    // For elements with [data-aos], add .reveal and animate with IntersectionObserver
    const revealElements = document.querySelectorAll('[data-aos]');
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    revealElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  setupProjectsToggle() {
    this.projectsExpanded = false;
    this.setupProjectsToggleHandler();
  }

  setupProjectsToggleHandler() {
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    if (!viewMoreBtn) return;
    viewMoreBtn.addEventListener('click', () => this.toggleProjects());
  }

  toggleProjects() {
    const projectGrid = document.querySelector('.projects-grid');
    if (!projectGrid) return;
    const allProjects = projectGrid.querySelectorAll('.project-card');
    // Show/hide all EXCEPT the first 2 (edit this initial count for more/less shown by default)
    const initialVisibleCount = 2;
    const hiddenProjects = Array.from(allProjects).filter((_, idx) => idx >= initialVisibleCount);
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    const btnIcon = viewMoreBtn ? viewMoreBtn.querySelector('i') : null;

    if (!this.projectsExpanded) {
      hiddenProjects.forEach((project, index) => {
        setTimeout(() => {
          project.classList.remove('hidden');
          project.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
        }, index * 80);
      });
      if (viewMoreBtn) {
        viewMoreBtn.innerHTML = '<i data-lucide="minus"></i> Show Less Projects';
      }
      this.projectsExpanded = true;
    } else {
      hiddenProjects.forEach(project => {
        project.classList.add('hidden');
        project.style.animation = '';
      });
      if (viewMoreBtn) {
        viewMoreBtn.innerHTML = '<i data-lucide="plus"></i> View More Projects';
      }
      this.projectsExpanded = false;
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // === TESTIMONIAL SLIDER ===
  _resetTestimonialInterval() {
    clearInterval(this.testimonialInterval);
    if (this.testimonialCards && this.testimonialCards.length > 1) {
      this.testimonialInterval = setInterval(() => this.nextTestimonial(), 6000);
    }
  }
  setupTestimonialsSlider() {
    this.currentTestimonial = 0;
    this.testimonialCards = document.querySelectorAll('.testimonial-card');
    this.testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    this.prevBtn = document.querySelector('.nav-btn.prev');
    this.nextBtn = document.querySelector('.nav-btn.next');
    if (this.testimonialCards.length === 0) return;

    // Dots might not be present if not in HTML
    if (this.testimonialDots && this.testimonialDots.length) {
      this.testimonialDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => { this.goToTestimonial(idx); this._resetTestimonialInterval(); });
      });
    }
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.changeTestimonial(-1); this._resetTestimonialInterval(); });
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.changeTestimonial(1); this._resetTestimonialInterval(); });
    this.updateTestimonialDisplay();
    this._resetTestimonialInterval();
  }
  changeTestimonial(direction) {
    this.currentTestimonial += direction;
    const total = this.testimonialCards.length;
    if (this.currentTestimonial >= total) this.currentTestimonial = 0;
    else if (this.currentTestimonial < 0) this.currentTestimonial = total - 1;
    this.updateTestimonialDisplay();
  }
  nextTestimonial() {
    this.changeTestimonial(1);
  }
  goToTestimonial(idx) {
    if (idx >= 0 && idx < this.testimonialCards.length && idx !== this.currentTestimonial) {
      this.currentTestimonial = idx;
      this.updateTestimonialDisplay();
    }
  }
  updateTestimonialDisplay() {
    this.testimonialCards.forEach((card, i) => card.classList.toggle('active', i === this.currentTestimonial));
    if (this.testimonialDots && this.testimonialDots.length) {
      this.testimonialDots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentTestimonial));
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // === CONTACT FORM HANDLING, VALIDATION, NOTIFICATION ===
  setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    contactForm.addEventListener('submit', async (e) => await this.handleFormSubmission(e));
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });
  }

  async handleFormSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const allInputs = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;
    allInputs.forEach(input => {
      if (!this.validateField(input)) isFormValid = false;
    });
    if (!isFormValid) {
      this.showNotification('Please correct the highlighted fields.', 'error');
      return;
    }
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Sending...';
    submitBtn.disabled = true;
    form.classList.add('loading');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    try {
      await this.simulateFormSubmission(new FormData(form));
      this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      form.reset();
    } catch (error) {
      this.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.classList.remove('loading');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
  
  async simulateFormSubmission(formData) {
    await new Promise(resolve => setTimeout(resolve, 1800));
    if (Math.random() > 0.07) return Promise.resolve();
    else throw new Error('Simulated error');
  }
  
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    field.classList.remove('error', 'success');
    if (field.hasAttribute('required') && value.length === 0) isValid = false;
    if (field.type === 'email') isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (field.type === 'text') isValid = value.length >= 2;
    if (field.name === 'message') isValid = value.length >= 10;
    field.classList.add(isValid ? 'success' : 'error');
    return isValid;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const iconName = type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-triangle' : 'info');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i data-lucide="${iconName}"></i>
        <span>${message}</span>
      </div>`;
    document.body.appendChild(notification);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => { if (notification) notification.remove(); }, 350);
    }, 4000);
  }

  // === SMOOTH SCROLLING for anchor links/buttons
  setupSmoothScrolling() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const targetId = link.getAttribute('href').slice(1);
      if (targetId) {
        e.preventDefault();
        this.scrollToSection(targetId);
      }
    });
    window.scrollToSection = (id) => this.scrollToSection(id);
  }
  scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY;
    const targetPosition = offsetTop - navbarHeight - 20; 
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  // === NAVBAR SHOW/HIDE/SCROLLED ===
  setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) navbar.style.transform = 'translateY(-100%)';
        else navbar.style.transform = 'translateY(0)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScrollY = currentScrollY;
    });
    // Back To Top button appearance
    const backBtn = document.querySelector('.back-to-top');
    if (backBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) backBtn.classList.add('show');
        else backBtn.classList.remove('show');
      });
      backBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => new Portfolio());

// Inject notification CSS for elegant toasts if not already styled
const notificationStyles = `
<style>
.notification {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 10000;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  backdrop-filter: blur(10px);
  transform: translateX(400px);
  opacity: 0;
  transition: all var(--transition-normal);
  max-width: 400px;
}
.notification.show { transform: translateX(0); opacity:1;}
.notification-content {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.notification-success { border-color: var(--accent-secondary);}
.notification-error { border-color: #ef4444;}
.notification-success i { color: var(--accent-secondary);}
.notification-error i { color: #ef4444;}
.navbar.scrolled { backdrop-filter: blur(20px); background: rgba(10, 10, 10, 0.95);}
.animate-spin { animation: spin 1s linear infinite;}
@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg); } }
.contact-form input.error, .contact-form textarea.error { border-color: #ef4444 !important; box-shadow: 0 0 0 1px #ef4444;}
.contact-form input.success, .contact-form textarea.success { border-color: var(--accent-secondary) !important; box-shadow: 0 0 0 1px var(--accent-secondary);}
@media (max-width: 768px) {
  .notification {
    top: 80px; right: 10px; left: 10px; max-width: none; transform: translateY(-100px);
  }
  .notification.show { transform: translateY(0);}
}
</style>
`;
document.head.insertAdjacentHTML('beforeend', notificationStyles);

// Export to global if needed
window.Portfolio = Portfolio;
