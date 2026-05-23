document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
  }

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

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

      stageContents.forEach(content => {
        if (content.id === `stage-${targetStage}`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });

  const initialActiveTab = document.querySelector('.stage-tab.active');
  if (initialActiveTab) {
    setTimeout(() => updateSlidingPill(initialActiveTab), 100);
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
    card.addEventListener('click', () => {
      const targetLayer = card.dataset.layer;
      
      // Update cards
      layerCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      // Update images
      anatomyLayers.forEach(img => {
        if (img.classList.contains(`anatomy-${targetLayer}`)) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    });
  });

  // Diagnostics Flip Cards
  const diagCards = document.querySelectorAll('.diag-card');
  diagCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // Treatments Tabs - Sleek Segmented Slider Control
  const treatmentsWrapper = document.querySelector('.treatments-control-wrapper');
  const slidingPillTreatment = document.querySelector('.sliding-pill-bg-treatment');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  const updateSlidingPillTreatment = (activeTab) => {
    if (!slidingPillTreatment || !activeTab || !treatmentsWrapper) return;
    
    const leftOffset = activeTab.offsetLeft + activeTab.parentElement.offsetLeft;
    const tabWidth = activeTab.offsetWidth;
    
    slidingPillTreatment.style.width = `${tabWidth}px`;
    slidingPillTreatment.style.transform = `translateX(${leftOffset}px)`;
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      updateSlidingPillTreatment(btn);

      tabPanels.forEach(panel => {
        if (panel.id === target) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  const initialActiveTreatment = document.querySelector('.tab-btn.active');
  if (initialActiveTreatment) {
    setTimeout(() => updateSlidingPillTreatment(initialActiveTreatment), 100);
  }

  window.addEventListener('resize', () => {
    const currentActiveTreatment = document.querySelector('.tab-btn.active');
    if (currentActiveTreatment) {
      updateSlidingPillTreatment(currentActiveTreatment);
    }
  });

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
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
    };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
      });
    });

    // Auto-advance
    setInterval(nextSlide, 8000);
  }

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isOpen = item.classList.contains('open');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('open'));
      
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // Form Submission Simulator
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
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
        } else {
          const errorText = await response.text();
          throw new Error(`Submission failed: ${response.status} ${response.statusText}\n${errorText}`);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting the form. Please try again or contact us directly.');
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
  const placeholder = document.querySelector('.result-placeholder');
  const details = document.querySelector('.result-details');
  const severityBadge = document.querySelector('.severity-badge');
  const resultMessage = document.querySelector('.result-message');
  const scoreValue = document.querySelector('.score-value');
  const pathwayValue = document.querySelector('.pathway-value');

  const messages = {
    mild: "Based on your selection, you may be experiencing early signs of dry eye. Simple lifestyle adjustments, reducing screen time, and using preservative-free lubricating drops might offer relief.",
    moderate: "You exhibit moderate dry eye symptoms. It is recommended to seek a professional diagnostic scan (such as LipiView or TearLab) to pinpoint the exact dysfunctional layer of your tear film.",
    severe: "Your symptoms suggest advanced ocular surface discomfort. We highly recommend scheduling a comprehensive dry eye evaluation immediately to prevent long-term gland dysfunction or corneal damage."
  };

  const updateAssessment = () => {
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
      placeholder.classList.add('active');
      details.classList.remove('active');
      return;
    }

    placeholder.classList.remove('active');
    details.classList.add('active');

    // Update dynamic indicator score display
    if (scoreValue) {
      scoreValue.textContent = `${checkedCount} / ${checkboxes.length}`;
    }

    // Update severity levels based on count
    severityBadge.className = 'severity-badge'; // reset
    if (checkedCount <= 2) {
      severityBadge.textContent = 'Mild Irritation';
      severityBadge.classList.add('status-mild');
      resultMessage.textContent = messages.mild;
      if (pathwayValue) {
        pathwayValue.textContent = "Tear Break-Up Time (TBUT) & Volume Scan";
      }
    } else if (checkedCount <= 4) {
      severityBadge.textContent = 'Moderate Dry Eye';
      severityBadge.classList.add('status-moderate');
      resultMessage.textContent = messages.moderate;
      if (pathwayValue) {
        pathwayValue.textContent = "LipiView® Gland Scan & Meibography";
      }
    } else {
      severityBadge.textContent = 'Severe OSD';
      severityBadge.classList.add('status-severe');
      resultMessage.textContent = messages.severe;
      if (pathwayValue) {
        pathwayValue.textContent = "Full Diagnostic Suite (LipiView + Osmolarity + MMP-9)";
      }
    }
  };

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateAssessment);
  });

  // Handle booking CTA integration from assessment widget
  const widgetCta = document.querySelector('.widget-cta');
  if (widgetCta) {
    widgetCta.addEventListener('click', (e) => {
      e.preventDefault();
      
      const checkedSymptoms = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.closest('.checklist-item').querySelector('.checklist-label').textContent.trim());
      
      const concernSelect = document.getElementById('primary-concern');
      const messageTextArea = document.getElementById('message');
      const checkedCount = checkedSymptoms.length;
      
      // Set dropdown concern based on severity
      if (concernSelect) {
        if (checkedCount >= 5) {
          concernSelect.value = 'lipiflow'; // Suggest advanced therapy
        } else {
          concernSelect.value = 'evaluation'; // Standard consult
        }
      }
      
      // Pre-fill message
      if (messageTextArea && checkedSymptoms.length > 0) {
        messageTextArea.value = `Hello, I completed the self-assessment and scored ${checkedCount}/${checkboxes.length} with these symptoms: ${checkedSymptoms.join(', ')}. I'd like to schedule a diagnostic evaluation.`;
      }
      
      // Scroll smoothly to contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Focus on first name after scroll completes
        setTimeout(() => {
          const firstNameInput = document.getElementById('first-name');
          if (firstNameInput) firstNameInput.focus();
        }, 800);
      }
    });
  }
});
