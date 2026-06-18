/* ================================================================
   future-letters.js — Cartas para el futuro
   Lógica: fecha de desbloqueo + contraseña de acceso anticipado

   CÓMO CONFIGURAR:
   ─────────────────────────────────────────────────────────────
   Cada carta tiene un objeto con:

     unlockDate → fecha en que se abre sola (YYYY-MM-DD)
     password   → contraseña de acceso anticipado
                  (déjala en '' si no quieres contraseña en esa carta)
     content    → el texto de la carta (puedes usar \n para saltos)

   Busca el bloque CARTAS ↓ más abajo para editar.
   ================================================================ */

(function () {

  /* ================================================================
     CARTAS ↓ — EDITA AQUÍ
  ================================================================ */
  const LETTERS = [
    {
      id:         'letter-1',
      title:      'Para dentro de un año',
      icon:       '📩',
      subtitle:   'Para leer juntos el 8 de febrero de 2027.',

      /* Fecha en que se abre sola — formato YYYY-MM-DD */
      unlockDate: '2027-02-08',

      /* Contraseña de acceso anticipado
         Cámbiala por lo que quieras: una palabra, una fecha, una frase corta.
         Si la dejas vacía ('') solo se puede abrir cuando llegue la fecha. */
      password: '08022026', /* ← PON TU CONTRASEÑA AQUÍ */

      /* Texto de la carta
         Usa \n para saltos de línea.
         Puedes escribir todo lo que quieras. */
      content: `Mi amor,

Si estás leyendo esto, ya pasó un año desde que empezó todo.

[Escribe aquí tu carta para este momento. ¿Qué esperas que hayan vivido juntos? ¿Qué quieres que ella recuerde de este primer año?]

Con todo mi amor,
[Tu nombre]`,
    },

    {
      id:         'letter-2',
      title:      'Para cuando más lo necesites',
      icon:       '📩',
      subtitle:   'Ábrela en un día difícil. Ahí estaré.',

      /* Sin fecha fija — solo se abre con contraseña */
      unlockDate: '', /* ← Déjala vacía si no tiene fecha límite */

      password: '08022026', /* ← PON TU CONTRASEÑA AQUÍ */

      content: `Mi amor,

Si abriste esta carta es porque lo necesitabas.

[Escribe aquí palabras de aliento, recuérdales por qué se quieren, qué los hace fuertes juntos. Esta carta es un abrazo en texto.]

Siempre estoy aquí,
[Tu nombre]`,
    },

    {
      id:         'letter-3',
      title:      'Para la Elis del futuro',
      icon:       '📩',
      subtitle:   'Cuando vuelvas a leer esto, recuerda este momento.',

      /* Se abre el día de los 6 meses */
      unlockDate: '2026-08-08',

      password: '08022026', /*CONTRASEÑA*/

      content: `Elis,

Hoy celebramos 6 meses.

[Escribe aquí lo que sientes en este momento, lo que has aprendido de ella, lo que más te emociona del futuro juntos. Esta carta es una cápsula del tiempo.]

Tuyo,
[Tu nombre]`,
    },
  ];
  /* ================================================================
     FIN DE CONFIGURACIÓN
  ================================================================ */

  /* ── Modal reutilizable ──────────────────────────────────────── */
  let modal, modalTitle, modalBody, modalInput, modalBtn, modalMsg, modalClose;

  function buildModal () {
    modal = document.createElement('div');
    modal.id = 'letterModal';
    modal.innerHTML = `
      <div class="lm-backdrop"></div>
      <div class="lm-box">
        <button class="lm-close">✕</button>
        <div class="lm-content">
          <div class="lm-icon">📬</div>
          <h3 class="lm-title"></h3>
          <div class="lm-body"></div>

          <!-- Panel de contraseña (se muestra cuando hace falta) -->
          <div class="lm-password-panel" style="display:none;">
            <p class="lm-password-hint">Esta carta aún no tiene fecha… pero puedes abrirla si tienes la clave 🔑</p>
            <input class="lm-password-input" type="password" placeholder="contraseña" maxlength="40" autocomplete="off">
            <button class="lm-password-btn primary-btn">Abrir carta</button>
            <p class="lm-password-msg"></p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modalClose = modal.querySelector('.lm-close');
    modalTitle = modal.querySelector('.lm-title');
    modalBody  = modal.querySelector('.lm-body');
    modalInput = modal.querySelector('.lm-password-input');
    modalBtn   = modal.querySelector('.lm-password-btn');
    modalMsg   = modal.querySelector('.lm-password-msg');

    modalClose.addEventListener('click', closeModal);
    modal.querySelector('.lm-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ── Abrir modal ─────────────────────────────────────────────── */
  function openModal (letter) {
    const now        = new Date();
    const unlockDate = letter.unlockDate ? new Date(letter.unlockDate) : null;
    const isUnlocked = unlockDate ? now >= unlockDate : false;
    const hasPass    = letter.password && letter.password.trim() !== '';

    modalTitle.textContent = letter.title;
    modalBody.innerHTML    = '';
    modal.querySelector('.lm-password-panel').style.display = 'none';
    modalMsg.textContent   = '';
    modalInput.value       = '';

    if (isUnlocked) {
      /* ✅ Fecha cumplida → mostrar carta directo */
      showContent(letter.content);

    } else if (hasPass) {
      /* 🔒 Aún no es la fecha, pero hay contraseña */
      const daysLeft = unlockDate
        ? Math.ceil((unlockDate - now) / 86400000)
        : null;

      const hint = modal.querySelector('.lm-password-hint');
      if (daysLeft !== null) {
        hint.textContent = `Faltan ${daysLeft} día${daysLeft !== 1 ? 's' : ''} para que se abra sola… o usa la clave si ya la tienes 🔑`;
      } else {
        hint.textContent = 'Esta carta no tiene fecha. Puedes abrirla si tienes la clave 🔑';
      }

      modal.querySelector('.lm-password-panel').style.display = 'flex';

      /* Verificar contraseña */
      const verify = () => {
        if (modalInput.value.trim() === letter.password.trim()) {
          modal.querySelector('.lm-password-panel').style.display = 'none';
          showContent(letter.content);
        } else {
          modalMsg.textContent = 'Esa no es la clave… 🙈';
          modalInput.value = '';
          modalInput.style.animation = 'none';
          modalInput.offsetHeight;
          modalInput.style.animation = 'shakeError 0.4s ease';
          setTimeout(() => { modalMsg.textContent = ''; }, 2500);
        }
      };

      modalBtn.onclick = verify;
      modalInput.onkeydown = e => { if (e.key === 'Enter') verify(); };

    } else {
      /* 🔒 Sin fecha cumplida y sin contraseña → solo informar */
      const daysLeft = unlockDate
        ? Math.ceil((unlockDate - now) / 86400000)
        : null;

      modalBody.innerHTML = `
        <p style="font-family:var(--font-display); font-style:italic; color:var(--sepia-light); font-size:1.1rem; line-height:1.8; text-align:center;">
          ${daysLeft !== null
            ? `Faltan <strong style="color:var(--rose)">${daysLeft} día${daysLeft !== 1 ? 's'  : ''}</strong> para poder leer esta carta. 🕊️`
            : 'Esta carta todavía espera el momento indicado. 🕊️'}
        </p>
      `;
    }

    modal.classList.add('lm-visible');
    document.body.style.overflow = 'hidden';
  }

  /* ── Mostrar contenido de la carta ───────────────────────────── */
  function showContent (text) {
    modal.querySelector('.lm-icon').textContent = '💌';
    /* Convertir saltos de línea en párrafos */
    const paragraphs = text.split('\n').filter(l => l.trim() !== '');
    modalBody.innerHTML = paragraphs.map(p =>
      `<p>${p}</p>`
    ).join('');
    modalBody.style.animation = 'fadeSlideUp 0.5s ease both';
  }

  /* ── Cerrar modal ────────────────────────────────────────────── */
  function closeModal () {
    modal.classList.remove('lm-visible');
    document.body.style.overflow = '';
  }

  /* ── Renderizar las cartas en el HTML ────────────────────────── */
  function renderLetters () {
    const container = document.querySelector('.future-letters');
    if (!container) return;

    container.innerHTML = '';

    LETTERS.forEach(letter => {
      const now        = new Date();
      const unlockDate = letter.unlockDate ? new Date(letter.unlockDate) : null;
      const isUnlocked = unlockDate ? now >= unlockDate : false;

      const el = document.createElement('div');
      el.className  = `future-letter${isUnlocked ? ' unlocked' : ' locked'}`;
      el.dataset.id = letter.id;
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.innerHTML = `
        <span class="letter-icon">${letter.icon}</span>
        <div class="letter-info">
          <h4>${letter.title}</h4>
          <p>${letter.subtitle}</p>
        </div>
        <span class="letter-lock">${isUnlocked ? '💌' : '🔒'}</span>
      `;

      el.addEventListener('click', () => openModal(letter));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(letter); }
      });

      container.appendChild(el);
    });
  }

  /* ── Estilos del modal ───────────────────────────────────────── */
  function injectStyles () {
    const s = document.createElement('style');
    s.textContent = `
      #letterModal {
        position: fixed;
        inset: 0;
        z-index: 6000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.35s ease;
      }
      #letterModal.lm-visible {
        opacity: 1;
        pointer-events: all;
      }
      .lm-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(28,15,8,0.88);
        backdrop-filter: blur(6px);
      }
      .lm-box {
        position: relative;
        z-index: 10;
        background: var(--paper);
        border: 1px solid rgba(196,132,58,0.2);
        border-radius: 18px;
        max-width: min(92vw, 560px);
        width: 100%;
        max-height: 85vh;
        overflow-y: auto;
        padding: 2.5rem 2rem 2rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        animation: zoomIn 0.4s cubic-bezier(.22,1,.36,1) both;
      }
      .lm-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(61,43,31,0.08);
        color: var(--sepia);
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;
        border: none;
      }
      .lm-close:hover { background: var(--rose); color: white; }
      .lm-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        text-align: center;
      }
      .lm-icon { font-size: 2.5rem; }
      .lm-title {
        font-family: var(--font-display);
        font-size: 1.6rem;
        font-weight: 400;
        font-style: italic;
        color: var(--ink);
      }
      .lm-body {
        text-align: left;
        width: 100%;
      }
      .lm-body p {
        font-family: var(--font-display);
        font-size: 1.1rem;
        font-style: italic;
        color: var(--sepia);
        line-height: 1.85;
        margin-bottom: 0.8rem;
      }
      .lm-password-panel {
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
        width: 100%;
      }
      .lm-password-hint {
        font-size: 0.9rem;
        color: var(--sepia-light);
        font-style: italic;
        line-height: 1.6;
      }
      .lm-password-input {
        width: 100%;
        max-width: 260px;
        padding: 0.75rem 1rem;
        background: rgba(61,43,31,0.05);
        border: 1px solid rgba(196,132,58,0.3);
        border-radius: 10px;
        color: var(--ink);
        font-family: var(--font-body);
        font-size: 1rem;
        letter-spacing: 0.2em;
        text-align: center;
        outline: none;
        transition: border-color 0.3s ease;
      }
      .lm-password-input:focus {
        border-color: var(--gold);
        box-shadow: 0 0 0 3px rgba(212,168,90,0.15);
      }
      .lm-password-msg {
        font-size: 0.82rem;
        color: var(--rose);
        min-height: 1em;
        font-style: italic;
      }

      /* Carta desbloqueada → borde dorado */
      .future-letter.unlocked {
        border-color: rgba(212,168,90,0.4);
        cursor: pointer;
      }
      .future-letter.locked {
        cursor: pointer;
        opacity: 0.9;
      }
      .future-letter:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 28px rgba(61,43,31,0.12);
      }
    `;
    document.head.appendChild(s);
  }

  /* ── Init ────────────────────────────────────────────────────── */
  function init () {
    injectStyles();
    buildModal();
    renderLetters();
  }

  window.FutureLetters = { init };

})();