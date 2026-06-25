/* ==============================================
   The Ravens Analytics — Corporate JS
   ============================================== */

;(function () {
  'use strict';

  // ─── Particle Canvas ──────────────────────────────────────────────
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.4,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#0088ff' : '#00d4ff',
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      particles.forEach((p2, j) => {
        if (j <= i) return;
        const dx = p.x - p2.x, dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist / 110) * 0.12;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });

  // ─── Navbar Scroll ────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ─── Active Nav on Scroll ──────────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function setActiveNav() {
    const sy = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop, h = sec.offsetHeight;
      const id = '#' + sec.id;
      if (sy >= top && sy < top + h) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === id);
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });

  // ─── Hamburger ─────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ─── Scroll to Top ─────────────────────────────────────────────────
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ─── Counter Animation ─────────────────────────────────────────────
  function animateCounter(el, target, duration = 2200) {
    const start = performance.now();
    function update(ts) {
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = target >= 1000 ? val.toLocaleString() : val;
      if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ─── Intersection Observer Utility ────────────────────────────────
  function observe(selector, threshold = 0.12, staggerDelay = 80) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), idx * staggerDelay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold });

    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      obs.observe(el);
    });
  }

  observe('.value-card', 0.12, 80);
  observe('.service-card', 0.08, 70);
  observe('.tool-item', 0.1, 60);
  observe('.why-card', 0.12, 80);
  observe('.team-card', 0.1, 70);
  observe('.cinfo-item', 0.12, 60);

  // ─── Section Reveal ────────────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.section-header, .why-large, .cta-content, .about-left, .ceo-showcase, .team-section-title'
  );

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    revealObs.observe(el);
  });

  // ─── Hero Counters ──────────────────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num');
  let countersRan = false;

  const heroObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersRan) {
      countersRan = true;
      statNums.forEach(el => {
        setTimeout(() => animateCounter(el, parseInt(el.dataset.target)), 1100);
      });
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObs.observe(heroStats);

  // ─── CEO Highlights Counter ─────────────────────────────────────────
  const chNums = document.querySelectorAll('.ch-num');
  let ceoCounterRan = false;

  const ceoObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !ceoCounterRan) {
      ceoCounterRan = true;
      chNums.forEach(el => {
        const txt = el.textContent.trim();
        const num = parseInt(txt);
        if (!isNaN(num)) animateCounter(el, num, 1800);
        // restore suffix
        el.dataset.suffix = txt.replace(String(num), '');
      });
    }
  }, { threshold: 0.4 });

  const ceoHighlights = document.querySelector('.ceo-highlights');
  if (ceoHighlights) ceoObs.observe(ceoHighlights);

  // ─── Tool Progress Bars ─────────────────────────────────────────────
  const progBars = document.querySelectorAll('.tool-progress');
  const progObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 150);
        progObs.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  progBars.forEach(bar => progObs.observe(bar));

  // ─── Testimonials Slider ────────────────────────────────────────────
  const testiTrack = document.getElementById('testiTrack');
  const testiDots  = document.querySelectorAll('.dot');
  const testiPrev  = document.getElementById('testiPrev');
  const testiNext  = document.getElementById('testiNext');
  const testiCards = document.querySelectorAll('.testi-card');

  let curTesti = 0;
  let testiTimer;

  function cardPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function renderTesti() {
    const cpv = cardPerView();
    const max = Math.max(0, testiCards.length - cpv);
    if (curTesti > max) curTesti = max;
    const cw = testiCards[0].offsetWidth + 24;
    testiTrack.style.transform = `translateX(-${curTesti * cw}px)`;
    testiDots.forEach((d, i) => d.classList.toggle('active', i === curTesti));
  }

  function nextT() {
    const max = Math.max(0, testiCards.length - cardPerView());
    curTesti = curTesti >= max ? 0 : curTesti + 1;
    renderTesti();
  }

  function prevT() {
    const max = Math.max(0, testiCards.length - cardPerView());
    curTesti = curTesti <= 0 ? max : curTesti - 1;
    renderTesti();
  }

  function resetTimer() {
    clearInterval(testiTimer);
    testiTimer = setInterval(nextT, 4500);
  }

  testiNext.addEventListener('click', () => { nextT(); resetTimer(); });
  testiPrev.addEventListener('click', () => { prevT(); resetTimer(); });

  testiDots.forEach(d => {
    d.addEventListener('click', () => {
      curTesti = parseInt(d.dataset.idx);
      renderTesti();
      resetTimer();
    });
  });

  resetTimer();
  window.addEventListener('resize', renderTesti);

  // ─── Contact Form ───────────────────────────────────────────────────
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('#btn-send');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Sending…</span>';
      btn.style.opacity = '0.75';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<span>✓ Message Sent!</span>';
        btn.style.opacity = '1';
        formSuccess.style.display = 'block';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.disabled = false;
          formSuccess.style.display = 'none';
        }, 4500);
      }, 1600);
    });
  }

  // ─── Smooth Scroll ──────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 74, behavior: 'smooth' });
      }
    });
  });

  // ─── 3D Tilt On Cards ───────────────────────────────────────────────
  function applyTilt(selector, intensity = 4) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const tx = (dy / (r.height / 2)) * -intensity;
        const ty = (dx / (r.width / 2)) * intensity;
        card.style.transform = `perspective(800px) rotateX(${tx}deg) rotateY(${ty}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  applyTilt('.service-card', 3);
  applyTilt('.value-card', 4);
  applyTilt('.team-card', 4);
  applyTilt('.testi-card', 2);

  // ─── Animated cursor glow ────────────────────────────────────────────
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; width:320px; height:320px; border-radius:50%;
    background:radial-gradient(circle,rgba(0,136,255,0.06) 0%,transparent 70%);
    pointer-events:none; z-index:9998;
    transform:translate(-50%,-50%);
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animGlow() {
    gx += (mx - gx) * 0.07;
    gy += (my - gy) * 0.07;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animGlow);
  })();

  // ─── CEO Photo hover pulse ───────────────────────────────────────────
  const ceoPhoto = document.getElementById('ceoPhoto');
  if (ceoPhoto) {
    ceoPhoto.addEventListener('mouseenter', () => {
      ceoPhoto.style.filter = 'brightness(1.08) saturate(1.1)';
    });
    ceoPhoto.addEventListener('mouseleave', () => {
      ceoPhoto.style.filter = '';
    });
  }

  console.log('%c The Ravens Analytics ', 'background:#0088ff;color:#fff;font-size:14px;padding:6px 14px;border-radius:4px;');
  console.log('%c Corporate Website — Analytics & AI Consulting ', 'color:#00D4FF;font-size:11px;');

})();
