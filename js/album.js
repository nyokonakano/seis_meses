/* ================================================================
   album.js — Álbum de fotos con lightbox
================================================================ */

(function () {

  let overlay, imgEl, captionEl, closeBtn, prevBtn, nextBtn;
  let cards = [];
  let currentIndex = 0;

  /* ── Crear lightbox en el DOM ────────────────────────────── */
  function buildLightbox () {
    overlay = document.createElement('div');
    overlay.id = 'albumLightbox';
    overlay.innerHTML = `
      <div class="lb-backdrop"></div>
      <div class="lb-box">
        <button class="lb-close" aria-label="Cerrar">✕</button>
        <button class="lb-prev"  aria-label="Anterior">‹</button>
        <button class="lb-next"  aria-label="Siguiente">›</button>
        <div class="lb-img-wrap">
          <img class="lb-img" src="" alt="">
        </div>
        <p class="lb-caption"></p>
        <div class="lb-dots"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    closeBtn  = overlay.querySelector('.lb-close');
    prevBtn   = overlay.querySelector('.lb-prev');
    nextBtn   = overlay.querySelector('.lb-next');
    imgEl     = overlay.querySelector('.lb-img');
    captionEl = overlay.querySelector('.lb-caption');

    /* Eventos */
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click',  () => navigate(-1));
    nextBtn.addEventListener('click',  () => navigate(1));
    overlay.querySelector('.lb-backdrop').addEventListener('click', close);

    document.addEventListener('keydown', onKey);
  }

  /* ── Abrir lightbox en una foto concreta ─────────────────── */
  function open (index) {
    currentIndex = index;
    render();
    overlay.classList.add('lb-visible');
    document.body.style.overflow = 'hidden';
  }

  function close () {
    overlay.classList.remove('lb-visible');
    document.body.style.overflow = '';
    /* Pequeña demora para que la transición termine */
    setTimeout(() => { imgEl.src = ''; }, 400);
  }

  /* ── Renderizar foto actual ──────────────────────────────── */
  function render () {
    const card = cards[currentIndex];
    if (!card) return;

    const src     = card.querySelector('img')?.src || '';
    const caption = card.querySelector('span')?.textContent || '';

    imgEl.style.opacity = '0';
    imgEl.src = src;
    imgEl.onload = () => { imgEl.style.opacity = '1'; };

    captionEl.textContent = caption;

    /* Puntos de navegación */
    const dots = overlay.querySelector('.lb-dots');
    dots.innerHTML = cards.map((_, i) =>
      `<span class="lb-dot${i === currentIndex ? ' active' : ''}"></span>`
    ).join('');

    dots.querySelectorAll('.lb-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => navigate(i - currentIndex));
    });

    /* Ocultar flechas en los extremos */
    prevBtn.style.opacity = currentIndex === 0 ? '0.2' : '1';
    nextBtn.style.opacity = currentIndex === cards.length - 1 ? '0.2' : '1';
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === cards.length - 1;
  }

  function navigate (dir) {
    const next = currentIndex + dir;
    if (next < 0 || next >= cards.length) return;
    currentIndex = next;
    render();
  }

  function onKey (e) {
    if (!overlay.classList.contains('lb-visible')) return;
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'Escape')     close();
  }

  /* ── Soporte de swipe táctil ─────────────────────────────── */
  function initSwipe () {
    let startX = 0;
    const box = overlay.querySelector('.lb-box');

    box.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    box.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ── Inyectar estilos del lightbox ───────────────────────── */
  function injectStyles () {
    const s = document.createElement('style');
    s.textContent = `
      #albumLightbox {
        position: fixed;
        inset: 0;
        z-index: 5000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.35s ease;
      }
      #albumLightbox.lb-visible {
        opacity: 1;
        pointer-events: all;
      }
      .lb-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(28, 15, 8, 0.92);
        backdrop-filter: blur(6px);
      }
      .lb-box {
        position: relative;
        z-index: 10;
        max-width: min(90vw, 680px);
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
      }
      .lb-img-wrap {
        width: 100%;
        background: var(--paper);
        padding: 0.9rem 0.9rem 3.5rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        border-radius: 3px;
      }
      .lb-img {
        width: 100%;
        max-height: 65vh;
        object-fit: contain;
        display: block;
        border-radius: 1px;
        transition: opacity 0.3s ease;
      }
      .lb-caption {
        font-family: var(--font-script);
        font-size: 1.2rem;
        color: var(--gold);
        text-align: center;
        margin-top: -0.5rem;
      }
      .lb-close {
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(61,43,31,0.9);
        border: 1px solid rgba(212,168,90,0.3);
        color: var(--paper);
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;
      }
      .lb-close:hover { background: var(--rose); transform: scale(1.1); }
      .lb-prev, .lb-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(61,43,31,0.75);
        border: 1px solid rgba(212,168,90,0.25);
        color: var(--paper);
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;
        line-height: 1;
      }
      .lb-prev { left: -1.2rem; }
      .lb-next { right: -1.2rem; }
      .lb-prev:hover:not(:disabled),
      .lb-next:hover:not(:disabled) {
        background: rgba(61,43,31,0.95);
        border-color: var(--gold);
      }
      .lb-dots {
        display: flex;
        gap: 6px;
        justify-content: center;
        flex-wrap: wrap;
      }
      .lb-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: rgba(253,246,227,0.3);
        transition: all 0.2s ease;
        cursor: pointer;
      }
      .lb-dot.active {
        background: var(--rose-light);
        transform: scale(1.3);
      }
      .lb-dot:hover { background: var(--gold); }

      @media (max-width: 480px) {
        .lb-prev { left: 0.2rem; }
        .lb-next { right: 0.2rem; }
        .lb-img-wrap { padding: 0.7rem 0.7rem 2.8rem; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init () {
    cards = Array.from(document.querySelectorAll('.photo-card'));
    if (!cards.length) return;

    injectStyles();
    if (!document.getElementById('albumLightbox')) buildLightbox();
    initSwipe();

    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img && img.naturalWidth > 0) open(i);
      });

      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const img = card.querySelector('img');
          if (img && img.naturalWidth > 0) open(i);
        }
      });
    });
  }

  function destroy () {
    close();
  }

  window.Album = { init, destroy };

})();