/* ================================================================
   stars.js — Fondo estrellado animado (canvas)
================================================================ */

(function () {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let animId;

  /* ── Configuración ─────────────────────────────────────── */
  const CFG = {
    count:        160,
    minRadius:    0.3,
    maxRadius:    1.6,
    minSpeed:     0.015,
    maxSpeed:     0.055,
    minOpacity:   0.15,
    maxOpacity:   0.85,
    twinkleSpeed: 0.008,
    colors: ['#FFF8F0', '#FFE4C4', '#FFD1A4', '#FFDAB9', '#FFFFFF'],
  };

  /* ── Helpers ────────────────────────────────────────────── */
  const rand  = (min, max) => Math.random() * (max - min) + min;
  const pick  = arr => arr[Math.floor(Math.random() * arr.length)];

  /* ── Crear una estrella ─────────────────────────────────── */
  function createStar (forceX, forceY) {
    return {
      x:          forceX !== undefined ? forceX : rand(0, canvas.width),
      y:          forceY !== undefined ? forceY : rand(0, canvas.height),
      r:          rand(CFG.minRadius, CFG.maxRadius),
      color:      pick(CFG.colors),
      opacity:    rand(CFG.minOpacity, CFG.maxOpacity),
      targetOp:   rand(CFG.minOpacity, CFG.maxOpacity),
      speed:      rand(CFG.minSpeed, CFG.maxSpeed),
      drift:      rand(-0.04, 0.04),   // movimiento horizontal suave
      twinkle:    CFG.twinkleSpeed * rand(0.5, 2),
    };
  }

  /* ── Poblar estrellas ───────────────────────────────────── */
  function populate () {
    stars = Array.from({ length: CFG.count }, () => createStar());
  }

  /* ── Resize ─────────────────────────────────────────────── */
  function resize () {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    populate();
  }

  /* ── Dibujar una estrella ───────────────────────────────── */
  function drawStar (s) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, s.opacity));
    ctx.fillStyle   = s.color;
    ctx.shadowBlur  = s.r * 3;
    ctx.shadowColor = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ── Actualizar posición / parpadeo ─────────────────────── */
  function update (s) {
    /* Movimiento vertical ascendente muy lento */
    s.y -= s.speed;
    s.x += s.drift;

    /* Parpadeo suave hacia la opacidad objetivo */
    if (Math.abs(s.opacity - s.targetOp) < 0.01) {
      s.targetOp = rand(CFG.minOpacity, CFG.maxOpacity);
    }
    s.opacity += (s.targetOp - s.opacity) * s.twinkle;

    /* Reciclar si sale del canvas */
    if (s.y < -4 || s.x < -4 || s.x > canvas.width + 4) {
      Object.assign(s, createStar(rand(0, canvas.width), canvas.height + 4));
    }
  }

  /* ── Loop principal ─────────────────────────────────────── */
  function loop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => { update(s); drawStar(s); });
    animId = requestAnimationFrame(loop);
  }

  /* ── Iniciar ────────────────────────────────────────────── */
  function init () {
    resize();
    loop();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      resize();
      loop();
    });
  }

  /* Exportar para que app.js pueda iniciarlo */
  window.Stars = { init };

})();