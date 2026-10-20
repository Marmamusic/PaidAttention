/**
 * OpenStream v2.0 — Background Service Worker (Streamlined & Jargon-Free)
 */

const DEFAULT_STATE = {
  vaultBalance: 24.50,
  trialBalance: 2.00,
  spentToday: 0.42,
  dailyCap: 3.00,
  spentMonth: 18.60,
  monthlyCap: 90.00,
  qualityPoolEnabled: true, // Toggleable in Advanced Settings
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
  chrome.storage.local.get(['openstreamState'], (res) => {
    const state = res.openstreamState || DEFAULT_STATE;

    if (msg.type === 'GET_STATE') {
      sendResponse({ state });
      return;
    }

    if (msg.type === 'RECORD_ATTENTION_TICK') {
      const { domain, deltaSec, deltaCost, currentPaid } = msg;
      if (!state.domainsVisited[domain]) {
        state.domainsVisited[domain] = { focusedSec: 0, paid: 0, thumbedUp: false };
      }
      const entry = state.domainsVisited[domain];
      entry.focusedSec += deltaSec;

      if (deltaCost > 0 && state.spentToday < state.dailyCap) {
        entry.paid += deltaCost;
        state.spentToday += deltaCost;
        state.spentMonth += deltaCost;
        if (state.vaultBalance > 0) {
          state.vaultBalance = Math.max(0, state.vaultBalance - deltaCost);
        }
        if (state.trialBalance > 0) {
          state.trialBalance = Math.max(0, state.trialBalance - deltaCost);
        }
      } else if (typeof currentPaid === 'number' && currentPaid > entry.paid) {
        entry.paid = currentPaid;
      }

      chrome.storage.local.set({ openstreamState: state }, () => {
        sendResponse({ state, domainEntry: entry });
      });
      return;
    }

    if (msg.type === 'TOGGLE_THUMBS_UP') {
      const { domain } = msg;
      if (!state.domainsVisited[domain]) {
        state.domainsVisited[domain] = { focusedSec: 0, paid: 0, thumbedUp: false };
      }
      state.domainsVisited[domain].thumbedUp = !state.domainsVisited[domain].thumbedUp;
      chrome.storage.local.set({ openstreamState: state }, () => {
        sendResponse({ state, domainEntry: state.domainsVisited[domain] });
      });
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
      state.vaultBalance = Math.min(200, state.vaultBalance + (msg.amount || 20));
      chrome.storage.local.set({ openstreamState: state }, () => {
        sendResponse({ state });
      });
      return;
    }
  });
  return true;
});
