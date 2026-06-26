/* ================================================================
   quiz.js — ¿Me conoces? Quiz de amor  v2
   Completamente autocontenido: no depende de animations.css
   ni de variables CSS externas para funcionar.

   PERSONALIZAR → busca el bloque  PREGUNTAS ↓  más abajo
================================================================ */

(function () {

  /* ================================================================
     PREGUNTAS ↓ — EDITA AQUÍ
     correct: índice de la opción correcta (0, 1 o 2)
  ================================================================ */
  const QUESTIONS = [
    {
      question: '¿En qué clase nos conocimos?',
      options:  ['Matemáticas', 'Estadística', 'Historia'],
      correct:  1,
      emoji:    '📚',
      feedback: '¡Exacto! Gracias a esa clase aburrida encontré a la persona más bonita. 🥹',
    },
    {
      question: '¿Cuál es mi comida favorita?',
      options:  ['[Opción A]', '[Opción B]', '[Opción C]'],  /* ← CAMBIA */
      correct:  0,
      emoji:    '🍽️',
      feedback: '¡Me conoces bien! ❤️',
    },
    {
      question: '¿Cuál es la canción que más nos representa?',
      options:  ['[Canción A]', '[Canción B]', '[Canción C]'],  /* ← CAMBIA */
      correct:  0,
      emoji:    '🎵',
      feedback: 'Siempre que la escucho pienso en ti. 🎶',
    },
    {
      question: '¿Qué fue lo primero que pensé cuando te vi?',
      options:  ['Qué persona tan interesante', 'Qué bonita es', 'Las dos anteriores'],
      correct:  2,
      emoji:    '👀',
      feedback: 'Sí… fue exactamente eso. No podía dejar de mirarte. 😊',
    },
    {
      question: '¿Cuándo fue nuestra primera salida juntos?',
      options:  ['[Fecha/lugar A]', '[Fecha/lugar B]', '[Fecha/lugar C]'],  /* ← CAMBIA */
      correct:  0,
      emoji:    '🗓️',
      feedback: '¡Ese día lo recuerdo perfectamente! Fue especial. ✨',
    },
    {
      question: '¿Cuántos meses cumplimos?',
      options:  ['3 meses', '6 meses', '12 meses'],
      correct:  1,
      emoji:    '🎉',
      feedback: '¡6 meses llenos de momentos que jamás olvidaré! ❤️',
    },
  ];
  /* ================================================================
     FIN DE CONFIGURACIÓN
  ================================================================ */

  let wrap;
  let current  = 0;
  let score    = 0;
  let answered = false;

  /* ── Render de una pregunta ──────────────────────────────── */
  function renderQuestion () {
    answered = false;
    const q   = QUESTIONS[current];
    const pct = Math.round((current / QUESTIONS.length) * 100);

    /* Tarjeta */
    const card = document.createElement('div');
    card.className = 'qz-card';
    card.innerHTML = `
      <div class="qz-emoji-big">${q.emoji}</div>
      <p class="qz-q-text">${q.question}</p>
      <div class="qz-opts">
        ${q.options.map((opt, i) => `
          <button class="qz-opt" data-i="${i}">
            <span class="qz-opt-ltr">${['A','B','C'][i]}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    /* Barra de progreso */
    const barBg   = document.createElement('div'); barBg.className = 'qz-bar-bg';
    const barFill = document.createElement('div'); barFill.className = 'qz-bar-fill';
    barFill.style.width = pct + '%';
    barBg.appendChild(barFill);

    const counter = document.createElement('p');
    counter.className = 'qz-counter-txt';
    counter.textContent = `${current + 1} / ${QUESTIONS.length}`;

    /* Montar en wrap */
    wrap.innerHTML = '';
    wrap.appendChild(barBg);
    wrap.appendChild(counter);
    wrap.appendChild(card);

    /* Eventos */
    card.querySelectorAll('.qz-opt').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.i)));
    });
  }

  /* ── Manejar respuesta ───────────────────────────────────── */
  function handleAnswer (idx) {
    if (answered) return;
    answered = true;

    const q       = QUESTIONS[current];
    const isRight = idx === q.correct;
    if (isRight) score++;

    const card = wrap.querySelector('.qz-card');

    /* Colorear opciones */
    card.querySelectorAll('.qz-opt').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct)       btn.classList.add('correct');
      if (i === idx && !isRight) btn.classList.add('wrong');
    });

    /* Feedback */
    const fb = document.createElement('div');
    fb.className = 'qz-feedback ' + (isRight ? 'fb-ok' : 'fb-fail');
    fb.innerHTML = isRight
      ? `<span class="qz-fb-ico">✅</span><span>${q.feedback}</span>`
      : `<span class="qz-fb-ico">💛</span><span>Casi… era <strong>${q.options[q.correct]}</strong>. ${q.feedback}</span>`;
    card.appendChild(fb);

    /* Botón siguiente con delay */
    setTimeout(() => {
      const btn = document.createElement('button');
      btn.className   = 'qz-next-btn';
      btn.textContent = current < QUESTIONS.length - 1 ? 'Siguiente →' : 'Ver resultado 🎉';
      btn.addEventListener('click', () => {
        current++;
        if (current < QUESTIONS.length) renderQuestion();
        else renderResult();
      });
      card.appendChild(btn);
    }, 500);
  }

  /* ── Pantalla de resultado ───────────────────────────────── */
  function renderResult () {
    const pct  = Math.round((score / QUESTIONS.length) * 100);
    const circ = 263.8;
    const dash = Math.round((pct / 100) * circ);

    const msgs = [
      { min: 0,   emoji: '🌸', msg: 'Aún nos queda mucho por descubrir juntos… ¡y eso es lo bonito! 🌱' },
      { min: 40,  emoji: '💛', msg: 'Ya me conoces bastante bien… y lo mejor está por venir. ✨' },
      { min: 70,  emoji: '🌟', msg: '¡Me conoces muy bien! Eso significa que has prestado atención. 🥹' },
      { min: 100, emoji: '💕', msg: '¡Perfecto! Me conoces mejor que nadie. Te amo, mi amor. ❤️' },
    ];
    const m = [...msgs].reverse().find(m => pct >= m.min);

    const result = document.createElement('div');
    result.className = 'qz-result';
    result.innerHTML = `
      <div class="qz-res-emoji">${m.emoji}</div>
      <h3 class="qz-res-title">${score} de ${QUESTIONS.length} correctas</h3>

      <div class="qz-ring-wrap">
        <svg viewBox="0 0 100 100">
          <circle class="qz-ring-bg"   cx="50" cy="50" r="42"/>
          <circle class="qz-ring-fill" cx="50" cy="50" r="42"
            stroke-dasharray="0 ${circ}"
            id="qzRingFill"/>
        </svg>
        <span class="qz-ring-pct">${pct}%</span>
      </div>

      <p class="qz-res-msg">${m.msg}</p>
      <button class="qz-retry-btn" id="qzRetry">🔄 Intentar de nuevo</button>
    `;

    wrap.innerHTML = '';
    wrap.appendChild(result);

    /* Animar el arco */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const fill = document.getElementById('qzRingFill');
        if (fill) {
          fill.style.transition = 'stroke-dasharray 1.2s cubic-bezier(.22,1,.36,1)';
          fill.setAttribute('stroke-dasharray', `${dash} ${circ}`);
        }
      });
    });

    document.getElementById('qzRetry').addEventListener('click', () => {
      current  = 0;
      score    = 0;
      answered = false;
      renderQuestion();
    });
  }

  function init () {
    const container = document.getElementById('quizContainer');
    const startBtn  = document.getElementById('startQuizBtn');
    if (!container || !startBtn) return;

    /* Crear wrapper interno */
    wrap = document.createElement('div');
    wrap.id = 'qz-wrap';
    container.appendChild(wrap);

    startBtn.addEventListener('click', () => {
      startBtn.style.display = 'none';
      current  = 0;
      score    = 0;
      answered = false;
      renderQuestion();
    });
  }

  window.Quiz = { init };

})();