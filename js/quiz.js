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

  let wrap;          /* div interno donde se renderiza todo */
  let current  = 0;
  let score    = 0;
  let answered = false;

  /* ── Colores base (hardcoded para no depender de CSS vars) ── */
  const C = {
    paper:     '#FDF6E3',
    paperDark: '#F0E6C8',
    cream:     '#F5EDD8',
    ink:       '#2C1A10',
    sepia:     '#6B4C3B',
    sepiaLt:   '#9B7B6A',
    rose:      '#C45C5C',
    roseLt:    '#E8A0A0',
    amber:     '#C4843A',
    gold:      '#D4A85A',
    goldLt:    '#EDD89A',
    green:     '#5CA87A',
    greenBg:   'rgba(92,168,122,0.1)',
    greenBd:   'rgba(92,168,122,0.35)',
    wrongBg:   'rgba(196,92,92,0.08)',
    wrongBd:   'rgba(196,92,92,0.4)',
  };

  /* ── Inyectar estilos autocontenidos ─────────────────────── */
  function injectStyles () {
    if (document.getElementById('qz-styles')) return;
    const s = document.createElement('style');
    s.id = 'qz-styles';
    s.textContent = `
      /* ── Wrapper principal ── */
      #qz-wrap {
        max-width: 540px;
        margin: 0 auto;
        font-family: 'Lato', system-ui, sans-serif;
      }

      /* ── Barra de progreso ── */
      .qz-bar-bg {
        width: 100%;
        height: 5px;
        background: ${C.paperDark};
        border-radius: 99px;
        overflow: hidden;
        margin-bottom: 0.4rem;
      }
      .qz-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, ${C.roseLt}, ${C.rose});
        border-radius: 99px;
        transition: width 0.5s ease;
      }
      .qz-counter-txt {
        font-size: 0.72rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: ${C.sepiaLt};
        text-align: right;
        margin-bottom: 1rem;
      }

      /* ── Tarjeta ── */
      .qz-card {
        background: ${C.paper};
        border: 1px solid rgba(196,132,58,0.2);
        border-radius: 18px;
        padding: 2rem 1.6rem;
        box-shadow: 0 6px 28px rgba(61,43,31,0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.1rem;
      }
      .qz-emoji-big { font-size: 2.4rem; line-height: 1; }
      .qz-q-text {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(1.15rem, 3vw, 1.4rem);
        font-weight: 500;
        color: ${C.ink};
        text-align: center;
        line-height: 1.45;
        margin: 0;
      }

      /* ── Opciones ── */
      .qz-opts { width: 100%; display: flex; flex-direction: column; gap: 0.6rem; }
      .qz-opt {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        width: 100%;
        padding: 0.85rem 1.1rem;
        background: transparent;
        border: 1.5px solid rgba(196,132,58,0.22);
        border-radius: 12px;
        cursor: pointer;
        text-align: left;
        font-family: 'Lato', system-ui, sans-serif;
        font-size: 0.97rem;
        color: ${C.sepia};
        transition: border-color 0.18s, background 0.18s, transform 0.18s;
      }
      .qz-opt:hover:not(:disabled) {
        border-color: ${C.gold};
        background: rgba(212,168,90,0.07);
        transform: translateX(3px);
      }
      .qz-opt:disabled { cursor: default; }
      .qz-opt-ltr {
        width: 26px; height: 26px;
        border-radius: 50%;
        background: rgba(196,132,58,0.1);
        color: ${C.amber};
        font-size: 0.72rem;
        font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        transition: background 0.2s, color 0.2s;
      }
      .qz-opt.correct          { border-color: ${C.green};  background: ${C.greenBg}; }
      .qz-opt.correct .qz-opt-ltr { background: ${C.green}; color: #fff; }
      .qz-opt.wrong            { border-color: ${C.rose};   background: ${C.wrongBg}; }
      .qz-opt.wrong .qz-opt-ltr   { background: ${C.rose};  color: #fff; }

      /* ── Feedback ── */
      .qz-feedback {
        width: 100%;
        display: flex;
        align-items: flex-start;
        gap: 0.65rem;
        padding: 0.9rem 1.1rem;
        border-radius: 12px;
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-style: italic;
        font-size: 1rem;
        line-height: 1.6;
        color: ${C.sepia};
      }
      .qz-feedback.fb-ok   { background: ${C.greenBg}; border: 1px solid ${C.greenBd}; color: #3A6E52; }
      .qz-feedback.fb-fail { background: rgba(196,132,58,0.07); border: 1px solid rgba(196,132,58,0.22); }
      .qz-fb-ico { font-size: 1.05rem; flex-shrink: 0; margin-top: 2px; }

      /* ── Botón siguiente ── */
      .qz-next-btn {
        align-self: flex-end;
        font-family: 'Dancing Script', cursive;
        font-size: 1.1rem;
        color: ${C.ink};
        background: linear-gradient(135deg, ${C.goldLt}, ${C.gold});
        border: none;
        border-radius: 50px;
        padding: 0.6rem 1.8rem;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(196,132,58,0.3);
        transition: transform 0.2s, box-shadow 0.2s;
        margin-top: 0.3rem;
      }
      .qz-next-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(196,132,58,0.4);
      }

      /* ── Pantalla resultado ── */
      .qz-result {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.1rem;
        background: ${C.paper};
        border: 1px solid rgba(196,132,58,0.2);
        border-radius: 18px;
        padding: 2.5rem 2rem;
        box-shadow: 0 6px 28px rgba(61,43,31,0.08);
      }
      .qz-res-emoji { font-size: 3.2rem; }
      .qz-res-title {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(1.4rem, 4vw, 2rem);
        font-style: italic;
        font-weight: 400;
        color: ${C.ink};
        margin: 0;
      }
      .qz-res-msg {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-style: italic;
        font-size: clamp(1rem, 2.5vw, 1.2rem);
        color: ${C.sepia};
        max-width: 38ch;
        line-height: 1.7;
        margin: 0;
      }

      /* Arco SVG */
      .qz-ring-wrap {
        position: relative;
        width: 110px;
        height: 110px;
      }
      .qz-ring-wrap svg {
        width: 100%; height: 100%;
        transform: rotate(-90deg);
      }
      .qz-ring-bg   { fill: none; stroke: ${C.paperDark}; stroke-width: 8; }
      .qz-ring-fill { fill: none; stroke: ${C.rose};      stroke-width: 8; stroke-linecap: round; }
      .qz-ring-pct {
        position: absolute;
        inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 1.5rem;
        font-weight: 600;
        color: ${C.rose};
      }

      /* Botón retry */
      .qz-retry-btn {
        font-family: 'Dancing Script', cursive;
        font-size: 1.1rem;
        color: ${C.ink};
        background: linear-gradient(135deg, ${C.goldLt}, ${C.gold});
        border: none;
        border-radius: 50px;
        padding: 0.7rem 2rem;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(196,132,58,0.3);
        transition: transform 0.2s;
        margin-top: 0.5rem;
      }
      .qz-retry-btn:hover { transform: translateY(-2px); }

      @media (max-width: 480px) {
        .qz-card { padding: 1.5rem 1.1rem; }
      }
    `;
    document.head.appendChild(s);
  }

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

  /* ── Init ────────────────────────────────────────────────── */
  function init () {
    const container = document.getElementById('quizContainer');
    const startBtn  = document.getElementById('startQuizBtn');
    if (!container || !startBtn) return;

    injectStyles();

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