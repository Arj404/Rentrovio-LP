// Rentrovio Landing Page JavaScript

// Main Application Object
const RentrovioLanding = {
  // Application state
  state: {
    currentRole: 'landlord',
    isMobileMenuOpen: false,
    isScrolled: false,
    subscribers: [],
    isSubmitting: false
  },
  
  // Initialize application
  init: function() {
    this.loadSubscribers();
    this.initializeComponents();
    this.setupEventListeners();
    this.setupScrollAnimations();
  },
  
  // Load existing subscribers from localStorage
  loadSubscribers: function() {
    const stored = localStorage.getItem('rentrovio_waitlist');
    if (stored) {
      try {
        this.state.subscribers = JSON.parse(stored);
        this.updateWaitlistCounter();
      } catch (e) {
        console.warn('Failed to parse stored subscribers:', e);
        this.state.subscribers = [];
      }
    }
  },
  
  // Initialize all components
  initializeComponents: function() {
    this.HeaderComponent.init();
    this.BetaSignupComponent.init();
    this.UserRolesComponent.init();
    this.PricingComponent.init();
  },
  
  // Setup global event listeners
  setupEventListeners: function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
    
    // Global click handler for CTA buttons
    document.querySelectorAll('.header__cta-button').forEach(button => {
      button.addEventListener('click', () => {
        document.getElementById('emailInput').focus();
      });
    });
  },
  
  // Setup scroll-based animations
  setupScrollAnimations: function() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .testimonial-card, .role-info').forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  },
  
  // Update waitlist counter display
  updateWaitlistCounter: function() {
    const count = this.state.subscribers.length;
    if (count > 0) {
      const badge = document.querySelector('.coming-soon-badge__text');
      if (badge) {
        badge.textContent = `Coming Soon • ${count} on waitlist`;
      }
    }
  }
};

// Header Component
RentrovioLanding.HeaderComponent = {
  elements: {
    header: null,
    mobileToggle: null,
    navigation: null
  },
  
  init: function() {
    this.cacheElements();
    this.bindEvents();
    this.setupScrollListener();
  },
  
  cacheElements: function() {
    this.elements.header = document.getElementById('header');
    this.elements.mobileToggle = document.getElementById('mobileToggle');
    this.elements.navigation = document.getElementById('navigation');
  },
  
  bindEvents: function() {
    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    }
  },
  
  toggleMobileMenu: function() {
    RentrovioLanding.state.isMobileMenuOpen = !RentrovioLanding.state.isMobileMenuOpen;
    
    // Toggle navigation visibility
    this.elements.navigation.style.display = 
      RentrovioLanding.state.isMobileMenuOpen ? 'block' : 'none';
    
    // Toggle hamburger animation
    const hamburgers = this.elements.mobileToggle.querySelectorAll('.hamburger');
    hamburgers.forEach((line, index) => {
      if (RentrovioLanding.state.isMobileMenuOpen) {
        if (index === 0) line.style.transform = 'rotate(45deg) translate(6px, 6px)';
        if (index === 1) line.style.opacity = '0';
        if (index === 2) line.style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        line.style.transform = 'none';
        line.style.opacity = '1';
      }
    });
  },
  
  setupScrollListener: function() {
    let ticking = false;
    
    const updateHeader = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== RentrovioLanding.state.isScrolled) {
        RentrovioLanding.state.isScrolled = isScrolled;
        this.elements.header.classList.toggle('header--scrolled', isScrolled);
      }
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }
};

// Beta Signup Component
RentrovioLanding.BetaSignupComponent = {
  elements: {
    form: null,
    emailInput: null,
    submitButton: null
  },
  
  init: function() {
    this.cacheElements();
    this.bindEvents();
  },
  
  cacheElements: function() {
    this.elements.form = document.getElementById('betaSignupForm');
    this.elements.emailInput = document.getElementById('emailInput');
    this.elements.submitButton = this.elements.form?.querySelector('.beta-signup-form__button');
  },
  
  bindEvents: function() {
    if (this.elements.form) {
      this.elements.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    if (this.elements.emailInput) {
      this.elements.emailInput.addEventListener('input', this.validateEmail.bind(this));
      this.elements.emailInput.addEventListener('blur', this.validateEmail.bind(this));
    }
  },
  
  handleSubmit: function(e) {
    e.preventDefault();
    
    if (RentrovioLanding.state.isSubmitting) return;
    
    const email = this.elements.emailInput.value.trim();
    
    if (!this.isValidEmail(email)) {
      this.showNotification('Please enter a valid email address', 'error');
      this.elements.emailInput.focus();
      return;
    }
    
    if (RentrovioLanding.state.subscribers.includes(email)) {
      this.showNotification('This email is already on our waitlist!', 'error');
      return;
    }
    
    this.submitToWaitlist(email);
  },
  
  submitToWaitlist: function(email) {
    RentrovioLanding.state.isSubmitting = true;
    this.updateSubmitButton('Joining...', true);
    
    // Simulate API call
    setTimeout(() => {
      // Add to subscribers
      RentrovioLanding.state.subscribers.push(email);
      
      // Save to localStorage
      localStorage.setItem('rentrovio_waitlist', JSON.stringify(RentrovioLanding.state.subscribers));
      
      // Update UI
      this.showNotification('🎉 Welcome to the waitlist! We\'ll notify you when we launch.', 'success');
      this.elements.emailInput.value = '';
      RentrovioLanding.updateWaitlistCounter();
      
      // Reset button
      RentrovioLanding.state.isSubmitting = false;
      this.updateSubmitButton('Join Waitlist', false);
      
      // Track signup (analytics would go here)
      this.trackSignup(email);
      
    }, 1500);
  },
  
  isValidEmail: function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  validateEmail: function() {
    const email = this.elements.emailInput.value.trim();
    const isValid = email === '' || this.isValidEmail(email);
    
    this.elements.emailInput.style.borderColor = isValid ? '#e5e7eb' : '#E63946';
    
    if (!isValid && email !== '') {
      this.elements.emailInput.style.borderColor = '#E63946';
    } else {
      this.elements.emailInput.style.borderColor = '#e5e7eb';
    }
  },
  
  updateSubmitButton: function(text, disabled) {
    if (this.elements.submitButton) {
      this.elements.submitButton.textContent = text;
      this.elements.submitButton.disabled = disabled;
    }
  },
  
  showNotification: function(message, type) {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    notification.style.animation = 'slideInRight 0.3s ease';
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  },
  
  trackSignup: function(email) {
    // Analytics tracking would go here
    console.log('Beta signup tracked:', email);
    
    // Example: Google Analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'beta_signup', {
        event_category: 'engagement',
        event_label: 'waitlist'
      });
    }
  }
};

// User Roles Component
RentrovioLanding.UserRolesComponent = {
  elements: {
    tabs: null,
    contents: null
  },
  
  rolesData: {
    landlord: {
      title: 'Landlord Dashboard',
      description: 'Comprehensive property management tools designed for landlords',
      tabs: ['Home', 'Properties', 'Earnings', 'Staff', 'Analytics', 'Profile'],
      features: [
        'Property portfolio management',
        'Revenue tracking and analytics',
        'Staff coordination tools',
        'Document management',
        'Maintenance oversight',
        'Bulk operations for efficiency'
      ]
    },
    tenant: {
      title: 'Tenant Portal',
      description: 'Streamlined rental experience for tenants',
      tabs: ['Home', 'My Unit', 'Payments', 'Maintenance', 'Documents', 'Profile'],
      features: [
        'Unit information and lease details',
        'Online payment processing',
        'Maintenance request system',
        'Payment history tracking',
        'Document access portal',
        'Request status monitoring'
      ]
    },
    caretaker: {
      title: 'Caretaker Interface',
      description: 'Efficient property maintenance coordination tools',
      tabs: ['Home', 'Properties', 'Maintenance', 'Overdue', 'Utilities', 'Profile'],
      features: [
        'Multi-property oversight',
        'Task management system',
        'Utility monitoring',
        'Tenant communication tools',
        'Property analytics',
        'Maintenance scheduling'
      ]
    }
  },
  
  init: function() {
    this.cacheElements();
    this.bindEvents();
    this.renderActiveRole();
  },
  
  cacheElements: function() {
    this.elements.tabs = document.querySelectorAll('.user-roles__tab');
    this.elements.contents = document.querySelectorAll('.role-content');
  },
  
  bindEvents: function() {
    this.elements.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const role = tab.getAttribute('data-role');
        this.switchRole(role);
      });
    });
  },
  
  switchRole: function(role) {
    if (RentrovioLanding.state.currentRole === role) return;
    
    RentrovioLanding.state.currentRole = role;
    this.updateActiveTabs();
    this.renderActiveRole();
  },
  
  updateActiveTabs: function() {
    this.elements.tabs.forEach(tab => {
      const isActive = tab.getAttribute('data-role') === RentrovioLanding.state.currentRole;
      tab.classList.toggle('user-roles__tab--active', isActive);
    });
  },
  
  renderActiveRole: function() {
    // Hide all content
    this.elements.contents.forEach(content => {
      content.classList.remove('role-content--active');
    });
    
    // Show active content
    const activeContent = document.getElementById(`${RentrovioLanding.state.currentRole}-content`);
    if (activeContent) {
      activeContent.classList.add('role-content--active');
    }
    
    // Update content dynamically if needed
    this.updateRoleContent();
  },
  
  updateRoleContent: function() {
    const roleData = this.rolesData[RentrovioLanding.state.currentRole];
    if (!roleData) return;
    
    const activeContent = document.getElementById(`${RentrovioLanding.state.currentRole}-content`);
    if (!activeContent) return;
    
    // Update navigation tabs
    const navTabs = activeContent.querySelector('.role-navigation__tabs');
    if (navTabs) {
      navTabs.innerHTML = roleData.tabs
        .map((tab, index) => 
          `<span class="nav-tab ${index === 0 ? 'nav-tab--active' : ''}">${tab}</span>`
        ).join('');
    }
    
    // Update features list
    const featuresList = activeContent.querySelector('.role-features__list');
    if (featuresList) {
      featuresList.innerHTML = roleData.features
        .map(feature => `<li>${feature}</li>`)
        .join('');
    }
  }
};

// Pricing Component
RentrovioLanding.PricingComponent = {
  init: function() {
    this.setupComingSoonEffects();
    this.setupPricingAnimations();
  },
  
  setupComingSoonEffects: function() {
    const pricingButton = document.querySelector('.pricing-card__button');
    
    if (pricingButton && pricingButton.disabled) {
      pricingButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('emailInput')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
        setTimeout(() => {
          document.getElementById('emailInput')?.focus();
        }, 500);
      });
      
      // Add hover effect
      const pricingCard = document.querySelector('.pricing-card');
      if (pricingCard) {
        pricingCard.addEventListener('mouseenter', () => {
          pricingButton.style.transform = 'scale(1.02)';
        });
        
        pricingCard.addEventListener('mouseleave', () => {
          pricingButton.style.transform = 'scale(1)';
        });
      }
    }
  },
  
  setupPricingAnimations: function() {
    const pricingCard = document.querySelector('.pricing-card');
    if (pricingCard) {
      pricingCard.classList.add('fade-in');
      
      // Animate pricing when visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate price counter
            const priceAmount = entry.target.querySelector('.pricing-card__amount');
            if (priceAmount) {
              this.animatePrice(priceAmount, 10);
            }
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(pricingCard);
    }
  },
  
  animatePrice: function(element, targetPrice) {
    let currentPrice = 0;
    const increment = targetPrice / 20;
    const duration = 1000;
    const intervalTime = duration / 20;
    
    const timer = setInterval(() => {
      currentPrice += increment;
      if (currentPrice >= targetPrice) {
        currentPrice = targetPrice;
        clearInterval(timer);
      }
      element.textContent = `$${Math.floor(currentPrice)}`;
    }, intervalTime);
  }
};

// Utility Functions
RentrovioLanding.Utils = {
  // Debounce function for performance
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function for scroll events
  throttle: function(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Check if element is in viewport
  isInViewport: function(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};

// Performance optimizations
const optimizedScroll = RentrovioLanding.Utils.throttle(() => {
  // Scroll optimizations can be added here
}, 100);

window.addEventListener('scroll', optimizedScroll);

// Error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  // Error reporting could be added here
});

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    RentrovioLanding.init();
    console.log('Rentrovio Landing Page initialized successfully');
  } catch (error) {
    console.error('Failed to initialize landing page:', error);
  }
});

// Initialize on window load as fallback
window.addEventListener('load', () => {
  // Additional load optimizations
  if (typeof RentrovioLanding !== 'undefined' && !RentrovioLanding.initialized) {
    RentrovioLanding.init();
  }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Page became visible - could refresh data or resume animations
  } else {
    // Page became hidden - could pause animations or save state
  }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RentrovioLanding;
}