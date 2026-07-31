document.addEventListener('DOMContentLoaded', () => {
  // Google Tag Manager & Google Analytics 4 Telemetry Helper
  const trackEvent = (eventName, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params
    });

    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    } else {
      console.debug('[GTM / GA4 Telemetry]', eventName, params);
    }
  };

  // --- DYNAMIC TEXT REPLACEMENT (DTR) SYSTEM ---
  const initDTR = () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Sanitization helper to prevent XSS
    const sanitizeInput = (str, maxLength = 100) => {
      if (!str) return '';
      // Strip any HTML tags
      let cleaned = str.replace(/<\/?[^>]+(>|$)/g, "");
      // Trim and limit length to prevent layout breakage
      cleaned = cleaned.trim();
      if (cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength);
      }
      return cleaned;
    };

    // Headline replacement
    const rawHeadline = urlParams.get('headline') || urlParams.get('utm_term') || urlParams.get('keyword');
    if (rawHeadline) {
      const sanitizedHeadline = sanitizeInput(rawHeadline, 120);
      const headlineEl = document.querySelector('[data-dtr="headline"]');
      if (headlineEl && sanitizedHeadline) {
        headlineEl.textContent = sanitizedHeadline;
        trackEvent('dtr_replacement', { parameter: 'headline', value: sanitizedHeadline });
      }
    }

    // Subheadline replacement
    const rawSubheadline = urlParams.get('subheadline') || urlParams.get('sub');
    if (rawSubheadline) {
      const sanitizedSubheadline = sanitizeInput(rawSubheadline, 200);
      const subheadlineEl = document.querySelector('[data-dtr="subheadline"]');
      if (subheadlineEl && sanitizedSubheadline) {
        subheadlineEl.textContent = sanitizedSubheadline;
        trackEvent('dtr_replacement', { parameter: 'subheadline', value: sanitizedSubheadline });
      }
    }

    // Location personalization & form pre-fill
    const rawLocation = urlParams.get('location') || urlParams.get('utm_loc') || urlParams.get('town');
    if (rawLocation) {
      const sanitizedLocation = sanitizeInput(rawLocation, 30).toLowerCase();
      const validLocations = ['livingston', 'denville', 'newark'];
      
      if (validLocations.includes(sanitizedLocation)) {
        // Pre-fill location select in form
        const locationSelect = document.getElementById('preferred-location');
        if (locationSelect) {
          locationSelect.value = sanitizedLocation;
          locationSelect.dispatchEvent(new Event('change'));
        }

        // Highlight matching location item in the contacts list
        const locationCards = document.querySelectorAll('.cta-location-item');
        locationCards.forEach(card => {
          const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
          if (title.includes(sanitizedLocation)) {
            card.classList.add('highlighted-location');
          } else {
            card.classList.remove('highlighted-location');
          }
        });

        trackEvent('dtr_replacement', { parameter: 'location', value: sanitizedLocation });
      }
    }
  };

  try {
    initDTR();
  } catch (err) {
    console.error('DTR error:', err);
  }

  // Provide clear, helpful, and localized form error messages (UX Clarity)
  const getCustomErrorMessage = (field) => {
    if (!field) return 'This field is required.';
    
    // Treat select element missing values as valueMissing
    const isSelect = field.tagName === 'SELECT';
    if (field.validity.valueMissing || (isSelect && !field.value)) {
      switch (field.id) {
        case 'preferred-location':
          return 'Please select a preferred office location near you to continue.';
        case 'primary-concern':
          return 'Please select your primary concern so our specialists can prepare for your visit.';
        case 'contact-method':
          return 'Please choose how you would prefer our clinic to contact you.';
        case 'first-name':
          return 'First name is required to personalize your consultation request.';
        case 'last-name':
          return 'Last name is required to register your secure record.';
        case 'email-address':
          return 'Please provide an email address where we can send your appointment details.';
        case 'phone-number':
          return 'A phone number is required so our clinical coordinators can reach you.';
        default:
          return 'This field is required.';
      }
    }

    if (field.validity.typeMismatch || field.validity.patternMismatch) {
      if (field.id === 'email-address') {
        return 'Email address format appears incorrect. Please include an "@" symbol and a valid domain (e.g., name@example.com).';
      }
      if (field.id === 'phone-number') {
        return 'Please enter a valid 10-digit phone number (e.g., (973) 555-0100).';
      }
    }

    return field.validationMessage || 'Please enter a valid value.';
  };

  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.textContent = isOpen ? '✕' : '☰';
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      trackEvent('mobile_menu_toggle', { state: isOpen ? 'open' : 'close' });
    });

    // Close mobile nav when a link is clicked
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        trackEvent('nav_click', {
          link_text: link.textContent.trim(),
          link_url: link.getAttribute('href')
        });
        navLinks.classList.remove('open');
        mobileToggle.textContent = '☰';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Trap keyboard focus inside the mobile menu when open
    document.addEventListener('keydown', (e) => {
      if (navLinks && navLinks.classList.contains('open')) {
        const focusableElements = [mobileToggle, ...Array.from(navLinks.querySelectorAll('a'))];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        } else if (e.key === 'Escape') {
          navLinks.classList.remove('open');
          mobileToggle.textContent = '☰';
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.focus();
          e.preventDefault();
        }
      }
    });
  }

  // Logo & CTA clicks
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('click', () => {
      trackEvent('nav_click', { link_text: 'Logo', link_url: navLogo.getAttribute('href') });
    });
  }

  const navCTAs = document.querySelectorAll('.nav-cta');
  navCTAs.forEach(cta => {
    cta.addEventListener('click', () => {
      trackEvent('nav_click', { link_text: 'Schedule Consultation (CTA)', link_url: cta.getAttribute('href') });
    });
  });

  // Hero Section Buttons
  const heroButtons = document.querySelectorAll('.hero-buttons a');
  heroButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isPrimary = btn.classList.contains('btn-primary');
      trackEvent('hero_cta_click', {
        cta_type: isPrimary ? 'explore_treatments' : 'book_appointment',
        link_text: btn.textContent.trim()
      });
    });
  });

  // Navbar Scroll Effect using IntersectionObserver (GPU-friendly, zero layout thrashing)
  const navbar = document.querySelector('.navbar');
  const scrollSentinel = document.createElement('div');
  scrollSentinel.style.position = 'absolute';
  scrollSentinel.style.top = '50px';
  scrollSentinel.style.left = '0';
  scrollSentinel.style.width = '1px';
  scrollSentinel.style.height = '1px';
  scrollSentinel.style.pointerEvents = 'none';
  scrollSentinel.style.visibility = 'hidden';
  document.body.prepend(scrollSentinel);

  const navbarObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry.isIntersecting) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { root: null, threshold: 0 });

  navbarObserver.observe(scrollSentinel);

  // Reveal Animations on Scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Life Stages Timeline - Sleek Segmented Slider Control
  const stagesWrapper = document.querySelector('.stages-control-wrapper');
  const slidingPill = document.querySelector('.sliding-pill-bg');
  const stageTabs = document.querySelectorAll('.stage-tab');
  const stageContents = document.querySelectorAll('.stage-content');

  const updateSlidingPill = (activeTab) => {
    if (!slidingPill || !activeTab || !stagesWrapper) return;
    
    const leftOffset = activeTab.offsetLeft + activeTab.parentElement.offsetLeft;
    const tabWidth = activeTab.offsetWidth;
    
    slidingPill.style.width = `${tabWidth}px`;
    slidingPill.style.transform = `translateX(${leftOffset}px)`;
  };

  stageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetStage = tab.dataset.stage;
      
      stageTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      updateSlidingPill(tab);
      trackEvent('life_stage_view', { stage_name: targetStage });

      stageContents.forEach(content => {
        if (content.id === `stage-${targetStage}`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });

    // Keyboard support for tablist navigation
    tab.addEventListener('keydown', (e) => {
      const tabArray = Array.from(stageTabs);
      const index = tabArray.indexOf(tab);
      let targetTab = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetTab = tabArray[(index + 1) % tabArray.length];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetTab = tabArray[(index - 1 + tabArray.length) % tabArray.length];
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetTab = tabArray[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        targetTab = tabArray[tabArray.length - 1];
      }

      if (targetTab) {
        targetTab.focus();
        targetTab.click();
      }
    });
  });

  const initialActiveTab = document.querySelector('.stage-tab.active');
  if (initialActiveTab) {
    requestAnimationFrame(() => updateSlidingPill(initialActiveTab));
  }

  window.addEventListener('resize', () => {
    const currentActiveTab = document.querySelector('.stage-tab.active');
    if (currentActiveTab) {
      updateSlidingPill(currentActiveTab);
    }
  });

  // Tear Film Anatomy
  const layerCards = document.querySelectorAll('.layer-card');
  const anatomyLayers = document.querySelectorAll('.anatomy-layer');

  layerCards.forEach(card => {
    const activateLayer = () => {
      const targetLayer = card.dataset.layer;
      
      // Update cards and accessibility states
      layerCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-selected', 'true');
      
      // Update images
      anatomyLayers.forEach(img => {
        if (img.classList.contains(`anatomy-${targetLayer}`)) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });

      // Update slider visibility based on active layer (Only show slider on Lipid layer)
      const sliderContainer = document.querySelector('.slider-comparison');
      const sliderInput = document.querySelector('.slider-range-control');
      if (sliderContainer && sliderInput) {
        sliderContainer.classList.add('slider-transitioning');
        
        if (targetLayer === 'lipid') {
          sliderContainer.classList.remove('slider-disabled');
          // Smoothly animate back to 50% split comparison
          let currentVal = parseFloat(sliderInput.value);
          const targetVal = 50;
          const steps = 15;
          const stepVal = (targetVal - currentVal) / steps;
          let stepCount = 0;
          
          const animateSlider = () => {
            if (stepCount < steps) {
              currentVal += stepVal;
              sliderInput.value = currentVal;
              sliderInput.dispatchEvent(new Event('input'));
              stepCount++;
              requestAnimationFrame(animateSlider);
            } else {
              sliderInput.value = targetVal;
              sliderInput.dispatchEvent(new Event('input'));
              sliderContainer.classList.remove('slider-transitioning');
            }
          };
          animateSlider();
        } else {
          sliderContainer.classList.add('slider-disabled');
          // Smoothly animate to 100% to fully hide comparison
          let currentVal = parseFloat(sliderInput.value);
          const targetVal = 100;
          const steps = 15;
          const stepVal = (targetVal - currentVal) / steps;
          let stepCount = 0;
          
          const animateSlider = () => {
            if (stepCount < steps) {
              currentVal += stepVal;
              sliderInput.value = currentVal;
              sliderInput.dispatchEvent(new Event('input'));
              stepCount++;
              requestAnimationFrame(animateSlider);
            } else {
              sliderInput.value = targetVal;
              sliderInput.dispatchEvent(new Event('input'));
              sliderContainer.classList.remove('slider-transitioning');
            }
          };
          animateSlider();
        }
      }

      trackEvent('anatomy_layer_view', { layer_name: targetLayer });
    };

    card.addEventListener('click', activateLayer);

    // Keyboard support for space, enter, and arrow keys (standard WAI-ARIA tablist pattern)
    card.addEventListener('keydown', (e) => {
      const cards = Array.from(layerCards);
      const index = cards.indexOf(card);
      let targetIndex = -1;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        activateLayer();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (index + 1) % cards.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (index - 1 + cards.length) % cards.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = cards.length - 1;
      }

      if (targetIndex !== -1) {
        const targetCard = cards[targetIndex];
        targetCard.focus();
        targetCard.click(); // Programmatic click activates the layer and syncs UI
      }
    });
  });

  // Diagnostics Flip Cards
  const diagCards = document.querySelectorAll('.diag-card');
  diagCards.forEach(card => {
    const toggleFlip = () => {
      const isFlipped = card.classList.toggle('flipped');
      card.setAttribute('aria-expanded', isFlipped ? 'true' : 'false');
      if (isFlipped) {
        const heading = card.querySelector('h3');
        const cardName = heading ? heading.textContent.trim() : 'Unknown';
        trackEvent('diagnostic_card_flip', { card_name: cardName });
      }
    };

    card.addEventListener('click', toggleFlip);

    // Keyboard support (Space and Enter)
    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleFlip();
      }
    });

    // Flip back when focus leaves the card
    card.addEventListener('focusout', (e) => {
      if (!card.contains(e.relatedTarget)) {
        if (card.classList.contains('flipped')) {
          card.classList.remove('flipped');
          card.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Treatments Selection custom tab buttons controller
  const medicationTabs = document.getElementById('medication-tabs');
  const medicationCards = document.querySelectorAll('.medications-display .treatment-card');
  const procedureTabs = document.getElementById('procedure-tabs');
  const procedureCards = document.querySelectorAll('.procedures-display .treatment-card');

  if (medicationTabs) {
    const tabButtons = medicationTabs.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        
        const selectedValue = btn.dataset.value;
        const targetId = `treatment-${selectedValue}`;
        trackEvent('treatment_tab_click', { treatment_type: 'medications', tab_name: selectedValue });

        medicationCards.forEach(card => {
          if (card.id === targetId) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });
      });

      // Keyboard support for medication tabs navigation
      btn.addEventListener('keydown', (e) => {
        const btnArray = Array.from(tabButtons);
        const index = btnArray.indexOf(btn);
        let targetBtn = null;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          targetBtn = btnArray[(index + 1) % btnArray.length];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          targetBtn = btnArray[(index - 1 + btnArray.length) % btnArray.length];
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetBtn = btnArray[0];
        } else if (e.key === 'End') {
          e.preventDefault();
          targetBtn = btnArray[btnArray.length - 1];
        }

        if (targetBtn) {
          targetBtn.focus();
          targetBtn.click();
        }
      });
    });
  }

  if (procedureTabs) {
    const tabButtons = procedureTabs.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const selectedValue = btn.dataset.value;
        const targetId = `treatment-${selectedValue}`;
        trackEvent('treatment_tab_click', { treatment_type: 'procedures', tab_name: selectedValue });

        procedureCards.forEach(card => {
          if (card.id === targetId) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });
      });

      // Keyboard support for procedure tabs navigation
      btn.addEventListener('keydown', (e) => {
        const btnArray = Array.from(tabButtons);
        const index = btnArray.indexOf(btn);
        let targetBtn = null;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          targetBtn = btnArray[(index + 1) % btnArray.length];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          targetBtn = btnArray[(index - 1 + btnArray.length) % btnArray.length];
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetBtn = btnArray[0];
        } else if (e.key === 'End') {
          e.preventDefault();
          targetBtn = btnArray[btnArray.length - 1];
        }

        if (targetBtn) {
          targetBtn.focus();
          targetBtn.click();
        }
      });
    });
  }

  // Testimonials Carousel
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  let currentSlide = 0;
  
  if (track && slides.length > 0) {
    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel();
      trackEvent('testimonial_nav', { action_type: 'next' });
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
      trackEvent('testimonial_nav', { action_type: 'prev' });
    };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
        trackEvent('testimonial_nav', { action_type: 'dot', slide_index: index });
      });
    });

    // Auto-advance with pause on interaction (WCAG 2.2.2)
    let autoAdvanceInterval = setInterval(nextSlide, 8000);

    const pauseCarousel = () => {
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
      }
    };

    const resumeCarousel = () => {
      if (!autoAdvanceInterval) {
        autoAdvanceInterval = setInterval(nextSlide, 8000);
      }
    };

    const carouselContainer = document.querySelector('.testimonial-carousel');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', pauseCarousel);
      carouselContainer.addEventListener('mouseleave', resumeCarousel);
      carouselContainer.addEventListener('focusin', pauseCarousel);
      carouselContainer.addEventListener('focusout', resumeCarousel);
    }
  }

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isOpen = item.classList.contains('open');
      
      // Close all other FAQs and reset aria-expanded
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('open');
        const btn = faq.querySelector('.faq-question');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
        }
      });
      
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        trackEvent('faq_expand', { question_text: question.textContent.trim() });
      }
    });
  });

  // Phone number sanitization to E.164 standard (+1...)
  const sanitizePhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    } else if (cleaned.length > 0) {
      return `+${cleaned}`;
    }
    return phone;
  };

  // Form Submission Simulator
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Perform final check of all fields across steps using our custom error system
      let formIsValid = true;
      let firstInvalid = null;

      // Step 1 check
      const preferredLocation = document.getElementById('preferred-location');
      const primaryConcern = document.getElementById('primary-concern');
      const contactMethod = document.getElementById('contact-method');

      if (preferredLocation && !preferredLocation.value) {
        showError(preferredLocation, getCustomErrorMessage(preferredLocation));
        formIsValid = false;
        if (!firstInvalid) firstInvalid = preferredLocation;
      }
      if (primaryConcern && !primaryConcern.value) {
        showError(primaryConcern, getCustomErrorMessage(primaryConcern));
        formIsValid = false;
        if (!firstInvalid) firstInvalid = primaryConcern;
      }
      if (contactMethod && !contactMethod.value) {
        showError(contactMethod, getCustomErrorMessage(contactMethod));
        formIsValid = false;
        if (!firstInvalid) firstInvalid = contactMethod;
      }

      // Step 2 check
      const step2FieldsToValidate = ['first-name', 'last-name', 'email-address', 'phone-number'];
      step2FieldsToValidate.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
          if (!field.checkValidity()) {
            showError(field, getCustomErrorMessage(field));
            formIsValid = false;
            if (!firstInvalid) firstInvalid = field;
          } else {
            clearError(field);
          }
        }
      });

      if (!formIsValid) {
        if (firstInvalid) {
          const firstInvalidStep = firstInvalid.closest('.form-step-panel')?.dataset.step;
          if (firstInvalidStep && parseInt(firstInvalidStep) !== currentFormStep) {
            currentFormStep = parseInt(firstInvalidStep);
            updateFormStepUI();
          }
          firstInvalid.focus();
        }
        return;
      }

      trackEvent('form_submit_attempt');
      
      const submitBtn = contactForm.querySelector('.btn-submit-consultation');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Request My Evaluation';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Request...';
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const formData = new FormData(contactForm);
        
        // Also sanitize phone format in formData payload before sending
        const phoneInput = document.getElementById('phone-number');
        if (phoneInput) {
          formData.set('phone-number', sanitizePhoneNumber(phoneInput.value));
        }

        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString(),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          contactForm.style.display = 'none';
          formSuccess.classList.add('show');
          
          // Google Ads Enhanced Conversions Integration
          if (typeof gtag === 'function') {
            const emailVal = document.getElementById('email-address')?.value || '';
            const phoneValRaw = document.getElementById('phone-number')?.value || '';
            const phoneVal = sanitizePhoneNumber(phoneValRaw);
            const firstNameVal = document.getElementById('first-name')?.value || '';
            const lastNameVal = document.getElementById('last-name')?.value || '';
            
            gtag('set', 'user_data', {
              'email': emailVal.trim().toLowerCase(),
              'phone_number': phoneVal,
              'address': {
                'first_name': firstNameVal.trim(),
                'last_name': lastNameVal.trim()
              }
            });

            // Google Ads Conversion Event
            gtag('event', 'conversion', {
              'send_to': 'AW-18197167741/lead_form_submit',
              'value': 1.0,
              'currency': 'USD'
            });
          }

          // GA4 Rich Form Submit Success Event & GA4 Standard Key Event
          const locationVal = document.getElementById('preferred-location')?.value || 'Not Specified';
          const concernVal = document.getElementById('primary-concern')?.value || 'Not Specified';
          const contactMethodVal = document.getElementById('contact-method')?.value || 'Not Specified';

          trackEvent('generate_lead', {
            'value': 1.0,
            'currency': 'USD',
            'lead_type': 'Consultation Booking',
            'preferred_location': locationVal,
            'primary_concern': concernVal,
            'preferred_contact_method': contactMethodVal
          });

          trackEvent('form_submit_success', {
            'event_category': 'Engagement',
            'event_label': 'Lead Consultation Form',
            'preferred_location': locationVal,
            'primary_concern': concernVal,
            'preferred_contact_method': contactMethodVal
          });
        } else {
          const errorText = await response.text();
          trackEvent('form_submit_error', { error_message: errorText });
          throw new Error(`Submission failed: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        trackEvent('form_submit_error', { error_message: error.message });
        console.error('Form submission error:', error);
        
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }

        const formError = document.querySelector('.form-error-message');
        if (formError) {
          const errorTextEl = formError.querySelector('.error-text');
          if (errorTextEl) {
            if (error.name === 'AbortError') {
              errorTextEl.textContent = 'The request timed out. Please check your network connection and try again, or call us at (973) 322-0100 to book.';
            } else if (!navigator.onLine) {
              errorTextEl.textContent = 'You appear to be offline. Please verify your internet connection and try again, or call us at (973) 322-0100.';
            } else {
              errorTextEl.textContent = `A temporary network issue occurred: ${error.message || 'Unknown error'}. Please call us at (973) 322-0100 to complete your request.`;
            }
          }
          formError.classList.add('show');
          const closeBtn = formError.querySelector('.error-close-btn');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => {
              formError.classList.remove('show');
            });
          }
        }
      }
    });
  }

  // Generate floating particles for hero
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer) {
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 30 + 10;
      const left = Math.random() * 100;
      const duration = Math.random() * 20 + 10;
      const delay = -Math.random() * duration;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      particlesContainer.appendChild(particle);
    }
  }

  // Dry Eye Self-Assessment Widget
  const checkboxes = document.querySelectorAll('.symptom-checkbox');
  const widgetDescription = document.getElementById('widget-description');
  const quizStepsContainer = document.getElementById('quiz-steps-container');
  const quizSlides = document.querySelectorAll('.quiz-step-slide');
  const quizProgressWrapper = document.getElementById('quiz-progress-wrapper');
  const quizCurrentStepSpan = document.getElementById('quiz-current-step');
  const quizStepNameSpan = document.getElementById('quiz-step-name');
  const quizProgressBarFill = document.getElementById('quiz-progress-bar-fill');
  const quizResultsContainer = document.getElementById('quiz-results-container');
  
  const stepTitles = [
    "Burning & Strain",
    "Grittiness",
    "Scratchy Sensation",
    "Watery Eyes",
    "Blurry Vision",
    "Eye Redness",
    "Mucus Discharge"
  ];
  
  let currentQuizStep = 0;

  const messages = {
    mild: "You're showing early signs of ocular surface discomfort. Even mild symptoms can signal the start of Meibomian Gland Dysfunction (MGD) — a baseline Tear Break-Up Time (TBUT) scan can catch gland issues before they progress.",
    moderate: "You exhibit moderate dry eye symptoms. We recommend a professional diagnostic scan (such as LipiView® or TearLab®) to pinpoint the exact dysfunctional layer of your tear film.",
    severe: "Your symptoms suggest advanced ocular surface disease (OSD). We highly recommend scheduling a comprehensive dry eye evaluation immediately to prevent long-term gland dysfunction or corneal damage."
  };

  const updateQuizUI = () => {
    quizSlides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentQuizStep);
    });

    if (quizCurrentStepSpan) {
      quizCurrentStepSpan.textContent = currentQuizStep + 1;
    }
    if (quizStepNameSpan) {
      quizStepNameSpan.textContent = stepTitles[currentQuizStep];
    }
    if (quizProgressBarFill) {
      const progressPercent = ((currentQuizStep + 1) / quizSlides.length) * 100;
      quizProgressBarFill.style.width = `${progressPercent}%`;
    }
  };

  const updateGlandVisualizer = (checkedCount) => {
    const glandHealthLabel = document.getElementById('gland-health-label');
    const glandGroups = [
      document.getElementById('gland-group-1'),
      document.getElementById('gland-group-2'),
      document.getElementById('gland-group-3'),
      document.getElementById('gland-group-4'),
      document.getElementById('gland-group-5')
    ];

    let healthPercent = "100%";
    if (checkedCount === 1) healthPercent = "95%";
    else if (checkedCount === 2) healthPercent = "85%";
    else if (checkedCount === 3) healthPercent = "70%";
    else if (checkedCount === 4) healthPercent = "55%";
    else if (checkedCount === 5) healthPercent = "35%";
    else if (checkedCount === 6) healthPercent = "20%";
    else if (checkedCount === 7) healthPercent = "10%";

    if (glandHealthLabel) {
      glandHealthLabel.textContent = `${healthPercent} Function`;
      if (checkedCount <= 2) {
        glandHealthLabel.style.color = '#A7D8B1';
      } else if (checkedCount <= 4) {
        glandHealthLabel.style.color = '#F3C68F';
      } else {
        glandHealthLabel.style.color = '#F3A3A1';
      }
    }

    glandGroups.forEach((gland, index) => {
      if (!gland) return;
      gland.className = 'gland-svg-group'; // Reset classes
      
      if (checkedCount <= 2) {
        gland.classList.add('gland-state-healthy');
      } else if (checkedCount <= 4) {
        if (index === 1 || index === 3) {
          gland.classList.add('gland-state-blocked');
        } else {
          gland.classList.add('gland-state-healthy');
        }
      } else {
        if (index === 0 || index === 2) {
          gland.classList.add('gland-state-blocked');
        } else {
          gland.classList.add('gland-state-atrophied');
        }
      }
    });
  };

  const calculateQuizScore = () => {
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    // Update score value display
    const resultScoreValue = document.getElementById('result-score-value');
    if (resultScoreValue) {
      resultScoreValue.textContent = `${checkedCount} / ${checkboxes.length}`;
    }

    // Update progress bar
    const progressPercent = (checkedCount / checkboxes.length) * 100;
    const progressBar = document.getElementById('severity-progress');
    const markerMild = document.getElementById('marker-mild');
    const markerModerate = document.getElementById('marker-moderate');
    const markerSevere = document.getElementById('marker-severe');
    
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
      progressBar.className = 'severity-progress-bar'; // reset class
    }
    
    if (markerMild) markerMild.classList.remove('active');
    if (markerModerate) markerModerate.classList.remove('active');
    if (markerSevere) markerSevere.classList.remove('active');

    // Update severity levels based on count
    const severityBadge = document.getElementById('result-severity-badge');
    const resultMessageText = document.getElementById('result-message-text');
    const resultPathwayValue = document.getElementById('result-pathway-value');

    if (severityBadge) {
      severityBadge.className = 'severity-badge'; // reset
    }

    if (checkedCount <= 2) {
      if (severityBadge) {
        severityBadge.textContent = 'Mild Irritation';
        severityBadge.classList.add('status-mild');
      }
      if (progressBar) progressBar.classList.add('status-mild');
      if (markerMild) markerMild.classList.add('active');
      if (resultMessageText) resultMessageText.textContent = messages.mild;
      if (resultPathwayValue) {
        resultPathwayValue.textContent = "Tear Break-Up Time (TBUT) & Volume Scan";
      }
    } else if (checkedCount <= 4) {
      if (severityBadge) {
        severityBadge.textContent = 'Moderate Dry Eye';
        severityBadge.classList.add('status-moderate');
      }
      if (progressBar) progressBar.classList.add('status-moderate');
      if (markerModerate) markerModerate.classList.add('active');
      if (resultMessageText) resultMessageText.textContent = messages.moderate;
      if (resultPathwayValue) {
        resultPathwayValue.textContent = "LipiView® Gland Scan & Meibography";
      }
    } else {
      if (severityBadge) {
        severityBadge.textContent = 'Severe Dry Eye';
        severityBadge.classList.add('status-severe');
      }
      if (progressBar) progressBar.classList.add('status-severe');
      if (markerSevere) markerSevere.classList.add('active');
      if (resultMessageText) resultMessageText.textContent = messages.severe;
      if (resultPathwayValue) {
        resultPathwayValue.textContent = "Full Diagnostic Suite (LipiView + Osmolarity + MMP-9)";
      }
    }

    // Update gland health visuals
    updateGlandVisualizer(checkedCount);
  };

  const triggerGoldCelebration = () => {
    const parent = document.getElementById('quiz-results-container');
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const count = 35;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'gold-sparkle-particle';
      if (Math.random() > 0.5) {
        particle.style.borderRadius = '2px'; // diamond particles
      }
      const size = Math.random() * 6 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * rect.width}px`;
      particle.style.top = `${Math.random() * 20}px`;
      particle.style.animationDelay = `${Math.random() * 0.3}s`;
      particle.style.animationDuration = `${Math.random() * 1.2 + 1.2}s`;
      
      parent.appendChild(particle);
      setTimeout(() => particle.remove(), 3000);
    }
  };

  const showQuizResults = () => {
    if (quizStepsContainer) quizStepsContainer.style.display = 'none';
    if (quizProgressWrapper) quizProgressWrapper.style.display = 'none';
    if (widgetDescription) widgetDescription.textContent = 'Your self-assessment results are ready.';
    if (quizResultsContainer) {
      quizResultsContainer.style.display = 'flex';
      triggerGoldCelebration();
    }

    calculateQuizScore();

    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    let severity = 'mild';
    let pathway = 'Tear Break-Up Time (TBUT) & Volume Scan';
    if (checkedCount > 2 && checkedCount <= 4) {
      severity = 'moderate';
      pathway = 'LipiView® Gland Scan & Meibography';
    } else if (checkedCount > 4) {
      severity = 'severe';
      pathway = 'Full Diagnostic Suite (LipiView + Osmolarity + MMP-9)';
    }

    trackEvent('quiz_complete', {
      score: checkedCount,
      severity: severity,
      pathway: pathway
    });

    // Explicit Google Ads conversion event for high-intent quiz completion
    if (typeof gtag === 'function') {
      gtag('event', 'conversion');
    }
  };

  const saveQuizState = () => {
    const symptomStates = {};
    checkboxes.forEach(cb => {
      symptomStates[cb.id] = cb.checked;
    });
    const state = {
      currentQuizStep,
      quizStarted,
      quizCompleted: quizResultsContainer ? quizResultsContainer.style.display === 'flex' : false,
      symptomStates
    };
    localStorage.setItem('dryeye_quiz_state', JSON.stringify(state));
  };

  const loadQuizState = () => {
    try {
      // Always start fresh on load unless user actively restarted or is mid-session
      localStorage.removeItem('dryeye_quiz_state');
      currentQuizStep = 0;
      quizStarted = false;
      checkboxes.forEach(cb => cb.checked = false);
      if (quizResultsContainer) quizResultsContainer.style.display = 'none';
      if (quizStepsContainer) quizStepsContainer.style.display = 'flex';
      if (quizProgressWrapper) quizProgressWrapper.style.display = 'block';
      updateQuizUI();
    } catch (e) {
      console.error('Error initializing quiz state:', e);
    }
  };

  let quizStarted = false;

  const handleQuizChoice = (isYes) => {
    if (!quizStarted) {
      quizStarted = true;
      trackEvent('quiz_start');
    }
    const activeSlide = quizSlides[currentQuizStep];
    if (!activeSlide) return;

    const symptomName = activeSlide.dataset.symptom;
    const checkbox = document.getElementById(`check-${symptomName}`);
    if (checkbox) {
      checkbox.checked = isYes;
    }

    trackEvent('quiz_question_answer', {
      step_number: currentQuizStep + 1,
      question_title: stepTitles[currentQuizStep] || symptomName,
      choice: isYes ? 'yes' : 'no'
    });

    if (currentQuizStep < quizSlides.length - 1) {
      currentQuizStep++;
      updateQuizUI();
      saveQuizState();
    } else {
      showQuizResults();
      saveQuizState();
    }
  };

  // Wire up quiz event listeners
  const yesBtns = document.querySelectorAll('.btn-quiz-yes');
  const noBtns = document.querySelectorAll('.btn-quiz-no');
  yesBtns.forEach(btn => btn.addEventListener('click', () => handleQuizChoice(true)));
  noBtns.forEach(btn => btn.addEventListener('click', () => handleQuizChoice(false)));

  const backBtns = document.querySelectorAll('.btn-quiz-back');
  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentQuizStep > 0) {
        currentQuizStep--;
        updateQuizUI();
        saveQuizState();
      }
    });
  });

  const btnQuizRestart = document.getElementById('btn-quiz-restart');
  if (btnQuizRestart) {
    btnQuizRestart.addEventListener('click', () => {
      quizStarted = false;
      trackEvent('quiz_restart');
      checkboxes.forEach(cb => cb.checked = false);
      currentQuizStep = 0;
      updateQuizUI();
      if (quizResultsContainer) quizResultsContainer.style.display = 'none';
      if (quizStepsContainer) quizStepsContainer.style.display = 'flex';
      if (quizProgressWrapper) quizProgressWrapper.style.display = 'block';
      if (widgetDescription) {
        widgetDescription.textContent = 'Answer 7 quick questions to estimate your gland health and find your pathway.';
      }
      localStorage.removeItem('dryeye_quiz_state');
    });
  }

  // Initialize Quiz UI & restore progress if available
  if (quizSlides.length > 0) {
    updateQuizUI();
    loadQuizState();
  }

  // --- TWO-STEP BOOKING FORM CONTROLLER ---
  let currentFormStep = 1;

  const stepPanel1 = document.getElementById('step-panel-1');
  const stepPanel2 = document.getElementById('step-panel-2');
  const formBadge1 = document.getElementById('form-badge-1');
  const formBadge2 = document.getElementById('form-badge-2');
  const formIndicatorLine = document.getElementById('form-indicator-line');

  const updateFormStepUI = () => {
    if (currentFormStep === 1) {
      if (stepPanel1) stepPanel1.classList.add('active');
      if (stepPanel2) stepPanel2.classList.remove('active');
      if (formBadge1) {
        formBadge1.classList.add('active');
        formBadge1.classList.remove('completed');
      }
      if (formBadge2) {
        formBadge2.classList.remove('active');
        formBadge2.classList.remove('completed');
      }
      if (formIndicatorLine) {
        formIndicatorLine.style.width = '0%';
      }
    } else {
      if (stepPanel1) stepPanel1.classList.remove('active');
      if (stepPanel2) stepPanel2.classList.add('active');
      if (formBadge1) {
        formBadge1.classList.remove('active');
        formBadge1.classList.add('completed');
      }
      if (formBadge2) {
        formBadge2.classList.add('active');
        formBadge2.classList.remove('completed');
      }
      if (formIndicatorLine) {
        formIndicatorLine.style.width = '100%';
      }
    }
  };

  const showError = (field, message) => {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.add('has-error');
    
    // Check if error message element already exists
    let errorSpan = formGroup.querySelector('.input-error-message');
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'input-error-message';
      errorSpan.id = `${field.id}-error`;
      formGroup.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
    
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorSpan.id);
  };

  const clearError = (field) => {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.remove('has-error');
    const errorSpan = formGroup.querySelector('.input-error-message');
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.style.display = 'none';
    }
    
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  };

  // Real-time clearance of validation errors
  const step1Fields = ['preferred-location', 'primary-concern', 'contact-method'];
  step1Fields.forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('change', () => {
        if (field.value) {
          clearError(field);
        } else {
          showError(field, getCustomErrorMessage(field));
        }
      });
    }
  });

  const step2Fields = ['first-name', 'last-name', 'email-address', 'phone-number'];
  step2Fields.forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      const handleInput = () => {
        if (field.checkValidity()) {
          clearError(field);
        } else {
          showError(field, getCustomErrorMessage(field));
        }
      };
      field.addEventListener('input', handleInput);
      field.addEventListener('change', handleInput);
    }
  });

  const validateStep1 = () => {
    const preferredLocation = document.getElementById('preferred-location');
    const primaryConcern = document.getElementById('primary-concern');
    const contactMethod = document.getElementById('contact-method');

    if (preferredLocation && !preferredLocation.value) return false;
    if (primaryConcern && !primaryConcern.value) return false;
    if (contactMethod && !contactMethod.value) return false;

    return true;
  };

  const reportStep1Validity = () => {
    const preferredLocation = document.getElementById('preferred-location');
    const primaryConcern = document.getElementById('primary-concern');
    const contactMethod = document.getElementById('contact-method');

    let firstInvalid = null;

    if (preferredLocation && !preferredLocation.value) {
      showError(preferredLocation, getCustomErrorMessage(preferredLocation));
      if (!firstInvalid) firstInvalid = preferredLocation;
    }
    if (primaryConcern && !primaryConcern.value) {
      showError(primaryConcern, getCustomErrorMessage(primaryConcern));
      if (!firstInvalid) firstInvalid = primaryConcern;
    }
    if (contactMethod && !contactMethod.value) {
      showError(contactMethod, getCustomErrorMessage(contactMethod));
      if (!firstInvalid) firstInvalid = contactMethod;
    }

    if (firstInvalid) {
      firstInvalid.focus();
    }
  };

  const btnNextStep = document.getElementById('btn-next-step');
  if (btnNextStep) {
    btnNextStep.addEventListener('click', () => {
      if (validateStep1()) {
        currentFormStep = 2;
        updateFormStepUI();
        trackEvent('form_step_1_complete');
      } else {
        reportStep1Validity();
      }
    });
  }

  const btnPrevStep = document.getElementById('btn-prev-step');
  if (btnPrevStep) {
    btnPrevStep.addEventListener('click', () => {
      currentFormStep = 1;
      updateFormStepUI();
      trackEvent('form_step_2_back');
    });
  }

  if (formBadge1) {
    formBadge1.addEventListener('click', () => {
      currentFormStep = 1;
      updateFormStepUI();
    });
  }

  if (formBadge2) {
    formBadge2.addEventListener('click', () => {
      if (validateStep1()) {
        currentFormStep = 2;
        updateFormStepUI();
      } else {
        reportStep1Validity();
      }
    });
  }

  // Form Event Tracking
  const form = document.getElementById('contact-form');
  if (form) {
    let formStarted = false;
    form.addEventListener('focusin', () => {
      if (!formStarted) {
        formStarted = true;
        trackEvent('form_start');
      }
    }, { once: true });
  }

  // Handle booking CTA integration from assessment widget
  const widgetCta = document.querySelector('.widget-cta');
  if (widgetCta) {
    widgetCta.addEventListener('click', (e) => {
      e.preventDefault();
      
      const checkedSymptoms = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => {
          const val = cb.value;
          const map = {
            burning: "Burning & Screen Fatigue",
            grittiness: "Grittiness (Sandpaper Eyes)",
            "foreign-body": "Foreign Body Sensation",
            tearing: "Watery Eyes / Reflex Tearing",
            blur: "Blurry Vision & Glare",
            redness: "Redness & Social Discomfort",
            mucus: "Stringy Mucus Discharge"
          };
          return map[val] || val;
        });
      
      const concernSelect = document.getElementById('primary-concern');
      const messageTextArea = document.getElementById('message');
      const checkedCount = checkedSymptoms.length;
      
      trackEvent('form_widget_cta_click', {
        checked_count: checkedCount,
        suggested_pathway: concernSelect ? concernSelect.value : ''
      });

      if (concernSelect) {
        if (checkedCount >= 5) {
          concernSelect.value = 'procedures';
        } else {
          concernSelect.value = 'evaluation';
        }
      }

      // Pre-fill Step 1 selections to minimize booking friction
      const preferredLocation = document.getElementById('preferred-location');
      if (preferredLocation && !preferredLocation.value) {
        preferredLocation.value = 'livingston';
      }

      const contactMethod = document.getElementById('contact-method');
      if (contactMethod && !contactMethod.value) {
        contactMethod.value = 'email';
      }
      
      if (messageTextArea && checkedSymptoms.length > 0) {
        messageTextArea.value = `Hello, I completed the self-assessment and scored ${checkedCount}/${checkboxes.length} with these symptoms: ${checkedSymptoms.join(', ')}. I'd like to schedule a diagnostic evaluation.`;
      }
      
      const assessmentBanner = document.getElementById('form-assessment-banner');
      if (assessmentBanner) {
        assessmentBanner.style.display = 'flex';
      }
      
      // Since Step 1 is now fully selected, programmatically skip to Step 2
      currentFormStep = 2;
      updateFormStepUI();

      const bookingCard = document.getElementById('booking-card');
      if (bookingCard) {
        bookingCard.classList.remove('pulse-highlight');
        void bookingCard.offsetWidth;
        bookingCard.classList.add('pulse-highlight');
        setTimeout(() => {
          bookingCard.classList.remove('pulse-highlight');
        }, 3000);
      }
      
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
          const firstNameInput = document.getElementById('first-name');
          if (firstNameInput) firstNameInput.focus();
        }, 800);
      }
    });
  }



  // --- INTERACTIVE COMPARISON SLIDER & ANATOMY LAYERS CONNECT ---
  const sliderContainer = document.querySelector('.slider-comparison');
  const sliderInput = document.querySelector('.slider-range-control');
  
  if (sliderContainer && sliderInput) {
    const updateSliderPosition = () => {
      const value = sliderInput.value;
      sliderContainer.style.setProperty('--slide-pos', `${value}%`);
    };
    
    sliderInput.addEventListener('input', updateSliderPosition);
    updateSliderPosition();

  }

  // Google Ads Call-to-Conversion & GA4 Contact Tracking
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      const phoneNo = link.getAttribute('href').replace('tel:', '');
      // Infer section context for advanced localized analysis
      const sectionId = link.closest('section')?.getAttribute('id') || link.closest('header')?.getAttribute('id') || 'unknown';
      const labelText = link.textContent.trim() || 'Phone Link';

      trackEvent('contact', {
        'method': 'phone',
        'phone_number': phoneNo,
        'click_section': sectionId,
        'click_text': labelText
      });

      trackEvent('phone_link_click', {
        'phone_number': phoneNo,
        'click_section': sectionId,
        'click_text': labelText
      });

      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-18197167741/phone_call_click',
          'value': 1.0,
          'currency': 'USD',
          'transport': 'beacon'
        });
      }
    });
  });

  // Outbound Google Maps Direction Tracking (GA4 Location Engagement)
  document.querySelectorAll('a[href*="maps.google.com"]').forEach(link => {
    link.addEventListener('click', () => {
      const locationName = link.closest('.cta-location-item')?.querySelector('h4')?.textContent.trim() || 'Map Link';
      trackEvent('select_content', {
        'content_type': 'map_directions',
        'item_id': locationName,
        'destination_url': link.getAttribute('href')
      });
    });
  });

  // GA4 Automated Scroll Depth Tracking (25%, 50%, 75%, 90%)
  const trackedScrollDepths = new Set();
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const scrollPercent = Math.round((window.scrollY / totalHeight) * 100);
    [25, 50, 75, 90].forEach(threshold => {
      if (scrollPercent >= threshold && !trackedScrollDepths.has(threshold)) {
        trackedScrollDepths.add(threshold);
        trackEvent('scroll', { 'percent_scrolled': threshold });
      }
    });
  }, { passive: true });

  // --- INTERACTIVE COST CALCULATOR ---
  const spendSlider = document.getElementById('calc-monthly-spend');
  const minutesSlider = document.getElementById('calc-daily-minutes');
  
  if (spendSlider && minutesSlider) {
    const spendVal = document.getElementById('spend-val-display');
    const minutesVal = document.getElementById('minutes-val-display');
    const annualTotal = document.getElementById('calc-annual-total');
    const fiveYearTotal = document.getElementById('calc-5year-total');
    const lostHours = document.getElementById('calc-lost-hours');
    
    let rafPending = false;

    const updateCalculator = () => {
      if (rafPending) return;
      rafPending = true;

      requestAnimationFrame(() => {
        const spend = parseInt(spendSlider.value, 10);
        const minutes = parseInt(minutesSlider.value, 10);
        
        // Calculations:
        // Direct Annual Cost = spend * 12
        // Lost productivity cost = minutes * 250 work days * $0.50 per min
        const annualDirect = spend * 12;
        const annualProductivity = minutes * 250 * 0.50;
        const totalAnnual = annualDirect + annualProductivity;
        const total5Year = totalAnnual * 5;
        const totalHours = Math.round((minutes * 250 * 5) / 60);
        
        // Update Displays
        if (spendVal) spendVal.textContent = `$${spend}`;
        if (minutesVal) minutesVal.textContent = `${minutes} mins`;
        if (annualTotal) annualTotal.textContent = `$${Math.round(totalAnnual).toLocaleString()}`;
        if (fiveYearTotal) fiveYearTotal.textContent = `$${Math.round(total5Year).toLocaleString()}`;
        if (lostHours) lostHours.textContent = `${totalHours} hours`;
        
        rafPending = false;

        // Debounced Telemetry Event
        if (typeof telemetryTimeout !== 'undefined' && telemetryTimeout) clearTimeout(telemetryTimeout);
        window.calculatorTelemetryTimeout = window.calculatorTelemetryTimeout || null;
        if (window.calculatorTelemetryTimeout) clearTimeout(window.calculatorTelemetryTimeout);
        window.calculatorTelemetryTimeout = setTimeout(() => {
          trackEvent('calculator_adjust', {
            monthly_spend: spend,
            daily_lost_minutes: minutes,
            annual_cost: Math.round(totalAnnual),
            five_year_cost: Math.round(total5Year)
          });
        }, 1000);
      });
    };
    
    spendSlider.addEventListener('input', updateCalculator);
    minutesSlider.addEventListener('input', updateCalculator);
    updateCalculator();
  }

});
