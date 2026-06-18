(function () {

  const TOTAL = 10;
  let currentIndex = 0;
  let prevBtn, nextBtn, dotsContainer;

  function init () {
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    dotsContainer = document.getElementById('bnDots');
    if (!prevBtn || !nextBtn || !dotsContainer) return;

    renderDots();

    prevBtn.addEventListener('click', () => {
      if (window.App) App.goToChapter(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
      if (window.App) App.goToChapter(currentIndex + 1);
    });
  }

  function renderDots () {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < TOTAL; i++) {
      const dot = document.createElement('span');
      dot.className = 'bn-dot';
      dot.dataset.index = i;
      dot.addEventListener('click', () => {
        if (window.App) App.goToChapter(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  function setCurrent (idx) {
    currentIndex = idx;
    updateButtons();
    updateDots();
  }

  function updateButtons () {
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === TOTAL - 1;
  }

  function updateDots () {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.bn-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  window.BottomNav = { init, setCurrent };

})();
