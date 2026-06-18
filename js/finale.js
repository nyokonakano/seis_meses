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

  function injectKeyframe () {
    if (document.getElementById('finaleKeyframe')) return;
    const s = document.createElement('style');
    s.id = 'finaleKeyframe';
    s.textContent = `
      @keyframes finaleFloat {
        0%   { transform: translateY(0)      translateX(0)          rotate(0deg)  scale(0.8); opacity: 0;   }
        8%   { opacity: 0.85; }
        90%  { opacity: 0.4;  }
        100% { transform: translateY(-110vh) translateX(var(--drift)) rotate(45deg) scale(1.1); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
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
    injectKeyframe();
    start();
  }

  function destroy () {
    stop();
  }

  window.Finale = { init, destroy };

})();
