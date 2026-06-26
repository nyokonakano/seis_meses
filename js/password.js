/* ================================================================
   password.js — Pantalla de contraseña
================================================================ */

(function () {

  const CORRECT = window.CONFIG ? CONFIG.PASSWORD : '08022026';

  /* ── Elementos ───────────────────────────────────────────── */
  let input, btn, msg;

  /* ── Efectos de error ────────────────────────────────────── */
  function shakeCard () {
    const card = document.querySelector('.password-card');
    if (!card) return;
    card.style.animation = 'none';
    card.offsetHeight;                               // reflow
    card.style.animation = 'shakeError 0.45s ease';
  }

  function setMessage (text, isError = true) {
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = isError ? 'var(--rose-light)' : 'var(--gold)';
    msg.style.opacity = '1';
  }

  /* ── Verificar ───────────────────────────────────────────── */
  function verify () {
    const val = (input?.value || '').trim();

    if (val === CORRECT) {
      setMessage('¡Bienvenida, mi amor ❤️', false);
      btn.disabled  = true;
      input.disabled = true;

      setTimeout(() => {
        /* Delegar la transición a app.js */
        if (typeof window.App !== 'undefined' && window.App.goToExperience) {
          window.App.goToExperience();
        }
      }, 900);

    } else {
      shakeCard();
      setMessage('Hmm… esa no es la fecha 🙈');
      input.value = '';
      input.focus();

      /* Limpiar mensaje luego de un rato */
      setTimeout(() => {
        if (msg) msg.style.opacity = '0';
      }, 2800);
    }
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init () {
    input = document.getElementById('passwordInput');
    btn   = document.getElementById('passwordBtn');
    msg   = document.getElementById('passwordMessage');

    if (!input || !btn) return;

    btn.addEventListener('click', verify);

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') verify();
    });

    /* Limpiar mensaje al escribir */
    input.addEventListener('input', () => {
      if (msg) msg.style.opacity = '0';
    });
  }

  window.Password = { init };

})();