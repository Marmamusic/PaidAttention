/**
 * OpenStream v2.0 — Streamlined Extension Popup Controller
 */

let currentDomain = 'example.com';

function showView(viewId) {
  ['mainView', 'creatorView', 'infoView', 'settingsView'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== viewId);
  });
}

function initPopup() {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        try {
          const url = new URL(tabs[0].url);
          if (url.hostname) currentDomain = url.hostname;
        } catch (_) {}
      }
      refreshUI();
    });
  } else {
    refreshUI();
  }

  // Keep stats live while popup is open
  setInterval(refreshUI, 1000);
}

function updateCreatorSnippets() {
  const walletInput = document.getElementById('creatorWalletInput');
  const walletAddr = walletInput ? walletInput.value.trim() || '0x71C4...89A2' : '0x71C4...89A2';
  const directEl = document.getElementById('directMetaCode');
  const urlEl = document.getElementById('urlMetaCode');
  if (directEl) directEl.textContent = `<meta name="paidattention" content="wallet:${walletAddr}" />`;
  if (urlEl) urlEl.textContent = `<meta name="paidattention" content="domain:${currentDomain}" />`;
}

function refreshUI() {
  document.getElementById('activeDomainText').textContent = currentDomain;
  updateCreatorSnippets();

  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (res) => {
      if (!res || !res.state) return;
      renderState(res.state);
    });
  }
}

function renderState(state) {
  const entry = state.domainsVisited[currentDomain] || { focusedSec: 0, paid: 0.0000, thumbedUp: false };

  // Top rate indicator: $0.0000/s during first 15s countdown or after $0.015 cap
  const isCountingDown = entry.focusedSec < 15;
  const isCapped = entry.paid >= 0.015;
  const liveRate = (isCountingDown || isCapped) ? '0.0000' : '0.0002';
  document.getElementById('extOdometer').textContent = `$${liveRate}/s`;

  if (isCountingDown) {
    const rem = Math.max(0, 15 - entry.focusedSec);
    document.getElementById('activeFocusStats').textContent = `Starts in ${rem}s • Paid: $0.0000`;
  } else {
    document.getElementById('activeFocusStats').textContent = `Focused: ${entry.focusedSec}s • Paid: $${entry.paid.toFixed(4)}`;
  }

  const thumbBtn = document.getElementById('popupThumbsUpBtn');
  thumbBtn.classList.toggle('active', entry.thumbedUp);
  thumbBtn.textContent = entry.thumbedUp ? '👍 Boosted' : '👍 Boost';

  document.getElementById('vaultBalText').textContent = `$${state.vaultBalance.toFixed(2)}`;
  document.getElementById('trialBalText').textContent = `$${state.trialBalance.toFixed(2)} left`;
  document.getElementById('dailySpentText').textContent = `$${state.spentToday.toFixed(2)} / $${state.dailyCap.toFixed(2)}`;

  const poolBtn = document.getElementById('toggleQualityPoolBtn');
  if (poolBtn) {
    const on = state.qualityPoolEnabled !== false;
    poolBtn.classList.toggle('active', on);
    poolBtn.textContent = on ? 'ON' : 'OFF';
  }
}

// Navigation Listeners
document.getElementById('openInfoBtn').addEventListener('click', () => showView('infoView'));
document.getElementById('walletMoreInfoBtn').addEventListener('click', () => showView('infoView'));
document.getElementById('openSettingsBtn').addEventListener('click', () => showView('settingsView'));
document.getElementById('openCreatorViewBtn').addEventListener('click', () => showView('creatorView'));

document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => showView(btn.getAttribute('data-back') || 'mainView'));
});

// Action Listeners
document.getElementById('popupThumbsUpBtn').addEventListener('click', () => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({ type: 'TOGGLE_THUMBS_UP', domain: currentDomain }, (res) => {
      if (res && res.state) renderState(res.state);
    });
  }
});

document.getElementById('instantExitBtn').addEventListener('click', () => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({ type: 'INSTANT_REFUND_EXIT' }, (res) => {
      if (res && res.state) renderState(res.state);
    });
  }
});

document.getElementById('topUpBtn').addEventListener('click', () => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({ type: 'TOP_UP_WALLET', amount: 20 }, (res) => {
      if (res && res.state) renderState(res.state);
    });
  }
});

document.getElementById('toggleQualityPoolBtn').addEventListener('click', () => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({ type: 'TOGGLE_QUALITY_POOL' }, (res) => {
      if (res && res.state) renderState(res.state);
    });
  }
});

document.getElementById('creatorWalletInput').addEventListener('input', updateCreatorSnippets);

const extConnectBtn = document.getElementById('extConnectMetaMaskBtn');
if (extConnectBtn) {
  extConnectBtn.addEventListener('click', () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'REQUEST_METAMASK_ADDRESS' }, (res) => {
            if (res && res.address) {
              document.getElementById('creatorWalletInput').value = res.address;
              extConnectBtn.textContent = '✅ Linked';
              updateCreatorSnippets();
            } else {
              extConnectBtn.textContent = 'Paste 0x';
            }
          });
        }
      });
    }
  });
}

document.getElementById('copyDirectMetaBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('directMetaCode').textContent);
  const btn = document.getElementById('copyDirectMetaBtn');
  btn.textContent = '✅ Copied Direct Wallet Tag!';
  setTimeout(() => { btn.textContent = '📋 Copy Direct Wallet Tag'; }, 1600);
});

document.getElementById('copyUrlMetaBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('urlMetaCode').textContent);
  const btn = document.getElementById('copyUrlMetaBtn');
  btn.textContent = '✅ Copied!';
  setTimeout(() => { btn.textContent = '📋 Copy URL Tag'; }, 1600);
});

document.getElementById('claimPasskeyBtn').addEventListener('click', () => {
  const statusEl = document.getElementById('claimResultText');
  statusEl.textContent = `✅ Verified ${currentDomain}! Choose Passkey Wallet (instant) or Bank IBAN (1-2 days).`;
});

initPopup();
