/**
 * Antonio Jeffrey — GSAP, ScrollTrigger, and Lenis Animation Engine
 * Establishes smooth inertial scroll, defines loader counter states,
 * manages pinned horizontal project slides, dynamic text highlight,
 * and SVG timeline tracing.
 */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements & timelines in order
  const lenis = initLenisSmoothScroll();
  runLoaderSequence(lenis);
});

/* ==========================================================================
   1. Lenis Smooth Scrolling Engine
   ========================================================================== */
function initLenisSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium lag feel
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    mouseMultiplier: 1.0,
    touchMultiplier: 2.0,
    infinite: false,
  });

  // Synchronize ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Return instance for navigation scroll control
  return lenis;
}

/* ==========================================================================
   2. Cinematic Loader Sequence & Hero Entry
   ========================================================================== */
function runLoaderSequence(lenis) {
  const percentText = document.getElementById('loader-percentage');
  const bar = document.getElementById('loader-bar');
  const loader = document.getElementById('loader');
  
  if (!percentText || !bar || !loader) {
    // If elements missing, skip loader
    document.body.classList.remove('loading');
    return;
  }

  // Lock scrolling during loading
  lenis.stop();

  const loadProgress = { value: 0 };
  const loaderTimeline = gsap.timeline({
    onComplete: () => {
      // Unlock Lenis scroll
      lenis.start();
      // Initialize post-load scroll-driven animations
      initScrollAnimations();
    }
  });

  // Tick counter from 0 to 100
  loaderTimeline.to(loadProgress, {
    value: 100,
    duration: 2.5,
    ease: 'power2.out',
    onUpdate: () => {
      const percentage = Math.floor(loadProgress.value);
      percentText.textContent = percentage < 10 ? `0${percentage}` : percentage;
      bar.style.width = `${percentage}%`;
    }
  });

  // Fade out loader screen
  loaderTimeline.to(loader, {
    opacity: 0,
    y: '-10%',
    filter: 'blur(10px)',
    duration: 0.8,
    ease: 'power3.inOut'
  });

  // Hide loader block completely
  loaderTimeline.set(loader, { display: 'none' });

  // Hero section reveals
  loaderTimeline.from('.header', {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.4');

  loaderTimeline.from('.hero-label', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.6');

  // Split-reveal style for Hero Title
  loaderTimeline.from('.hero-title span', {
    y: 50,
    opacity: 0,
    filter: 'blur(5px)',
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  }, '-=0.5');

  loaderTimeline.from('.hero-subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4');

  loaderTimeline.from('.hero-indicator', {
    scaleX: 0,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.3');
}

/* ==========================================================================
   3. Scroll-Driven Animations Container
   ========================================================================== */
function initScrollAnimations() {
  // 1. Text reveal (word highlighting) in About
  initAboutTextReveal();

  // 2. Horizontal slide pinning for Featured Projects
  initHorizontalProjects();

  // 3. Creative works grid reveal
  initCreativeGridReveal();

  // 4. SVG Path drawing for Chronology Timeline
  initTimelinePathDrawing();

  // 5. Ambient glowing blobs parallax movement
  initAmbientBlobParallax();
  
  // 6. Generic card entries
  initCardEntries();
}

/* --- About Text Highlight Reveal --- */
function initAboutTextReveal() {
  const paragraph = document.querySelector('.reveal-words');
  if (!paragraph) return;

  // Split string into separate word spans
  const words = paragraph.textContent.trim().split(/\s+/);
  paragraph.innerHTML = '';
  
  words.forEach(word => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    span.style.opacity = '0.12';
    span.style.display = 'inline-block';
    paragraph.appendChild(span);
  });

  // Stagger opacity highlights on scroll
  gsap.to(paragraph.children, {
    opacity: 1,
    color: '#ffffff',
    duration: 0.5,
    stagger: 0.05,
    ease: 'power1.out',
    scrollTrigger: {
      trigger: '#narrative-trigger',
      start: 'top 75%',
      end: 'bottom 45%',
      scrub: true,
    }
  });
}

/* --- Horizontal Projects Pinning --- */
function initHorizontalProjects() {
  const slider = document.getElementById('projects-slider');
  const slides = gsap.utils.toArray('.project-slide');
  
  if (!slider || slides.length === 0) return;

  if (window.innerWidth > 991) {
    // Desktop layout horizontal pin scroll
    const totalScrollWidth = slider.scrollWidth - window.innerWidth;

    gsap.to(slider, {
      x: -totalScrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: '.projects-section',
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${totalScrollWidth}`,
        invalidateOnRefresh: true,
      }
    });

    // Image reveal effect inside slides
    slides.forEach((slide) => {
      const img = slide.querySelector('.project-image');
      const frame = slide.querySelector('.project-visual-frame');
      
      if (!img || !frame) return;

      // Subtle parallax magnification on the project image during horizontal travel
      gsap.fromTo(img, 
        { scale: 1.15, xPercent: -5 },
        {
          scale: 1,
          xPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: slide,
            containerAnimation: gsap.getById('projects-slider'), // Sync with horizontal movement
            start: 'left right',
            end: 'right left',
            scrub: true,
          }
        }
      );
    });
  } else {
    // Mobile layout: Standard vertical reveal sequence
    slides.forEach((slide) => {
      const img = slide.querySelector('.project-image');
      const info = slide.querySelector('.project-info');
      
      if (img) {
        gsap.from(img, {
          scale: 1.25,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: slide,
            start: 'top 80%',
          }
        });
      }
      
      if (info) {
        gsap.from(info.children, {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          scrollTrigger: {
            trigger: slide,
            start: 'top 75%',
          }
        });
      }
    });
  }
}

/* --- Creative Grid Reveal --- */
function initCreativeGridReveal() {
  const cards = gsap.utils.toArray('.reveal-card');
  if (cards.length === 0) return;

  gsap.from(cards, {
    y: 50,
    opacity: 0,
    filter: 'blur(10px)',
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.creative-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
}

/* --- SVG Timeline Line Tracing --- */
function initTimelinePathDrawing() {
  const activePath = document.querySelector('.timeline-path-active');
  const items = gsap.utils.toArray('.timeline-item');
  
  if (!activePath || items.length === 0) return;

  const pathLength = activePath.getTotalLength();
  
  // Initialize path to be drawn out completely (hidden)
  gsap.set(activePath, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength
  });

  // Track progress drawing
  gsap.to(activePath, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.timeline-container',
      start: 'top 40%',
      end: 'bottom 60%',
      scrub: 0.5,
    }
  });

  // Fade items and dots as they are reached
  items.forEach(item => {
    const dot = item.querySelector('.timeline-dot');
    const card = item.querySelector('.timeline-card');

    const timelineItemTl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 65%',
        toggleActions: 'play none none none'
      }
    });

    if (dot) {
      timelineItemTl.from(dot, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'back.out(1.7)'
      });
    }

    if (card) {
      timelineItemTl.from(card, {
        x: item.classList.contains('left-item') ? -50 : 50,
        opacity: 0,
        filter: 'blur(5px)',
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.25');
    }
  });
}

/* --- Ambient Glowing Blobs Parallax --- */
function initAmbientBlobParallax() {
  const pinkBlob = document.querySelector('.bg-glow-pink');
  const blueBlob = document.querySelector('.bg-glow-blue');

  if (pinkBlob) {
    gsap.to(pinkBlob, {
      yPercent: 40,
      xPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });
  }

  if (blueBlob) {
    gsap.to(blueBlob, {
      yPercent: -45,
      xPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });
  }
}

/* --- Generic Entry Animations (About & Services grids) --- */
function initCardEntries() {
  const aboutCards = gsap.utils.toArray('.about-card');
  if (aboutCards.length > 0) {
    gsap.from(aboutCards, {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-grid',
        start: 'top 85%'
      }
    });
  }

  const serviceCards = gsap.utils.toArray('.service-card');
  if (serviceCards.length > 0) {
    gsap.from(serviceCards, {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 85%'
      }
    });
  }
}
