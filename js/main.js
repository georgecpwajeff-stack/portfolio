/**
 * Antonio Jeffrey — Core Interface Logic
 * Implements Custom Cursor, Interactive Magnetic Buttons, Real-time Clock,
 * Hover-Glow effects, Typographic Role Typing/Rotation, Navigation menus,
 * and Form validation pipelines.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initMagneticButtons();
  initRoleRotation();
  initSkillsGlow();
  initSystemClock();
  initMobileNav();
  initContactForm();
});

/* ==========================================================================
   1. Custom Cursor & Glow Trackers
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');
  
  if (!cursor || !cursorGlow) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let glowX = 0;
  let glowY = 0;

  // Track cursor position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor follow using lerp
  function animateCursor() {
    // 0.25 speed for primary cursor
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    
    // 0.08 speed for background glow (slower, organic lag)
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Hover target states
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .magnetic-btn, .nav-toggle');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      gsap.to(cursor, { scale: 1.2, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      gsap.to(cursor, { scale: 1, duration: 0.3 });
    });
  });
}

/* ==========================================================================
   2. Magnetic Button Effects
   ========================================================================== */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  
  if (window.innerWidth <= 991) return; // Disable on tablet/mobile

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      // Calculate distances relative to the center of the button
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull element toward cursor (magnetic factor of 0.35)
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Pull inner text elements slightly less for parallax depth
      const text = btn.querySelector('.btn-text');
      if (text) {
        gsap.to(text, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.3
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      // Return elements to neutral
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
      
      const text = btn.querySelector('.btn-text');
      if (text) {
        gsap.to(text, {
          x: 0,
          y: 0,
          duration: 0.5
        });
      }
    });
  });
}

/* ==========================================================================
   3. Typographic Rotating Roles
   ========================================================================== */
function initRoleRotation() {
  const roleText = document.getElementById('role-text');
  if (!roleText) return;

  const roles = [
    'AI Engineer',
    'Creative Technologist',
    'Software Developer',
    'Full Stack Developer',
    'Founder of Wandering Adventures',
    'Game Designer',
    'Motion Graphics Artist',
    'Video Editor',
    'Linux Enthusiast',
    'Embedded Systems Developer',
    'IoT Developer'
  ];

  let currentIndex = 0;
  
  function rotateRole() {
    const word = roles[currentIndex];
    
    // Character-by-character typing reveal
    roleText.innerHTML = '';
    const chars = word.split('');
    
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(10px) filter(blur(3px))';
      roleText.appendChild(span);
    });

    // Animate letters in
    gsap.to(roleText.children, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.4,
      stagger: 0.03,
      ease: 'power2.out',
      onComplete: () => {
        // Wait 2.5 seconds, then animate letters out
        gsap.delayedCall(2.5, () => {
          gsap.to(roleText.children, {
            opacity: 0,
            y: -10,
            filter: 'blur(3px)',
            duration: 0.3,
            stagger: 0.015,
            ease: 'power2.in',
            onComplete: () => {
              currentIndex = (currentIndex + 1) % roles.length;
              rotateRole();
            }
          });
        });
      }
    });
  }

  // Start rotation sequence
  rotateRole();
}

/* ==========================================================================
   4. Skills Grid Mouse-Interactive Lighting Glows
   ========================================================================== */
function initSkillsGlow() {
  const cards = document.querySelectorAll('.skill-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update variables on the specific element scope
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });
}

/* ==========================================================================
   5. System Clock (Antonio's Local timezone display)
   ========================================================================== */
function initSystemClock() {
  const clockDisplay = document.getElementById('clock-display');
  if (!clockDisplay) return;

  function updateClock() {
    const now = new Date();
    
    // Format timestamp in a neat technological UTC/local format
    const options = {
      timeZone: 'America/Los_Angeles', // PDT / PST timezone
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    try {
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      clockDisplay.textContent = `${timeStr} (PDT // UTC-7)`;
    } catch (e) {
      // Fallback
      clockDisplay.textContent = now.toUTCString().replace("GMT", "UTC");
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   6. Mobile Navigation Menu
   ========================================================================== */
function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
    navToggle.setAttribute('aria-expanded', !expanded);
    mainNav.classList.toggle('active');
    
    // Simple bar animation
    const bars = navToggle.querySelectorAll('.nav-toggle-bar');
    if (bars.length === 2) {
      if (!expanded) {
        bars[0].style.transform = 'translateY(3px) rotate(45deg)';
        bars[1].style.transform = 'translateY(-3.5px) rotate(-45deg)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.transform = 'none';
      }
    }
  });

  // Close menu when clicking link items
  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('active');
      const bars = navToggle.querySelectorAll('.nav-toggle-bar');
      if (bars.length === 2) {
        bars[0].style.transform = 'none';
        bars[1].style.transform = 'none';
      }
    });
  });
}

/* ==========================================================================
   7. Form Verification & Interactive Transmit
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input');

  // Input change focus states cleanup
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const group = input.parentElement;
      if (input.value.trim() !== '') {
        group.classList.remove('has-error');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    let hasErrors = false;

    // Validate Name
    const nameInput = document.getElementById('name');
    if (!nameInput.value.trim()) {
      nameInput.parentElement.classList.add('has-error');
      hasErrors = true;
    } else {
      nameInput.parentElement.classList.remove('has-error');
    }

    // Validate Email
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailInput.parentElement.classList.add('has-error');
      hasErrors = true;
    } else {
      emailInput.parentElement.classList.remove('has-error');
    }

    // Validate Message
    const messageInput = document.getElementById('message');
    if (!messageInput.value.trim()) {
      messageInput.parentElement.classList.add('has-error');
      hasErrors = true;
    } else {
      messageInput.parentElement.classList.remove('has-error');
    }

    if (hasErrors) {
      feedback.classList.add('error');
      feedback.textContent = 'TRANSMISSION FAILED. Please correct errors highlighted above.';
      return;
    }

    // Simulate submission loading
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'TRANSMITTING SIGNAL...';
    submitBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      submitBtn.querySelector('.btn-text').textContent = originalText;
      submitBtn.style.pointerEvents = 'all';
      
      feedback.classList.add('success');
      feedback.textContent = 'SIGNAL TRANSMITTED SUCCESSFULLY. Antonio Jeffrey will reply shortly.';
      
      form.reset();
    }, 1800);
  });
}
