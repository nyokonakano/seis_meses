/* ================================================================
   letters.js — Estrellas interactivas "Cosas que amo de ti"
================================================================ */

(function () {

  let messageBox;

  /* ── Colores rotativos para el mensaje ───────────────────── */
  const COLORS = [
    'var(--rose)',
    'var(--amber)',
    '#A06080',
    'var(--rose)',
    '#7A6040',
  ];
  let colorIdx = 0;

  /* ── Mostrar mensaje con animación ───────────────────────── */
  function showMessage (text) {
    if (!messageBox) return;

    messageBox.classList.remove('visible');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        messageBox.textContent = text;
        messageBox.style.color = COLORS[colorIdx % COLORS.length];
        colorIdx++;
        messageBox.classList.add('visible');
      });
    });
  }

  /* ── Partícula mini que vuela desde la estrella ──────────── */
  function spawnSparkle (star) {
    const rect = star.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2 + window.scrollX;
    const cy   = rect.top  + rect.height / 2 + window.scrollY;

    const sparks = ['✦', '✧', '·', '★', '♡'];

    for (let i = 0; i < 5; i++) {
      const el = document.createElement('span');
      el.textContent = sparks[Math.floor(Math.random() * sparks.length)];
      el.style.cssText = `
        position: absolute;
        left: ${cx}px;
        top: ${cy}px;
        pointer-events: none;
        font-size: ${Math.random() * 0.8 + 0.5}rem;
        color: var(--gold);
        z-index: 9999;
        opacity: 1;
        transform: translate(-50%, -50%);
        transition: transform 0.7s ease, opacity 0.7s ease;
      `;
      document.body.appendChild(el);

      const angle  = (Math.random() * 360) * Math.PI / 180;
      const dist   = Math.random() * 60 + 30;
      const dx     = Math.cos(angle) * dist;
      const dy     = Math.sin(angle) * dist;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`;
          el.style.opacity   = '0';
        });
      });

      setTimeout(() => el.remove(), 750);
    }
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init () {
    messageBox   = document.getElementById('loveMessage');
    const stars  = document.querySelectorAll('.love-star');

    if (!stars.length) return;

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const text = star.dataset.love;
        if (!text) return;

        /* Marcar la estrella */
        stars.forEach(s => s.classList.remove('revealed'));
        star.classList.add('revealed');

        showMessage(text);
        spawnSparkle(star);
      });
    });
  }

  window.Letters = { init };

})();