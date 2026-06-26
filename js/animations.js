(function () {

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================================================================
     1 — PARALLAX SUAVE EN FONDOS
  ================================================================ */
  function initParallax () {
    if (REDUCED) return;

    const bgs = document.querySelectorAll('.chapter.has-bg .chapter-bg');
    if (!bgs.length) return;

    let ticking = false;

    function update () {
      const sy = window.scrollY;
      bgs.forEach(el => {
        const rect = el.parentElement.getBoundingClientRect();
        const offset = rect.top + sy;
        const speed = 0.15;
        const y = (sy - offset) * speed;
        el.style.backgroundPositionY = `calc(50% + ${y}px)`;
      });
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => { update(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* ================================================================
     2 — REVELACIÓN TYPEWRITER EN TEXTOS
  ================================================================ */
  function initTypewriter () {
    if (REDUCED) return;

    const targets = document.querySelectorAll(
      '.book-page p, .letter-paper p:not(.letter-date):not(.letter-greeting):not(.letter-closing)'
    );
    if (!targets.length) return;

    const SPEED = 28;

    targets.forEach(el => {
      const original = el.textContent;
      if (!original || original.trim().length < 5) return;

      el.dataset.typewriter = original;
      el.textContent = '';
      el.style.visibility = 'visible';

      let revealed = false;

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !revealed) {
            revealed = true;
            observer.unobserve(el);
            typewrite(el, original, SPEED);
          }
        });
      }, { threshold: 0.2 });

      observer.observe(el);
    });
  }

  function typewrite (el, text, speed) {
    let idx = 0;
    const chars = [...text];

    function tick () {
      if (idx >= chars.length) {
        el.textContent = text;
        return;
      }
      el.textContent = chars.slice(0, idx + 1).join('');
      idx++;
      const delay = chars[idx - 1] === ' ' ? speed * 0.3 : speed;
      setTimeout(tick, delay);
    }

    tick();
  }

  /* ================================================================
     3 — TRANSICIÓN DE CAPÍTULOS (entrada con fade)
  ================================================================ */
  function initChapterTransitions () {
    if (REDUCED) return;

    const chapters = document.querySelectorAll(
      '.chapter:not(.has-bg), .chapter.has-bg'
    );

    chapters.forEach((ch, i) => {
      if (i === 0) return;

      ch.style.opacity = '0';
      ch.style.transform = 'translateY(20px)';
      ch.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

      let revealed = false;

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !revealed) {
            revealed = true;
            observer.unobserve(ch);
            ch.style.opacity = '1';
            ch.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.08 });

      observer.observe(ch);
    });
  }

  /* ================================================================
     4 — PARTÍCULAS DECORATIVAS FLOTANTES
  ================================================================ */
  let particlesCreated = false;

  function initParticles () {
    if (REDUCED || particlesCreated) return;
    particlesCreated = true;

    const EMOJIS = ['✦', '·', '✧', '♡', '·', '★'];
    const COUNT = 12;
    const container = document.createElement('div');
    container.id = 'decorativeParticles';
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('span');
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const size = Math.random() * 0.6 + 0.3;
      const left = Math.random() * 100;
      const dur = Math.random() * 18 + 16;
      const delay = Math.random() * 20;
      const drift = (Math.random() - 0.5) * 100;

      el.style.cssText = `
        position: absolute;
        left: ${left}%;
        bottom: -8%;
        font-size: ${size}rem;
        opacity: 0;
        color: var(--gold);
        animation: particleFloat ${dur}s ${delay}s ease-in-out infinite;
        --drift: ${drift}px;
      `;
      container.appendChild(el);
    }

    /* keyframe floatParticle ya está en animations.css */
  }

  /* ================================================================
     INIT
   ================================================================ */
  function init () {
    if (!document.querySelector('#experience.active')) {
      document.addEventListener('experienceReady', run);
      return;
    }
    run();
  }

  function run () {
    initParallax();
    initTypewriter();
    initChapterTransitions();
    initParticles();
  }

  window.Animations = { init };

})();
