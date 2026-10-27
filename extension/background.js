/**
 * PaidAttention v2.1 — Security-Hardened Background Service Worker
 * Patched against:
 *  - EXT-01: Single-Active-Tab Mutex & 900ms rate-limiter per tick
 *  - EXT-04: Rejects privileged wallet actions (`INSTANT_REFUND_EXIT`, `TOP_UP_WALLET`) from content scripts
 *            and strictly clamps `deltaCost` and per-domain session caps inside the background worker.
 */

const MAX_TICK_RATE_USD = 0.0005;      // Hard ceiling of $0.0005 per second tick
const MAX_DOMAIN_SESSION_USD = 0.0500; // Hard ceiling per domain session in background worker
let lastTickTimestamp = 0;

const DEFAULT_STATE = {
  vaultBalance: 24.50,
  trialBalance: 2.00,
  spentToday: 0.42,
  dailyCap: 3.00,
  spentMonth: 18.60,
  monthlyCap: 90.00,
  qualityPoolEnabled: true,
  domainsVisited: {
    'en.wikipedia.org': { focusedSec: 195, paid: 0.0050, thumbedUp: true },
    'aliceblog.com':    { focusedSec: 140, paid: 0.0150, thumbedUp: true },
    'news.ycombinator.com': { focusedSec: 85, paid: 0.0082, thumbedUp: false }
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['openstreamState'], (res) => {
    if (!res.openstreamState) {
      chrome.storage.local.set({ openstreamState: DEFAULT_STATE });
    }
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Verify message originates from our own extension runtime
  if (!sender || sender.id !== chrome.runtime.id) {
    return false;
  }

  const isFromContentScript = Boolean(sender.tab);

  chrome.storage.local.get(['openstreamState'], (res) => {
    const state = res.openstreamState || DEFAULT_STATE;

    if (msg.type === 'GET_STATE') {
      sendResponse({ state });
      return;
    }

    if (msg.type === 'RECORD_ATTENTION_TICK') {
      // EXT-01 Fix: Only accept ticks from an active foreground tab, max once per 900ms
      if (isFromContentScript && (!sender.tab.active || sender.frameId !== 0)) {
        sendResponse({ error: 'Inactive tab or iframe blocked' });
        return;
      }
      const now = Date.now();
      if (now - lastTickTimestamp < 900) {
        sendResponse({ error: 'Rate limit exceeded' });
        return;
      }
      lastTickTimestamp = now;

      const domain = String(msg.domain || '').slice(0, 120);
      if (!domain) return;

      if (!state.domainsVisited[domain]) {
        state.domainsVisited[domain] = { focusedSec: 0, paid: 0, thumbedUp: false };
      }
      const entry = state.domainsVisited[domain];
      entry.focusedSec += 1;

      // EXT-04 Fix: Never trust unvalidated deltaCost from content script; clamp strictly
      const rawDelta = typeof msg.deltaCost === 'number' && isFinite(msg.deltaCost) ? msg.deltaCost : 0;
      const safeDelta = Math.max(0, Math.min(MAX_TICK_RATE_USD, rawDelta));

      if (
         entry.focusedSec > 5 &&
        safeDelta > 0 &&
        entry.paid < MAX_DOMAIN_SESSION_USD &&
        state.spentToday < state.dailyCap
      ) {
        const remainingDomainCap = Math.max(0, MAX_DOMAIN_SESSION_USD - entry.paid);
        const remainingDailyCap = Math.max(0, state.dailyCap - state.spentToday);
        const allowedDebit = Math.min(safeDelta, remainingDomainCap, remainingDailyCap);

        entry.paid += allowedDebit;
        state.spentToday += allowedDebit;
        state.spentMonth += allowedDebit;
        if (state.vaultBalance > 0) {
          state.vaultBalance = Math.max(0, state.vaultBalance - allowedDebit);
        }
        if (state.trialBalance > 0) {
          state.trialBalance = Math.max(0, state.trialBalance - allowedDebit);
        }
      }

      chrome.storage.local.set({ openstreamState: state }, () => {
        sendResponse({ state, domainEntry: entry });
      });
      return;
    }

    if (msg.type === 'TOGGLE_THUMBS_UP') {
      const domain = String(msg.domain || '').slice(0, 120);
      if (!domain) return;
      if (!state.domainsVisited[domain]) {
        state.domainsVisited[domain] = { focusedSec: 0, paid: 0, thumbedUp: false };
      }
      state.domainsVisited[domain].thumbedUp = !state.domainsVisited[domain].thumbedUp;
      chrome.storage.local.set({ openstreamState: state }, () => {
        sendResponse({ state, domainEntry: state.domainsVisited[domain] });
      });
      return;
    }

    // EXT-04 Fix: Privileged wallet/settings actions are ONLY allowed from the Extension Popup (never from a webpage tab!)
    if (isFromContentScript) {
      sendResponse({ error: 'Privileged action forbidden from content script' });
      return;
    }

    if (msg.type === 'TOGGLE_QUALITY_POOL') {
      state.qualityPoolEnabled = !state.qualityPoolEnabled;
      chrome.storage.local.set({ openstreamState: state }, () => {
        sendResponse({ state });
      });
      return;
    }

    if (msg.type === 'INSTANT_REFUND_EXIT') {
      state.vaultBalance = 0.00;
      chrome.storage.local.set({ openstreamState: state }, () => {
        sendResponse({ state });
      });
      return;
    }

    if (msg.type === 'TOP_UP_WALLET') {
      const addAmt = typeof msg.amount === 'number' ? Math.max(0, Math.min(200, msg.amount)) : 20;
      state.vaultBalance = Math.min(200, state.vaultBalance + addAmt);
      chrome.storage.local.set({ openstreamState: state }, () => {
        sendResponse({ state });
      });
      return;
    }
  });
  return true;
});
