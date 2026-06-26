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

  /* ── Init ────────────────────────────────────────────────── */
  function init () {
    cards = Array.from(document.querySelectorAll('.photo-card'));
    if (!cards.length) return;

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