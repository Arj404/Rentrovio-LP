// Rentrovio Landing Page JavaScript

// Main Application Object
const RentrovioLanding = {
  // Application state
  state: {
    currentRole: "landlord",
    isMobileMenuOpen: false,
    isScrolled: false,
    subscribers: [],
    isSubmitting: false,
  },

  // Initialize application
  init: function () {
    this.initializeComponents();
    this.setupEventListeners();
    this.setupScrollAnimations();
  },

  // Initialize all components
  initializeComponents: function () {
    this.HeaderComponent.init();
    this.BetaSignupComponent.init();
    this.ContactFormComponent.init();
    this.UserRolesComponent.init();
    this.PricingComponent.init();
  },

  // Setup global event listeners
  setupEventListeners: function () {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Global click handler for CTA buttons
    document
      .querySelectorAll(".header__cta-button, .pricing-card__button")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const emailInput = document.getElementById("emailInput");
          if (emailInput) {
            // Scroll to the beta signup section smoothly
            emailInput.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            // Focus on the email input after scrolling
            setTimeout(() => {
              emailInput.focus();
            }, 500);
          }
        });
      });
  },

  // Setup scroll-based animations
  setupScrollAnimations: function () {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document
      .querySelectorAll(".feature-card, .testimonial-card, .role-info")
      .forEach((el) => {
        el.classList.add("fade-in");
        observer.observe(el);
      });
  },
};

// Header Component
RentrovioLanding.HeaderComponent = {
  elements: {
    header: null,
    mobileToggle: null,
    navigation: null,
  },

  init: function () {
    this.cacheElements();
    this.bindEvents();
    this.setupScrollListener();
  },

  cacheElements: function () {
    this.elements.header = document.getElementById("header");
    this.elements.mobileToggle = document.getElementById("mobileToggle");
    this.elements.navigation = document.getElementById("navigation");
  },

  bindEvents: function () {
    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.addEventListener(
        "click",
        this.toggleMobileMenu.bind(this)
      );

      // Enhanced touch support
      this.elements.mobileToggle.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.toggleMobileMenu();
        },
        { passive: false }
      );
    }

    // Close mobile menu when clicking navigation links
    if (this.elements.navigation) {
      this.elements.navigation.addEventListener("click", (e) => {
        if (
          e.target.matches(".header__nav-link") &&
          RentrovioLanding.state.isMobileMenuOpen
        ) {
          this.toggleMobileMenu();
        }
      });
    }

    // Close mobile menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && RentrovioLanding.state.isMobileMenuOpen) {
        this.toggleMobileMenu();
        this.elements.mobileToggle.focus();
      }
    });

    // Enhanced outside click detection
    document.addEventListener("click", (e) => {
      if (
        RentrovioLanding.state.isMobileMenuOpen &&
        !this.elements.navigation.contains(e.target) &&
        !this.elements.mobileToggle.contains(e.target)
      ) {
        this.toggleMobileMenu();
      }
    });

    // Handle resize to close mobile menu on desktop
    window.addEventListener("resize", this.handleResize.bind(this));
  },

  toggleMobileMenu: function () {
    const isOpen = RentrovioLanding.state.isMobileMenuOpen;
    const newState = !isOpen;

    // Update state
    RentrovioLanding.state.isMobileMenuOpen = newState;

    // Handle navigation visibility
    if (newState) {
      // Show menu with animation
      this.elements.navigation.style.visibility = "visible";
      this.elements.navigation.style.opacity = "0";
      this.elements.navigation.style.transform = "translateY(-100%)";

      // Force reflow
      this.elements.navigation.offsetHeight;

      // Animate in
      this.elements.navigation.classList.add("active");
    } else {
      // Hide menu with animation
      this.elements.navigation.classList.remove("active");

      // Hide after animation completes
      setTimeout(() => {
        if (!RentrovioLanding.state.isMobileMenuOpen) {
          this.elements.navigation.style.visibility = "hidden";
        }
      }, 400);
    }

    // Update ARIA attributes for accessibility
    this.elements.mobileToggle.setAttribute("aria-expanded", newState);

    // Toggle hamburger animation class
    this.elements.mobileToggle.classList.toggle("active", newState);

    // Prevent body scroll when menu is open
    document.body.style.overflow = newState ? "hidden" : "";

    // Focus management for accessibility
    if (newState) {
      const firstNavLink =
        this.elements.navigation.querySelector(".header__nav-link");
      if (firstNavLink) {
        setTimeout(() => firstNavLink.focus(), 200);
      }
    }
  },

  handleResize: function () {
    // Close mobile menu when resizing to desktop
    if (window.innerWidth >= 768 && RentrovioLanding.state.isMobileMenuOpen) {
      RentrovioLanding.state.isMobileMenuOpen = false;
      this.elements.navigation.classList.remove("active");
      this.elements.mobileToggle.classList.remove("active");
      this.elements.mobileToggle.setAttribute("aria-expanded", false);
      document.body.style.overflow = "";
      // Reset navigation styles for desktop
      this.elements.navigation.style.visibility = "";
      this.elements.navigation.style.opacity = "";
      this.elements.navigation.style.transform = "";
    }
  },

  setupScrollListener: function () {
    let ticking = false;

    const updateHeader = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== RentrovioLanding.state.isScrolled) {
        RentrovioLanding.state.isScrolled = isScrolled;
        this.elements.header.classList.toggle("header--scrolled", isScrolled);
      }
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  },
};

// Beta Signup Component
RentrovioLanding.BetaSignupComponent = {
  elements: {
    form: null,
    emailInput: null,
    submitButton: null,
  },

  init: function () {
    this.cacheElements();
    this.bindEvents();
  },

  cacheElements: function () {
    this.elements.form = document.getElementById("betaSignupForm");
    this.elements.emailInput = document.getElementById("emailInput");
    this.elements.submitButton = this.elements.form?.querySelector(
      ".beta-signup-form__button"
    );
  },

  bindEvents: function () {
    if (this.elements.form) {
      this.elements.form.addEventListener(
        "submit",
        this.handleSubmit.bind(this)
      );
    }

    if (this.elements.emailInput) {
      this.elements.emailInput.addEventListener(
        "input",
        this.validateEmail.bind(this)
      );
      this.elements.emailInput.addEventListener(
        "blur",
        this.validateEmail.bind(this)
      );
    }
  },

  handleSubmit: function (e) {
    e.preventDefault();

    if (RentrovioLanding.state.isSubmitting) return;

    const email = this.elements.emailInput.value.trim();

    if (!this.isValidEmail(email)) {
      this.showNotification("Please enter a valid email address", "error");
      this.elements.emailInput.focus();
      return;
    }

    if (RentrovioLanding.state.subscribers.includes(email)) {
      this.showNotification("This email is already on our waitlist!", "error");
      return;
    }

    this.submitToWaitlist(email);
  },

  submitToWaitlist: function (email) {
    RentrovioLanding.state.isSubmitting = true;
    this.updateSubmitButton("Joining...", true);

    // Simulate API call
    setTimeout(() => {
      // Add to subscribers
      RentrovioLanding.state.subscribers.push(email);

      // Save to localStorage
      localStorage.setItem(
        "rentrovio_waitlist",
        JSON.stringify(RentrovioLanding.state.subscribers)
      );

      // Send admin notification email
      this.sendAdminNotification(email);

      // Update UI
      this.showNotification(
        "🎉 Welcome to the waitlist! We'll notify you when we launch.",
        "success"
      );
      this.elements.emailInput.value = "";
      RentrovioLanding.updateWaitlistCounter();

      // Reset button
      RentrovioLanding.state.isSubmitting = false;
      this.updateSubmitButton("Join Waitlist", false);

      // Track signup (analytics would go here)
      this.trackSignup(email);
    }, 1500);
  },

  sendAdminNotification: function (email) {
    // Send notification email to admin about new beta signup
    if (typeof emailjs !== "undefined") {
      const adminEmailParams = {
        to_email: "hello@rentrovio.com",
        subject: "New Beta Waitlist Signup - Rentrovio",
        subscriber_email: email,
        signup_time: new Date().toLocaleString(),
        total_subscribers: RentrovioLanding.state.subscribers.length,
        message: `A new user has joined the Rentrovio beta waitlist!\n\nEmail: ${email}\nSignup Time: ${new Date().toLocaleString()}\nTotal Subscribers: ${
          RentrovioLanding.state.subscribers.length
        }\n\nThis is an automated notification from the Rentrovio landing page.`,
      };

      emailjs
        .send("default_service", "admin_notification", adminEmailParams)
        .then(
          (response) => {
            console.log("Admin notification sent successfully:", response);
          },
          (error) => {
            console.warn("Failed to send admin notification:", error);
          }
        );
    } else {
      console.log(
        "EmailJS not available, admin notification simulated for:",
        email
      );
    }
  },

  isValidEmail: function (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateEmail: function () {
    const email = this.elements.emailInput.value.trim();
    const isValid = email === "" || this.isValidEmail(email);

    this.elements.emailInput.style.borderColor = isValid
      ? "#e5e7eb"
      : "#E63946";

    if (!isValid && email !== "") {
      this.elements.emailInput.style.borderColor = "#E63946";
    } else {
      this.elements.emailInput.style.borderColor = "#e5e7eb";
    }
  },

  updateSubmitButton: function (text, disabled) {
    if (this.elements.submitButton) {
      if (disabled && text.includes("...")) {
        this.elements.submitButton.innerHTML = `<span class="spinner"></span>${text}`;
      } else {
        this.elements.submitButton.textContent = text;
      }
      this.elements.submitButton.disabled = disabled;
    }
  },

  showNotification: function (message, type) {
    // Remove existing notifications
    document.querySelectorAll(".notification").forEach((n) => n.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    notification.style.animation = "slideInRight 0.3s ease";

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  },

  trackSignup: function (email) {
    // Analytics tracking would go here
    console.log("Beta signup tracked:", email);

    // Example: Google Analytics event
    if (typeof gtag !== "undefined") {
      gtag("event", "beta_signup", {
        event_category: "engagement",
        event_label: "waitlist",
      });
    }
  },
};

// Contact Form Component
RentrovioLanding.ContactFormComponent = {
  elements: {
    form: null,
    nameInput: null,
    emailInput: null,
    subjectSelect: null,
    messageTextarea: null,
    userTypeRadios: null,
    submitButton: null,
    submitText: null,
    submitLoading: null,
  },

  emailConfig: {
    serviceId: "default_service",
    templateId: "contact_form",
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    toEmail: "hello@rentrovio.com",
  },

  init: function () {
    this.cacheElements();
    this.bindEvents();
    this.initializeEmailJS();
  },

  cacheElements: function () {
    this.elements.form = document.getElementById("contactForm");
    this.elements.nameInput = document.getElementById("contactName");
    this.elements.emailInput = document.getElementById("contactEmail");
    this.elements.subjectSelect = document.getElementById("contactSubject");
    this.elements.messageTextarea = document.getElementById("contactMessage");
    this.elements.userTypeRadios = document.querySelectorAll(
      'input[name="userType"]'
    );
    this.elements.submitButton = document.querySelector(
      ".contact-form__submit"
    );
    this.elements.submitText = document.querySelector(".submit-text");
    this.elements.submitLoading = document.querySelector(".submit-loading");
  },

  bindEvents: function () {
    if (this.elements.form) {
      this.elements.form.addEventListener(
        "submit",
        this.handleSubmit.bind(this)
      );
    }

    // Real-time validation
    if (this.elements.nameInput) {
      this.elements.nameInput.addEventListener("blur", () =>
        this.validateField("name")
      );
      this.elements.nameInput.addEventListener("input", () =>
        this.clearFieldError("name")
      );
    }

    if (this.elements.emailInput) {
      this.elements.emailInput.addEventListener("blur", () =>
        this.validateField("email")
      );
      this.elements.emailInput.addEventListener("input", () =>
        this.clearFieldError("email")
      );
    }

    if (this.elements.subjectSelect) {
      this.elements.subjectSelect.addEventListener("change", () =>
        this.validateField("subject")
      );
    }

    if (this.elements.messageTextarea) {
      this.elements.messageTextarea.addEventListener("blur", () =>
        this.validateField("message")
      );
      this.elements.messageTextarea.addEventListener("input", () =>
        this.clearFieldError("message")
      );
    }
  },

  initializeEmailJS: function () {
    // Initialize EmailJS when the library is loaded
    if (typeof emailjs !== "undefined") {
      try {
        emailjs.init(this.emailConfig.publicKey);
        console.log("EmailJS initialized successfully");
      } catch (error) {
        console.warn("EmailJS initialization failed:", error);
      }
    } else {
      console.warn("EmailJS library not loaded");
    }
  },

  handleSubmit: function (e) {
    e.preventDefault();

    if (!this.validateForm()) {
      this.showNotification(
        "Please correct the errors before submitting.",
        "error"
      );
      return;
    }

    this.sendEmail();
  },

  validateForm: function () {
    let isValid = true;

    // Validate all fields
    ["name", "email", "subject", "message"].forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },

  validateField: function (fieldName) {
    const validators = {
      name: () => {
        const value = this.elements.nameInput.value.trim();
        if (value.length < 2) {
          this.showFieldError(
            "name",
            "Name must be at least 2 characters long"
          );
          return false;
        }
        return true;
      },

      email: () => {
        const value = this.elements.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.showFieldError("email", "Please enter a valid email address");
          return false;
        }
        return true;
      },

      subject: () => {
        const value = this.elements.subjectSelect.value;
        if (!value) {
          this.showFieldError("subject", "Please select a subject");
          return false;
        }
        return true;
      },

      message: () => {
        const value = this.elements.messageTextarea.value.trim();
        if (value.length < 10) {
          this.showFieldError(
            "message",
            "Message must be at least 10 characters long"
          );
          return false;
        }
        return true;
      },
    };

    const validator = validators[fieldName];
    if (validator) {
      const isValid = validator();
      if (isValid) {
        this.clearFieldError(fieldName);
      }
      return isValid;
    }

    return true;
  },

  showFieldError: function (fieldName, message) {
    const field = this.getFieldElement(fieldName);
    const formGroup = field?.closest(".form-group");

    if (formGroup) {
      formGroup.classList.add("form-group--error");

      // Remove existing error message
      const existingError = formGroup.querySelector(".form-error-message");
      if (existingError) {
        existingError.remove();
      }

      // Add new error message
      const errorElement = document.createElement("div");
      errorElement.className = "form-error-message";
      errorElement.textContent = message;
      formGroup.appendChild(errorElement);
    }
  },

  clearFieldError: function (fieldName) {
    const field = this.getFieldElement(fieldName);
    const formGroup = field?.closest(".form-group");

    if (formGroup) {
      formGroup.classList.remove("form-group--error");
      const errorMessage = formGroup.querySelector(".form-error-message");
      if (errorMessage) {
        errorMessage.remove();
      }
    }
  },

  getFieldElement: function (fieldName) {
    const fieldMap = {
      name: this.elements.nameInput,
      email: this.elements.emailInput,
      subject: this.elements.subjectSelect,
      message: this.elements.messageTextarea,
    };
    return fieldMap[fieldName];
  },

  sendEmail: function () {
    this.setSubmitState(true);

    const formData = this.getFormData();
    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      user_type: formData.userType,
      timestamp: new Date().toISOString(),
      to_email: this.emailConfig.toEmail,
    };

    // Try to send email with EmailJS
    if (typeof emailjs !== "undefined") {
      emailjs
        .send(
          this.emailConfig.serviceId,
          this.emailConfig.templateId,
          emailParams
        )
        .then(
          (response) => {
            console.log("Email sent successfully:", response);
            this.onEmailSuccess(formData);
          },
          (error) => {
            console.error("Email sending failed:", error);
            this.onEmailError(error);
          }
        );
    } else {
      // Fallback: simulate successful email sending for demo
      console.log("EmailJS not available, simulating email send:", emailParams);
      setTimeout(() => {
        this.onEmailSuccess(formData);
      }, 2000);
    }
  },

  getFormData: function () {
    const selectedUserType = document.querySelector(
      'input[name="userType"]:checked'
    );

    return {
      name: this.elements.nameInput.value.trim(),
      email: this.elements.emailInput.value.trim(),
      subject: this.elements.subjectSelect.value,
      message: this.elements.messageTextarea.value.trim(),
      userType: selectedUserType ? selectedUserType.value : "not-specified",
    };
  },

  onEmailSuccess: function (formData) {
    this.setSubmitState(false);
    this.showNotification(
      "🎉 Message sent successfully! We'll get back to you within 24 hours.",
      "success"
    );
    this.resetForm();
    this.trackContactSubmission(formData);
  },

  onEmailError: function (error) {
    this.setSubmitState(false);
    this.showNotification(
      "Sorry, there was an error sending your message. Please try again or email us directly at hello@rentrovio.com.",
      "error"
    );
    console.error("Contact form error:", error);
  },

  setSubmitState: function (isSubmitting) {
    if (this.elements.submitButton) {
      this.elements.submitButton.disabled = isSubmitting;
    }

    if (this.elements.submitText && this.elements.submitLoading) {
      if (isSubmitting) {
        this.elements.submitText.style.display = "none";
        this.elements.submitLoading.style.display = "inline";
      } else {
        this.elements.submitText.style.display = "inline";
        this.elements.submitLoading.style.display = "none";
      }
    }
  },

  resetForm: function () {
    if (this.elements.form) {
      this.elements.form.reset();

      // Clear any error states
      document.querySelectorAll(".form-group--error").forEach((group) => {
        group.classList.remove("form-group--error");
      });

      document.querySelectorAll(".form-error-message").forEach((error) => {
        error.remove();
      });

      // Reset radio buttons to default (landlord)
      const firstRadio = document.querySelector(
        'input[name="userType"][value="landlord"]'
      );
      if (firstRadio) {
        firstRadio.checked = true;
      }
    }
  },

  showNotification: function (message, type) {
    // Remove existing notifications
    document.querySelectorAll(".notification").forEach((n) => n.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    notification.style.animation = "slideInRight 0.3s ease";

    // Remove after 6 seconds (longer for contact form)
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 6000);
  },

  trackContactSubmission: function (formData) {
    // Analytics tracking
    console.log("Contact form submission tracked:", formData);

    if (typeof gtag !== "undefined") {
      gtag("event", "contact_form_submit", {
        event_category: "engagement",
        event_label: formData.subject,
        user_type: formData.userType,
      });
    }
  },
};

// User Roles Component
RentrovioLanding.UserRolesComponent = {
  elements: {
    tabs: null,
    contents: null,
  },

  rolesData: {
    landlord: {
      title: "Landlord Dashboard",
      description:
        "Comprehensive property management tools designed for landlords",
      tabs: ["Home", "Properties", "Earnings", "Staff", "Analytics", "Profile"],
      features: [
        "Property portfolio management",
        "Revenue tracking and analytics",
        "Staff coordination tools",
        "Document management",
        "Maintenance oversight",
        "Bulk operations for efficiency",
      ],
    },
    tenant: {
      title: "Tenant Portal",
      description: "Streamlined rental experience for tenants",
      tabs: [
        "Home",
        "My Unit",
        "Payments",
        "Maintenance",
        "Documents",
        "Profile",
      ],
      features: [
        "Unit information and lease details",
        "Online payment processing",
        "Maintenance request system",
        "Payment history tracking",
        "Document access portal",
        "Request status monitoring",
      ],
    },
    caretaker: {
      title: "Caretaker Interface",
      description: "Efficient property maintenance coordination tools",
      tabs: [
        "Home",
        "Properties",
        "Maintenance",
        "Overdue",
        "Utilities",
        "Profile",
      ],
      features: [
        "Multi-property oversight",
        "Task management system",
        "Utility monitoring",
        "Tenant communication tools",
        "Property analytics",
        "Maintenance scheduling",
      ],
    },
  },

  init: function () {
    this.cacheElements();
    this.bindEvents();
    this.renderActiveRole();
  },

  cacheElements: function () {
    this.elements.tabs = document.querySelectorAll(".user-roles__tab");
    this.elements.contents = document.querySelectorAll(".role-content");
  },

  bindEvents: function () {
    this.elements.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const role = tab.getAttribute("data-role");
        this.switchRole(role);
      });
    });
  },

  switchRole: function (role) {
    if (RentrovioLanding.state.currentRole === role) return;

    RentrovioLanding.state.currentRole = role;
    this.updateActiveTabs();
    this.renderActiveRole();
  },

  updateActiveTabs: function () {
    this.elements.tabs.forEach((tab) => {
      const isActive =
        tab.getAttribute("data-role") === RentrovioLanding.state.currentRole;
      tab.classList.toggle("user-roles__tab--active", isActive);
    });
  },

  renderActiveRole: function () {
    // Hide all content
    this.elements.contents.forEach((content) => {
      content.classList.remove("role-content--active");
    });

    // Show active content
    const activeContent = document.getElementById(
      `${RentrovioLanding.state.currentRole}-content`
    );
    if (activeContent) {
      activeContent.classList.add("role-content--active");
    }

    // Update content dynamically if needed
    this.updateRoleContent();
  },

  updateRoleContent: function () {
    const roleData = this.rolesData[RentrovioLanding.state.currentRole];
    if (!roleData) return;

    const activeContent = document.getElementById(
      `${RentrovioLanding.state.currentRole}-content`
    );
    if (!activeContent) return;

    // Update navigation tabs
    const navTabs = activeContent.querySelector(".role-navigation__tabs");
    if (navTabs) {
      navTabs.innerHTML = roleData.tabs
        .map(
          (tab, index) =>
            `<span class="nav-tab ${
              index === 0 ? "nav-tab--active" : ""
            }">${tab}</span>`
        )
        .join("");
    }

    // Update features list
    const featuresList = activeContent.querySelector(".role-features__list");
    if (featuresList) {
      featuresList.innerHTML = roleData.features
        .map((feature) => `<li>${feature}</li>`)
        .join("");
    }
  },
};

// Pricing Component
RentrovioLanding.PricingComponent = {
  init: function () {
    this.setupComingSoonEffects();
  },

  setupComingSoonEffects: function () {
    const pricingButton = document.querySelector(".pricing-card__button");

    if (pricingButton) {
      // Add click handler regardless of disabled state
      pricingButton.addEventListener("click", (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("emailInput");
        if (emailInput) {
          emailInput.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          setTimeout(() => {
            emailInput.focus();
          }, 500);
        }
      });

      // Add hover effect
      const pricingCard = document.querySelector(".pricing-card");
      if (pricingCard) {
        pricingCard.addEventListener("mouseenter", () => {
          pricingButton.style.transform = "scale(1.02)";
        });

        pricingCard.addEventListener("mouseleave", () => {
          pricingButton.style.transform = "scale(1)";
        });
      }
    }
  },

  animatePrice: function (element, targetPrice) {
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
  },
};

// Utility Functions
RentrovioLanding.Utils = {
  // Debounce function for performance
  debounce: function (func, wait) {
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
  throttle: function (func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport: function (element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};

// Performance optimizations
const optimizedScroll = RentrovioLanding.Utils.throttle(() => {
  // Scroll optimizations can be added here
}, 100);

window.addEventListener("scroll", optimizedScroll);

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error);
  // Error reporting could be added here
});

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    RentrovioLanding.init();
    console.log("Rentrovio Landing Page initialized successfully");
  } catch (error) {
    console.error("Failed to initialize landing page:", error);
  }
});

// Initialize on window load as fallback
window.addEventListener("load", () => {
  // Additional load optimizations
  if (
    typeof RentrovioLanding !== "undefined" &&
    !RentrovioLanding.initialized
  ) {
    RentrovioLanding.init();
  }
});

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Page became visible - could refresh data or resume animations
  } else {
    // Page became hidden - could pause animations or save state
  }
});

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = RentrovioLanding;
}
