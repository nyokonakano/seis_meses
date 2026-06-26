(function () {

  const EMOJIS = ['❤️', '✨', '🌸', '💫', '✦', '♡', '·', '🌷', '💕'];
  let running   = false;
  let particles = [];
  let container;

  function createParticle () {
    const el = document.createElement('span');
    const emoji  = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const size   = Math.random() * 1.0 + 0.6;
    const left   = Math.random() * 100;
    const dur    = Math.random() * 5  + 5;
    const delay  = Math.random() * 4;
    const drift  = (Math.random() - 0.5) * 120;
    el.textContent  = emoji;
    el.style.cssText = `
      position: absolute;
      left: ${left}%;
      bottom: -10%;
      font-size: ${size}rem;
      pointer-events: none;
      opacity: 0;
      animation: finaleFloat ${dur}s ${delay}s ease-in-out infinite;
      --drift: ${drift}px;
    `;
    container.appendChild(el);
    return el;
  }

  function start () {
    running = true;
    for (let i = 0; i < 18; i++) particles.push(createParticle());
  }

  function stop () {
    running = false;
    particles.forEach(p => p.remove());
    particles = [];
  }

  function init () {
    container = document.getElementById('finalParticles');
    if (!container) return;
    start();
  }

  function destroy () {
    stop();
  }

  window.Finale = { init, destroy };

})();
