(function () {

  let messageBox;
  let reasons = [];

  const COLORS = [
    'var(--rose)',
    'var(--amber)',
    '#A06080',
    'var(--rose)',
    '#7A6040',
  ];
  let colorIdx = 0;

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

  function buildStars () {
    const grid = document.querySelector('.stars-grid');
    if (!grid || !reasons.length) return;
    grid.innerHTML = '';
    reasons.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'love-star';
      btn.dataset.love = r.text;
      btn.textContent = '⭐';
      btn.addEventListener('click', () => {
        document.querySelectorAll('.love-star').forEach(s => s.classList.remove('revealed'));
        btn.classList.add('revealed');
        showMessage(r.text);
        spawnSparkle(btn);
      });
      grid.appendChild(btn);
    });
  }

  function loadReasons () {
    if (reasons.length) { buildStars(); return; }
    fetch('data/love-reasons.json')
      .then(r => r.json())
      .then(data => { reasons = data; buildStars(); })
      .catch(() => {});
  }

  function init () {
    messageBox = document.getElementById('loveMessage');
    loadReasons();
  }

  window.Letters = { init };

})();
