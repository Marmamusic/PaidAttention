/**
 * OpenStream v2.0 — Ultra-Clean Minimalist Overlay Pill
 * - No URL displayed
 * - Simple 15s -> 0s countdown before meter starts
 * - Live $0.0001 / $0.015 counter next to icon-only 👍 button
 */

(function () {
  if (window.__openStreamContentScriptLoaded) return;
  window.__openStreamContentScriptLoaded = true;

  const domain = window.location.hostname || 'local-page.org';
  const osMeta = document.querySelector('meta[name="paidattention"], meta[name="openstream"]');
  const osGate = document.querySelector('paidattention-gate, openstream-gate');

  let tGrace = 15; // 15-second countdown before meter starts
  let tCap = 120;  // Hard session cap
  let pCap = 0.015; // $0.015 session cap

  if (osGate) {
    tGrace = parseFloat(osGate.getAttribute('t-grace') || '15');
    tCap = parseFloat(osGate.getAttribute('t-cap') || '90');
    pCap = parseFloat(osGate.getAttribute('p-init') || '0.015');
  } else if (osMeta) {
    tGrace = parseFloat(osMeta.getAttribute('data-t-grace') || '15');
    tCap = parseFloat(osMeta.getAttribute('data-t-cap') || '120');
    pCap = parseFloat(osMeta.getAttribute('data-p-cap') || '0.015');
  }

  let focusedSec = 0;
  let paidSoFar = 0;
  let thumbedUp = false;
  const tMid = (tGrace + tCap) / 2.2;
  const steepness = 0.12;

  function sigmoid(t) {
    return 1 / (1 + Math.exp(-steepness * (t - tMid)));
  }

  function computeSCurveCost(t) {
    if (t <= tGrace) return 0;
    if (t >= tCap) return pCap;
    const sT = sigmoid(t);
    const sG = sigmoid(tGrace);
    const sC = sigmoid(tCap);
    return Math.max(0.0001, pCap * ((sT - sG) / (sC - sG)));
  }

  // Create sleek, compact Shadow DOM pill in bottom-right corner
  const host = document.createElement('div');
  host.id = 'openstream-ambient-pill-host';
  host.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:2147483646;';
  const shadow = host.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <style>
      .os-pill {
        display: inline-flex; align-items: center; gap: 8px;
        background: rgba(13, 20, 36, 0.92); color: #f3f4f6;
        border: 1px solid #2a364f; border-radius: 999px;
        padding: 5px 10px; font-family: system-ui, -apple-system, sans-serif;
        font-size: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        backdrop-filter: blur(8px); user-select: none;
      }
      .os-dot {
        width: 7px; height: 7px; border-radius: 50%; background: #10b981;
        box-shadow: 0 0 6px #10b981; flex-shrink: 0;
      }
      .os-counter {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        color: #38bdf8; font-weight: 600; font-size: 12px;
        min-width: 28px; text-align: center;
      }
      .os-thumb {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 50%; width: 24px; height: 24px;
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 12px; cursor: pointer; padding: 0;
        transition: all 0.15s ease;
      }
      .os-thumb:hover {
        background: rgba(16, 185, 129, 0.25);
        border-color: #10b981;
      }
      .os-thumb.active {
        background: #10b981;
        border-color: #10b981;
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
      }
      .os-close {
        background: transparent; border: none; color: #6b7280;
        cursor: pointer; font-size: 13px; padding: 0 2px; line-height: 1;
      }
      .os-close:hover { color: #d1d5db; }
    </style>
    <div class="os-pill">
      <span class="os-dot" id="osDot"></span>
      <span class="os-counter" id="osCounter">${tGrace}s</span>
      <button class="os-thumb" id="osThumbBtn" title="Boost this page">👍</button>
      <button class="os-close" id="osHideBtn" title="Hide">×</button>
    </div>
  `;

  document.documentElement.appendChild(host);

  const dotEl = shadow.getElementById('osDot');
  const counterEl = shadow.getElementById('osCounter');
  const thumbBtn = shadow.getElementById('osThumbBtn');
  const hideBtn = shadow.getElementById('osHideBtn');

  // Sync initial state from background
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (res) => {
      if (res && res.state && res.state.domainsVisited && res.state.domainsVisited[domain]) {
        const saved = res.state.domainsVisited[domain];
        thumbedUp = !!saved.thumbedUp;
        thumbBtn.classList.toggle('active', thumbedUp);
      }
    });
  }

  hideBtn.addEventListener('click', () => {
    host.style.display = 'none';
  });

  thumbBtn.addEventListener('click', () => {
    thumbedUp = !thumbedUp;
    thumbBtn.classList.toggle('active', thumbedUp);
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'TOGGLE_THUMBS_UP', domain });
    }
  });

  setInterval(() => {
    const active = document.hasFocus() && !document.hidden;
    if (!active) {
      dotEl.style.background = '#f59e0b';
      dotEl.style.boxShadow = 'none';
      return;
    }

    dotEl.style.background = '#10b981';
    dotEl.style.boxShadow = '0 0 6px #10b981';
    focusedSec += 1;

    const newCost = computeSCurveCost(focusedSec);
    const deltaCost = Math.max(0, newCost - paidSoFar);
    paidSoFar = newCost;

    if (focusedSec < tGrace) {
      const countdown = Math.max(0, Math.ceil(tGrace - focusedSec));
      counterEl.textContent = `${countdown}s`;
    } else {
      counterEl.textContent = `$${paidSoFar.toFixed(4)} / $${pCap.toFixed(3)}`;
    }

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({
        type: 'RECORD_ATTENTION_TICK',
        domain,
        deltaSec: 1,
        deltaCost,
        currentPaid: paidSoFar
      });
    }
  }, 1000);
})();
