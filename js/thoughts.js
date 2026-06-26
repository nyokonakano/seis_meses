(function () {

  function loadThoughts () {
    const container = document.querySelector('.thoughts-container');
    if (!container) return;
    fetch('data/thoughts.json')
      .then(r => r.json())
      .then(data => {
        container.innerHTML = '';
        data.forEach(t => {
          const card = document.createElement('div');
          card.className = 'thought-card';
          card.textContent = t.text;
          container.appendChild(card);
        });
      })
      .catch(() => {});
  }

  function init () {
    loadThoughts();
  }

  window.Thoughts = { init };

})();
