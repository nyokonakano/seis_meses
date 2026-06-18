(function () {

  const introScreen    = document.getElementById('introScreen');
  const passwordScreen = document.getElementById('passwordScreen');
  const experience     = document.getElementById('experience');
  const openLetterBtn  = document.getElementById('openLetterBtn');
  const musicToggle    = document.getElementById('musicToggle');
  const music          = document.getElementById('backgroundMusic');
  const menuScreen     = document.getElementById('menuScreen');
  const chapterScreen  = document.getElementById('chapterScreen');
  const headerMenuBtn  = document.getElementById('headerMenuBtn');

  let currentChapter = -1;

  /* ================================================================
     PARTÍCULAS DEL INTRO
  ================================================================ */
  const INTRO_EMOJIS = ['❤️', '✨', '·', '✦', '♡', '🌸', '💫', '✧'];

  function spawnIntroParticles () {
    const container = document.getElementById('introParticles');
    if (!container) return;
    for (let i = 0; i < 24; i++) {
      const el    = document.createElement('span');
      const emoji = INTRO_EMOJIS[Math.floor(Math.random() * INTRO_EMOJIS.length)];
      el.className  = 'particle';
      el.textContent = emoji;
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        font-size: ${Math.random() * 1.2 + 0.6}rem;
        animation-duration: ${Math.random() * 8 + 7}s;
        animation-delay: ${Math.random() * 6}s;
        --drift: ${(Math.random() - 0.5) * 80}px;
      `;
      container.appendChild(el);
    }
  }

  /* ================================================================
     TRANSICIÓN INTRO → CONTRASEÑA
  ================================================================ */
  function goToPassword () {
    introScreen.classList.add('screen-exit');
    setTimeout(() => {
      introScreen.classList.remove('active', 'screen-exit');
      passwordScreen.classList.add('active', 'screen-enter');
      setTimeout(() => passwordScreen.classList.remove('screen-enter'), 800);
    }, 650);
  }

  /* ================================================================
     TRANSICIÓN CONTRASEÑA → EXPERIENCIA (MENÚ)
  ================================================================ */
  function goToExperience () {
    passwordScreen.classList.add('screen-exit');
    setTimeout(() => {
      passwordScreen.classList.remove('active', 'screen-exit');
      introScreen.style.display    = 'none';
      passwordScreen.style.display = 'none';
      experience.classList.add('active');
      document.body.style.overflow = '';

      Counter.init();
      if (window.Menu) Menu.init();
      if (window.ChapterViewer) ChapterViewer.init();
      if (window.BottomNav) BottomNav.init();
      if (window.Animations) Animations.init();

      showMenu();

      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('experienceReady'));
      }, 100);
    }, 650);
  }

  window.App = { goToExperience };

  /* ================================================================
     NAVEGACIÓN ENTRE MENÚ ↔ CAPÍTULOS
  ================================================================ */
  function showMenu () {
    if (!menuScreen || !chapterScreen) return;
    chapterScreen.classList.remove('active');
    chapterScreen.style.transform = '';
    menuScreen.classList.add('active');
    if (window.ChapterViewer) ChapterViewer.destroyCurrent();
    currentChapter = -1;
  }

  function goToChapter (idx) {
    if (idx < 0 || idx > 9) return;
    if (idx === currentChapter) return;

    if (!chapterScreen || !menuScreen) return;

    const goingFromMenu = currentChapter === -1;

    if (!goingFromMenu && window.ChapterViewer) ChapterViewer.destroyCurrent();

    if (goingFromMenu) {
      menuScreen.classList.remove('active');
      chapterScreen.classList.add('active');
      chapterScreen.style.transform = '';
    }

    if (window.ChapterViewer) ChapterViewer.loadChapter(idx);
    currentChapter = idx;

    if (window.BottomNav) BottomNav.setCurrent(idx);
  }

  window.App.goToChapter = goToChapter;
  window.App.showMenu = showMenu;

  /* ================================================================
     MÚSICA
  ================================================================ */
  let musicPlaying = false;

  function toggleMusic () {
    if (!music) return;
    if (musicPlaying) {
      music.pause();
      musicToggle.classList.remove('playing');
      document.getElementById('musicIcon').textContent = '♪';
    } else {
      music.play().catch(() => {});
      musicToggle.classList.add('playing');
      document.getElementById('musicIcon').textContent = '♫';
    }
    musicPlaying = !musicPlaying;
  }

  /* ================================================================
     EASTER EGG — KONAMI CODE
  ================================================================ */
  (function initKonami () {
    const CODE    = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let   pointer = 0;
    document.addEventListener('keydown', e => {
      if (e.key === CODE[pointer]) {
        pointer++;
        if (pointer === CODE.length) {
          pointer = 0;
          heartRain();
        }
      } else {
        pointer = 0;
      }
    });

    function heartRain () {
      const duration = 4000;
      const start    = Date.now();
      const interval = setInterval(() => {
        if (Date.now() - start > duration) { clearInterval(interval); return; }
        const el = document.createElement('span');
        el.textContent = '❤️';
        el.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}vw;
          top: -5%;
          font-size: ${Math.random() * 2 + 1}rem;
          pointer-events: none;
          z-index: 9998;
          animation: konamiDrop 1.8s ease forwards;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1900);
      }, 120);

      if (!document.getElementById('konamiStyle')) {
        const s = document.createElement('style');
        s.id    = 'konamiStyle';
        s.textContent = `@keyframes konamiDrop { from { transform: translateY(0) rotate(0deg); opacity: 1; } to { transform: translateY(110vh) rotate(40deg); opacity: 0; } }`;
        document.head.appendChild(s);
      }
    }
  })();

  /* ================================================================
     INICIALIZACIÓN
  ================================================================ */
  function init () {
    if (window.Stars) Stars.init();
    spawnIntroParticles();

    if (openLetterBtn) {
      openLetterBtn.addEventListener('click', goToPassword);
    }

    if (introScreen) {
      introScreen.addEventListener('click', (e) => {
        if (e.target === introScreen) goToPassword();
      });
    }

    if (window.Password) Password.init();

    if (musicToggle) {
      musicToggle.addEventListener('click', toggleMusic);
    }

    if (headerMenuBtn) {
      headerMenuBtn.addEventListener('click', showMenu);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js');
    });
  }

})();
