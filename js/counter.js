/* ================================================================
   counter.js — Contador de tiempo juntos + barra de progreso
================================================================ */

(function () {

  const START_DATE  = window.CONFIG ? CONFIG.START_DATE : new Date('2026-02-08T00:00:00');
  const TARGET_DATE = window.CONFIG ? CONFIG.TARGET_DATE : new Date('2026-08-08T00:00:00');

  /* ── Elementos ───────────────────────────────────────────── */
  let displayEl, progressEl, intervalId;

  /* ── Formatear número con cero a la izquierda ────────────── */
  const pad = n => String(Math.floor(Math.abs(n))).padStart(2, '0');

  /* ── Calcular y renderizar ───────────────────────────────── */
  function tick () {
    const now   = new Date();
    const diff  = now - START_DATE;          // milisegundos transcurridos

    if (diff < 0) {
      displayEl.innerHTML = '<span style="font-size:1rem;color:var(--sepia-light)">Pronto empieza todo ✨</span>';
      return;
    }

    const totalSec  = Math.floor(diff / 1000);
    const days      = Math.floor(totalSec / 86400);
    const hours     = Math.floor((totalSec % 86400) / 3600);
    const minutes   = Math.floor((totalSec % 3600)  / 60);
    const seconds   = totalSec % 60;

    /* ── Texto del contador ─────────────────────────────────── */
    displayEl.innerHTML = `
      <div class="counter-units">
        <div class="counter-unit">
          <span class="counter-num">${days}</span>
          <span class="counter-lbl">día${days !== 1 ? 's' : ''}</span>
        </div>
        <span class="counter-sep">:</span>
        <div class="counter-unit">
          <span class="counter-num">${pad(hours)}</span>
          <span class="counter-lbl">horas</span>
        </div>
        <span class="counter-sep">:</span>
        <div class="counter-unit">
          <span class="counter-num">${pad(minutes)}</span>
          <span class="counter-lbl">min</span>
        </div>
        <span class="counter-sep">:</span>
        <div class="counter-unit">
          <span class="counter-num">${pad(seconds)}</span>
          <span class="counter-lbl">seg</span>
        </div>
      </div>
    `;

    /* ── Barra de progreso hacia los 6 meses ────────────────── */
    if (progressEl) {
      const total     = TARGET_DATE - START_DATE;
      const elapsed   = Math.min(diff, total);
      const pct       = Math.max(0, Math.min(100, (elapsed / total) * 100));
      progressEl.style.width = pct.toFixed(2) + '%';
    }
  }

  function injectStyles () {
    if (document.getElementById('counter-styles')) return;
    const s = document.createElement('style');
    s.id = 'counter-styles';
    s.textContent = `
      .counter-units {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        flex-wrap: wrap;
        row-gap: 0.5rem;
      }
      .counter-unit {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 38px;
      }
      .counter-num {
        font-family: var(--font-display);
        font-size: clamp(1.4rem, 4vw, 2rem);
        font-weight: 600;
        color: var(--rose);
        line-height: 1;
      }
      .counter-lbl {
        font-size: 0.62rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--sepia-light);
        margin-top: 0.15rem;
      }
      .counter-sep {
        font-family: var(--font-display);
        font-size: 1.4rem;
        font-weight: 300;
        color: var(--rose-light);
        align-self: flex-start;
        margin-top: 0.1rem;
        line-height: 1.3;
      }
    `;
    document.head.appendChild(s);
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init () {
    displayEl  = document.getElementById('counterContent');
    progressEl = document.getElementById('milestoneProgress');

    if (!displayEl) return;

    injectStyles();
    tick();
    intervalId = setInterval(tick, 1000);
  }

  function destroy () { clearInterval(intervalId); }

  window.Counter = { init, destroy };

})();