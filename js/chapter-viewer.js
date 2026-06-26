(function () {

  let contentEl, currentChapter = -1;

  const MODULES = {
    2: ['Album'],
    4: ['Thoughts'],
    5: ['Letters'],
    6: ['Quiz'],
    8: ['FutureLetters'],
    9: ['Finale'],
  };
  window.CHAPTER_MODULES = MODULES;

  function init () {
    contentEl = document.getElementById('chContent');
  }

  function loadChapter (idx) {
    if (idx === currentChapter) return;

    const template = document.getElementById('chapter-' + idx);
    if (!template) return;

    destroyCurrent();

    contentEl.innerHTML = '';
    const clone = template.content.cloneNode(true);
    contentEl.appendChild(clone);

    currentChapter = idx;

    const mods = MODULES[idx] || [];
    mods.forEach(m => {
      if (window[m] && window[m].init) window[m].init();
    });

    if (window.BottomNav) BottomNav.setCurrent(idx);

    document.dispatchEvent(new CustomEvent('chapterLoaded', { detail: { index: idx } }));
  }

  function destroyCurrent () {
    if (currentChapter < 0) return;

    const mods = MODULES[currentChapter] || [];
    mods.forEach(m => {
      if (window[m] && window[m].destroy) window[m].destroy();
    });

    if (window.Album) {
      const lb = document.getElementById('albumLightbox');
      if (lb && lb.classList.contains('lb-visible')) {
        lb.classList.remove('lb-visible');
        document.body.style.overflow = '';
      }
    }

    contentEl.innerHTML = '';
    currentChapter = -1;
  }

  window.ChapterViewer = { init, loadChapter, destroyCurrent };

})();
