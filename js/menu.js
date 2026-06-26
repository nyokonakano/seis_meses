(function () {

  const CHAPTERS = [
    { title: 'Cómo empezó todo', icon: '📖', subtitle: 'El día que todo cambió' },
    { title: 'Nuestra historia', icon: '📅', subtitle: 'Los momentos que nos trajeron aquí' },
    { title: 'Nuestro álbum',    icon: '📸', subtitle: 'Cada foto guarda un recuerdo' },
    { title: 'Una carta para ti',icon: '💌', subtitle: 'Lo que siento en palabras' },
    { title: 'Lo que nunca te dije', icon: '🤫', subtitle: 'Secretos del corazón' },
    { title: 'Cosas que amo de ti',  icon: '⭐', subtitle: 'Toca una estrella' },
    { title: '¿Me conoces?',    icon: '🎯', subtitle: 'Demuestra cuánto sabes' },
    { title: 'La estadística más bonita', icon: '📊', subtitle: 'Una probabilidad casi nula' },
    { title: 'Cartas para el futuro', icon: '📬', subtitle: 'Mensajes que esperan su momento' },
    { title: 'Final',           icon: '❤️', subtitle: 'Un mensaje para ti' },
  ];

  let grid;

  function init () {
    grid = document.querySelector('.menu-grid');
    if (!grid) return;

    grid.innerHTML = CHAPTERS.map((ch, i) => `
      <button class="menu-card" data-index="${i}" style="--delay:${i * 0.06}s">
        <span class="menu-card-icon">${ch.icon}</span>
        <span class="menu-card-title">${ch.title}</span>
        <span class="menu-card-sub">${ch.subtitle}</span>
      </button>
    `).join('');

    grid.addEventListener('click', e => {
      const card = e.target.closest('.menu-card');
      if (card && window.App) App.goToChapter(parseInt(card.dataset.index));
    });
  }

  window.CHAPTERS = CHAPTERS;
  window.Menu = { init };

})();
