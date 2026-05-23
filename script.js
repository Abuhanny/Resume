/* ===========================
   PORTFOLIO SCRIPT
=========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR ──────────────────────────────
  const cursor = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursor.className = 'cursor';
  cursorRing.className = 'cursor-ring';
  document.body.append(cursor, cursorRing);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  const animateCursor = () => {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '16px';
      cursor.style.height = '16px';
      cursorRing.style.width = '52px';
      cursorRing.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursorRing.style.width = '36px';
      cursorRing.style.height = '36px';
    });
  });


  // ── NAVBAR SCROLL ───────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });


  // ── MOBILE MENU ─────────────────────────────────
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  // ── SCROLL REVEAL ────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Stagger children in same parent
  const parents = new Map();
  reveals.forEach(el => {
    const parent = el.parentElement;
    if (!parents.has(parent)) parents.set(parent, []);
    parents.get(parent).push(el);
  });

  parents.forEach(children => {
    children.forEach((el, i) => {
      el.dataset.delay = i * 100;
      revealObserver.observe(el);
    });
  });


  // ── COUNTER ANIMATION ────────────────────────────
  const statNums = document.querySelectorAll('.stat__num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(num => counterObserver.observe(num));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }


  // ── ACTIVE NAV LINK ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  // ── CONTACT FORM ─────────────────────────────────
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(248, 113, 113, 0.6)';
        valid = false;
      }
    });

    if (!valid) return;

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending…';

    setTimeout(() => {
      form.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
      formSuccess.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Send Message';

      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1400);
  });


  // ── FOOTER YEAR ──────────────────────────────────
  document.getElementById('year').textContent = new Date().getFullYear();


  // ── SMOOTH NAV SCROLL ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ── SKILL CARD TILT ──────────────────────────────
  document.querySelectorAll('.skill-card, .project-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});