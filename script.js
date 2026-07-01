document.addEventListener('DOMContentLoaded', () => {
  // Google Analytics Event Tracking Helper
  const trackEvent = (eventName, params = {}) => {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    } else {
      console.debug('[GA4 Telemetry]', eventName, params);
    }
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
      });
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

    // Keyboard support for space and enter
    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        activateLayer();
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

  // Form Submission Simulator
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      trackEvent('form_submit_attempt');
      
      try {
        const formData = new FormData(contactForm);
        
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString(),
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          formSuccess.classList.add('show');
          
          // Google Ads Enhanced Conversions Integration
          if (typeof gtag === 'function') {
            const emailVal = document.getElementById('email-address')?.value || '';
            const phoneVal = document.getElementById('phone-number')?.value || '';
            const firstNameVal = document.getElementById('first-name')?.value || '';
            const lastNameVal = document.getElementById('last-name')?.value || '';
            
            gtag('set', 'user_data', {
              'email': emailVal.trim().toLowerCase(),
              'phone_number': phoneVal.trim(),
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

          trackEvent('form_submit_success');
        } else {
          const errorText = await response.text();
          trackEvent('form_submit_error', { error_message: errorText });
          throw new Error(`Submission failed: ${response.status} ${response.statusText}\n${errorText}`);
        }
      } catch (error) {
        trackEvent('form_submit_error', { error_message: error.message });
        console.error('Form submission error:', error);
        const formError = document.querySelector('.form-error-message');
        if (formError) {
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
    mild: "Based on your selection, you may be experiencing early signs of dry eye. Simple lifestyle adjustments, reducing screen time, and using preservative-free lubricating drops might offer relief.",
    moderate: "You exhibit moderate dry eye symptoms. It is recommended to seek a professional diagnostic scan (such as LipiView or TearLab) to pinpoint the exact dysfunctional layer of your tear film.",
    severe: "Your symptoms suggest advanced ocular surface discomfort. We highly recommend scheduling a comprehensive dry eye evaluation immediately to prevent long-term gland dysfunction or corneal damage."
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

  const showQuizResults = () => {
    if (quizStepsContainer) quizStepsContainer.style.display = 'none';
    if (quizProgressWrapper) quizProgressWrapper.style.display = 'none';
    if (widgetDescription) widgetDescription.textContent = 'Your self-assessment results are ready.';
    if (quizResultsContainer) quizResultsContainer.style.display = 'flex';

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
    } else {
      showQuizResults();
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
    });
  }

  // Initialize Quiz UI
  if (quizSlides.length > 0) {
    updateQuizUI();
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
      
      if (messageTextArea && checkedSymptoms.length > 0) {
        messageTextArea.value = `Hello, I completed the self-assessment and scored ${checkedCount}/${checkboxes.length} with these symptoms: ${checkedSymptoms.join(', ')}. I'd like to schedule a diagnostic evaluation.`;
      }
      
      const assessmentBanner = document.getElementById('form-assessment-banner');
      if (assessmentBanner) {
        assessmentBanner.style.display = 'flex';
      }
      
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

  // Google Ads Call-to-Conversion Tracking
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      const phoneNo = link.getAttribute('href').replace('tel:', '');
      trackEvent('phone_link_click', { phone_number: phoneNo });
      
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-18197167741/phone_call_click',
          'value': 1.0,
          'currency': 'USD'
        });
      }
    });
  });

});
