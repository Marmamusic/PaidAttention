/**
 * OpenStream (MicroPay) v2.0 — Complete Interactive Protocol Engine
 * Implements all 14 architectural pillars:
 *  1. Anti-Clickbait S-Curve P(t) & 24h-48h Attention Epoch Reset (1.5x anti-restreaming bound)
 *  2. Creator-Defined Collective Buyout Target (R_target), Two-Axis Oracle & Pricing Rationale Box
 *  3. Zero-Sum K/N Thumbs-Up Quality Withholding Pool (50% Floor / +100% Boost Cap)
 *  4. Enterprise Platform Splits (Netflix 100% / YouTube 30-70%) & Multi-Creator Royalty Splitters
 *  5. Paywall-Free Open-Web Patronage Mode (UN_PAYWALLED)
 *  6. EU AI Act Open-Source RAG Attribution Royalties (25% AI / 75% Cited Creators + DNS Escrow)
 *  7. Animated Electric Utility Meter Odometer & 3D Metaverse Spatial Trigger API
 *  8. Promotional $2.00 Virtual Trial Meter (Auto-sunsets at 1M organic users) + Subscription Receipt
 *  9. Non-Amendable External Custody (ImmutableUserVault.sol: $200 Max Cap, 1-Tap Exit, 60-Day FIFO Refund)
 * 10. Dual-Sided ZK/Stealth Privacy + Regional Human Value Index (HVI) Cultural Leaderboard
 * 11. 100% On-Device Private History (Chronological List + 2D Price-Time Timeline Graph)
 * 12. Anti-Cartel Historical Inflation Tracker & Personal $/min Approval Ceiling
 * 13. Macroeconomic Purchasing-Power Thermostat (gamma_macro)
 * 14. OpenStream Commons DAO (Encrypted-Locale Grants) & 1/3 Founder-Arbitrated On-Chain Code Registry
 */

// ============================================================================
// 1. CATEGORY MARKET ORACLE BASELINES (2026 Base, EMA Price/Min, StdDev, Avg R_target)
// ============================================================================
const CATEGORY_ORACLE = {
  ARTICLE:       { label: '📰 Article',          base2026: 0.045, mu: 0.045, sigma: 0.015, avgTarget: 500 },
  AUDIO:         { label: '🎵 Audio Stream',     base2026: 0.018, mu: 0.018, sigma: 0.006, avgTarget: 5000 },
  VIDEO:         { label: '🎬 4K Video',         base2026: 0.055, mu: 0.055, sigma: 0.018, avgTarget: 50000 },
  UN_PAYWALLED:  { label: '🌐 Open-Web Free',    base2026: 0.005, mu: 0.005, sigma: 0.002, avgTarget: 100 },
  AI_COMPUTE:    { label: '🤖 AI Act RAG',       base2026: 0.095, mu: 0.095, sigma: 0.025, avgTarget: 25000 },
  ONLINE_LESSON: { label: '🎓 Lesson / 3D World',base2026: 0.060, mu: 0.060, sigma: 0.020, avgTarget: 10000 }
};

// ============================================================================
// 2. UNIVERSAL DIGITAL CONTENT, AI & METAVERSE CATALOG
// ============================================================================
const CONTENT_CATALOG = [
  {
    id: '0x9a1f...e401',
    title: 'Frontline Dispatch: Investigative Report from the Conflict Zone',
    creator: 'st:eth:0x71C4...89A2 (Stealth Journalist DAO)',
    category: 'ARTICLE',
    pInit: 0.1200,
    pFloor: 0.0060,
    rTarget: 1000.00, // Collective buyout target: $1,000
    tGrace: 8,
    tMid: 28,
    tCap: 60,
    steepness: 0.14,
    totalRevenue: 420.50,
    thumbsUpCount: 312,
    userThumbedUp: true,
    platformSplitText: '0% Platform / 100% Co-Authors (60%/40%)',
    rationale: 'Independent war-zone reporting; $1,000 collective buyout covers satellite uplink, local fixer insurance, and armored transport.',
    regionTag: 'EU_FR',
    cultureLabel: '🇪🇺 Investigative Journalism (EN/FR)',
    chunks: [
      '<strong>[Free Preview — 8s Anti-Clickbait Grace]</strong> During the first 8 seconds, your Electric Utility Meter reads $0.00000/s. If you bounce now, you pay zero.',
      '<strong>[Chunk #2 — Blinded ZK Voucher Streaming]</strong> Because 42% of the $1,000 Collective Buyout Target ($R_target) has already been funded by earlier readers, your session cap is already discounted!',
      '<strong>[Chunk #3 — Multi-Author Split]</strong> Proceeds split automatically on-chain: 60% to the frontline reporter\'s ERC-5564 Stealth Address and 40% to the local photojournalist.',
      '<strong>[Chunk #4 — Cap Reached]</strong> Marginal rate is now $0.0000/s for the current 36h Attention Epoch (max 1.5x quota to block restreaming proxies).'
    ]
  },
  {
    id: '0x6c2d...77a4',
    title: 'Zero-Knowledge Horizons (Netflix / YouTube Enterprise Split Demo)',
    creator: 'st:eth:0x88E2...91D4 (CipherFilms × StreamGiant)',
    category: 'VIDEO',
    pInit: 0.2200,
    pFloor: 0.0120,
    rTarget: 25000.00,
    tGrace: 12,
    tMid: 45,
    tCap: 100,
    steepness: 0.11,
    totalRevenue: 14200.00,
    thumbsUpCount: 1280,
    userThumbedUp: true,
    platformSplitText: '30% Platform CDN / 70% Studio (3-Wallet Split)',
    rationale: '4K HDR indie documentary; $25,000 collective buyout target amortizes production across global viewers, dropping price to $0.012 floor.',
    regionTag: 'NA_EN',
    cultureLabel: '🇺🇸 Sci-Tech Documentary (EN)',
    chunks: [
      '🎬 <strong>[HLS Segment #0 — Free 12s Grace]</strong> Enterprise Streaming Mode: Supports 100% platform buyout (Netflix model) or 30%/70% platform/creator split (YouTube model).',
      '🎞️ <strong>[HLS Segment #1 — Decrypted]</strong> $14,200 of the $25,000 Collective Buyout Target has been reached globally (56.8% socialized!).',
      '🎞️ <strong>[HLS Segment #2 — Decrypted]</strong> Your 👍 Thumbs-Up boosts this film\'s payout up to +100% from your K/N quality pool without increasing your daily spend.',
      '🏆 <strong>[Documentary Cap Reached]</strong> Unlocked for 36h epoch.'
    ]
  },
  {
    id: '0x44f0...open',
    title: 'Open Encyclopedia Commons: Quantum Cryptography (Paywall-Free Mode)',
    creator: 'st:eth:0xWiki...001A (Open Knowledge Foundation)',
    category: 'UN_PAYWALLED',
    pInit: 0.0050,
    pFloor: 0.0040,
    rTarget: 100.00,
    tGrace: 15,
    tMid: 30,
    tCap: 60,
    steepness: 0.12,
    totalRevenue: 88.40,
    thumbsUpCount: 940,
    userThumbedUp: false,
    platformSplitText: '0% Platform / 100% Open Commons',
    rationale: 'UN_PAYWALLED Passive Patronage Category: 100% accessible to everyone even without the plugin. Users with OpenStream stream a tiny $0.004 floor after 15s.',
    regionTag: 'GLOBAL',
    cultureLabel: '🌐 Global Open Commons',
    chunks: [
      '🌐 <strong>[100% Un-Paywalled Open Web Content]</strong> Notice that ALL paragraphs on this page are completely unblurred from second 0! Visitors without OpenStream read for free with zero ads.',
      '💚 <strong>[Automatic Passive Patronage]</strong> Because you have OpenStream installed, after the 15-second grace period your wallet streams a tiny $0.004 floor contribution—replacing annoying fundraising banners forever.',
      '📚 <strong>[Collective Knowledge]</strong> Every contributor who edited this entry receives a micro-share via the on-chain multi-wallet splitter.',
      '✨ <strong>[Cap Reached]</strong> Thank you for sustaining the open web!'
    ]
  },
  {
    id: '0x5f9a...00e2',
    title: 'Mistral/Qwen Open-RAG Cluster (EU AI Act Source-Attribution Split)',
    creator: 'st:eth:0x12A9...77C1 (OpenCompute × Cited Creators)',
    category: 'AI_COMPUTE',
    pInit: 0.1400,
    pFloor: 0.0200,
    rTarget: 15000.00,
    tGrace: 5,
    tMid: 28,
    tCap: 70,
    steepness: 0.15,
    totalRevenue: 6400.00,
    thumbsUpCount: 615,
    userThumbedUp: false,
    platformSplitText: '25% AI Compute / 75% Cited Human Sources (EU AI Act)',
    rationale: 'Open-source attribution algorithm (Hash: 0x8a91...f02c) registered under EU AI Act Art. 53. Automatically routes 75% of prompt fees to the web sources cited in the response!',
    regionTag: 'ASIA_JP',
    cultureLabel: '🇯🇵🇪🇺 Open-Source AI & Research',
    chunks: [
      '🤖 <strong>[EU AI Act Verified Attribution Router — 5s Grace]</strong> Algorithm Commit Hash <code>0x8a91...f02c</code> verified on-chain.',
      '<div class="ai-sandbox-box">&gt; Query: Explain zero-knowledge stealth addresses.<br/>&gt; <strong>[Signed Citation Manifest Generated]:</strong><br/>  • 25% → Mistral/Qwen GPU Node<br/>  • 40% → vitalik.eth.limo (Registered Creator)<br/>  • 20% → wikipedia.org/Stealth_address<br/>  • 15% → eprint.iacr.org (Held in DNSSEC Domain Escrow)</div>',
      '<div class="ai-sandbox-box">&gt; [On-Chain Split Verified]: 75% of your micropayment flowed directly to the human authors whose data trained &amp; informed this AI answer!</div>',
      '⚡ <strong>[Session Compute Cap Reached]</strong> Continue querying at $0/s marginal cost.'
    ]
  },
  {
    id: '0x7e41...55b8',
    title: 'Decentraland 3D Cyber-Museum (Spatial Trigger API Demo)',
    creator: 'st:eth:0x55D0...12E8 (Metaverse Architects Guild)',
    category: 'ONLINE_LESSON',
    pInit: 0.1600,
    pFloor: 0.0100,
    rTarget: 8000.00,
    tGrace: 10,
    tMid: 38,
    tCap: 85,
    steepness: 0.12,
    totalRevenue: 5120.00,
    thumbsUpCount: 520,
    userThumbedUp: false,
    platformSplitText: '15% Metaverse Host / 85% 3D Artists Guild',
    rationale: '3D Spatial Trigger API: Meter starts when your avatar steps inside the virtual museum parcel (-42, 18) and pauses the instant you step outside.',
    regionTag: 'LATAM_ES',
    cultureLabel: '🇧🇷🇲🇽 3D Digital Art & Architecture',
    chunks: [
      '🕹️ <strong>[Spatial Trigger API: Avatar Stepped Inside Parcel (-42, 18)]</strong> <code>OpenStream.SpatialTrigger.enterZone("0x7e41...55b8")</code> fired! First 10 seconds inside the museum are free.',
      '🏛️ <strong>[Main Gallery Wing Unlocked]</strong> Streaming micro-royalties to 4 collaborating 3D sculptors while your avatar explores the exhibit.',
      '🎨 <strong>[Interactive Hologram Exhibit]</strong> Click "🕹️ Toggle 3D Zone" below to simulate walking your avatar out of the museum—pausing the meter immediately!',
      '🏅 <strong>[Museum Day-Pass Cap Reached]</strong> Explore the entire 3D museum for the next 36 hours at $0/s.'
    ]
  },
  {
    id: '0xdead...beef',
    title: '🔥 SHOCKING: Secret Strategy Prints 1000x Overnight!! (Outlier Trap)',
    creator: 'st:eth:0x99F1...666B (Clickbait Farm Ltd)',
    category: 'ARTICLE',
    pInit: 0.7500,
    pFloor: 0.5000,
    rTarget: 5000000.00, // Absurd $5M buyout target for an article!
    tGrace: 7,
    tMid: 22,
    tCap: 50,
    steepness: 0.18,
    totalRevenue: 12.00,
    thumbsUpCount: 1,
    userThumbedUp: false,
    isOutlierDemo: true,
    platformSplitText: '100% Single Wallet',
    rationale: '"We charge $0.90/min and set a $5,000,000 buyout target because our secret crypto alpha is priceless!!" (Flagged by Two-Axis Oracle!)',
    regionTag: 'GLOBAL',
    cultureLabel: '⚠️ Flagged Outlier',
    chunks: [
      '🚨 <strong>[Free Grace Window — 0s to 7s]</strong> Watch the Two-Axis Guardrail catch BOTH the predatory $/min rate (+3.9σ) AND the absurd $5,000,000 R_target at t = 7.0s!',
      '⚠️ <strong>[Manual Override Active]</strong> Even if someone accidentally watched this without upvoting, the K/N Thumbs-Up Pool penalizes 0-upvote content down toward the 50% floor.',
      '💸 <strong>[Chunk #3]</strong> 99% of users click "Leave Content" when the Outlier Modal displays this creator\'s weak rationale.',
      '🛑 <strong>[Cap Reached]</strong> Hard cap reached.'
    ]
  }
];

// ============================================================================
// 3. APPLICATION STATE
// ============================================================================
const state = {
  selectedContentId: CONTENT_CATALOG[0].id,
  focusedSeconds: 0.0,
  isWindowFocused: true,
  manualBlurSimulated: false,
  outlierApprovedForSession: false,
  outlierModalOpen: false,

  // Immutable User Vault ($200 Max Cap & FIFO Tranches)
  userBalance: 24.5000,
  maxVaultCap: 200.0000,
  fifoTranches: [
    { funder: '0xWalletA...11F0 (Main)', initial: 20.00, remaining: 14.5000 },
    { funder: '0xWalletB...88C2 (Hardware)', initial: 10.00, remaining: 10.0000 }
  ],

  // Promotional $2.00 Virtual Trial (< 1,000,000 Organic Users)
  trialBalance: 1.4200,
  organicUsers: 142800,
  trialUserCap: 1000000,

  // Daily ($3) & Monthly ($90) Guardrails
  dailyCap: 3.0000,
  spentToday: 0.4200,
  monthlyCap: 90.0000,
  spentThisMonth: 28.1200,
  sessionCostPaid: 0.0000,
  sessionNonce: 1042,
  attentionEpoch: 1,
  epochTTLHours: 36,

  // Anti-Cartel & Personal Ceiling
  cartelCreepPercent: 0,
  personalMaxRatePerMin: 0.120,

  // Pooled DeFi Yield & 1% Dev Pledge / OpenStream Commons DAO
  poolTVL: 142850.00,
  yieldReserveUSD: 18.420910,
  devPledgeDuration: '1m',
  devTreasuryUSD: 0.014200,
  taoGrantPoolUSD: 14820.50,
  founderGovTokens: 500000,
  daoGovTokens: 1000000,

  // Macroeconomic Purchasing-Power Thermostat
  avgNetworkMonthlySpend: 68.0,
  medianMonthlySalary: 4300.0,
  maxSalaryShareRatio: 0.022,
  baseMacroCap2026: 95.0,
  inflationPercent: 0.0,
  gammaMacro: 1.0,
  macroEffectiveCeiling: 94.60,

  // 100% On-Device Private Consumption History (for List + 2D Price-Time Curve)
  privateHistory: [
    { timeMin: 2,  title: 'The Post-Subscription Era', category: 'ARTICLE', ratePerMin: 0.042, paid: 0.0420, thumbed: true },
    { timeMin: 8,  title: 'Solaris Modular Synth Session', category: 'AUDIO', ratePerMin: 0.014, paid: 0.0210, thumbed: true },
    { timeMin: 16, title: 'Open Encyclopedia: Quantum', category: 'UN_PAYWALLED', ratePerMin: 0.004, paid: 0.0040, thumbed: false },
    { timeMin: 25, title: 'Zero-Knowledge Horizons 4K', category: 'VIDEO', ratePerMin: 0.058, paid: 0.0950, thumbed: true },
    { timeMin: 34, title: 'Mistral/Qwen EU AI Act RAG', category: 'AI_COMPUTE', ratePerMin: 0.072, paid: 0.0680, thumbed: false },
    { timeMin: 42, title: 'Decentraland 3D Cyber-Museum', category: 'ONLINE_LESSON', ratePerMin: 0.049, paid: 0.0590, thumbed: true }
  ],

  // OpenStream Commons DAO Regional Proposals
  taoProposals: [
    { id: 1, locale: 'LOCALE_PARIS_FR', title: '🇫🇷 Paris Indie Journalism & Documentary Festival', requested: 2400, votes: 842, voted: false },
    { id: 2, locale: 'LOCALE_BERLIN_DE', title: '🇩🇪 Berlin Open-Source Modular Synth & Web3 Audio Lab', requested: 1850, votes: 619, voted: false },
    { id: 3, locale: 'LOCALE_TOKYO_JP', title: '🇯🇵 Tokyo Open-RAG Japanese Commons Dataset Initiative', requested: 3100, votes: 1104, voted: false },
    { id: 4, locale: 'LOCALE_MONTREAL_CA', title: '🇨🇦 Montréal 3D Metaverse & Public Art Commons', requested: 1500, votes: 490, voted: false }
  ],

  // Blinded ZK Co-Signers
  coSigners: [
    { user: 'zkNote:0x38A1...92C4', seconds: 54, amount: 0.0682, sig: 'zkSNARK_8f2a' },
    { user: 'zkNote:0x9F20...44B1', seconds: 60, amount: 0.0745, sig: 'zkSNARK_4d11' },
    { user: 'zkNote:0xC108...67E9', seconds: 39, amount: 0.0418, sig: 'zkSNARK_2b99' }
  ]
};

// ============================================================================
// 4. MATHEMATICAL PRICING, K/N THUMBS-UP POOL & COLLECTIVE BUYOUT ENGINE
// ============================================================================

function computeMacroThermostat() {
  const cpiCeiling = state.baseMacroCap2026 * (1 + state.inflationPercent / 100);
  const salaryCeiling = state.medianMonthlySalary * state.maxSalaryShareRatio;
  state.macroEffectiveCeiling = Math.min(cpiCeiling, salaryCeiling);

  if (state.avgNetworkMonthlySpend <= state.macroEffectiveCeiling) {
    state.gammaMacro = 1.0;
  } else {
    state.gammaMacro = state.macroEffectiveCeiling / state.avgNetworkMonthlySpend;
  }
}

function getSelectedContent() {
  return CONTENT_CATALOG.find(c => c.id === state.selectedContentId);
}

/**
 * Creator-Defined Collective Buyout Curve:
 * Reaches P_floor when R_total >= R_target, modulated by gamma_macro.
 */
function computeCurrentPMax(item, customRTotal = null) {
  if (item.category === 'UN_PAYWALLED') {
    return item.pFloor * state.gammaMacro;
  }
  const rTotal = customRTotal !== null ? customRTotal : item.totalRevenue;
  const progress = Math.min(1.0, rTotal / Math.max(1, item.rTarget));
  const rawPMax = item.pFloor + (item.pInit - item.pFloor) * Math.pow(1 - progress, 1.35);
  return rawPMax * state.gammaMacro;
}

function logisticSigmoid(t, tMid, k) {
  return 1 / (1 + Math.exp(-k * (t - tMid)));
}

function computeCumulativeCost(item, t) {
  const pMax = computeCurrentPMax(item);
  if (t < item.tGrace) return 0;
  if (t >= item.tCap) return pMax;

  const sT = logisticSigmoid(t, item.tMid, item.steepness);
  const sGrace = logisticSigmoid(item.tGrace, item.tMid, item.steepness);
  const sCap = logisticSigmoid(item.tCap, item.tMid, item.steepness);

  return pMax * ((sT - sGrace) / (sCap - sGrace));
}

function computeMarginalRate(item, t) {
  if (t < item.tGrace || t >= item.tCap) return 0;
  const dt = 0.25;
  return (computeCumulativeCost(item, t + dt) - computeCumulativeCost(item, Math.max(item.tGrace, t - dt))) / (2 * dt);
}

/**
 * Zero-Sum K/N Thumbs-Up Withholding Pool (50% Floor / +100% Boost Cap)
 */
function computeThumbsUpPoolStats() {
  const n = CONTENT_CATALOG.length;
  const k = CONTENT_CATALOG.filter(c => c.userThumbedUp).length;
  let rho = 0;
  if (k > 0 && k < n) {
    rho = Math.min(0.50, k / n); // Capped at 50% so non-upvoted never get < 50%
  }
  const nonUpvotedMult = 1 - rho;
  const rawBoostMult = k > 0 && k < n ? nonUpvotedMult + (rho * n) / k : 1.0;
  const upvotedMult = Math.min(2.00, rawBoostMult); // Capped at 2.00x (+100% boost)
  return { k, n, rho, nonUpvotedMult, upvotedMult };
}

/**
 * Two-Axis Market Band & Anti-Cartel Check
 */
function computeMarketBandMetrics(item) {
  const pMax = computeCurrentPMax(item);
  const ratePerMin = pMax / (item.tCap / 60);
  const oracle = CATEGORY_ORACLE[item.category];

  // If creators coordinate a cartel price hike, compare against CPI-anchored 2026 baseline!
  const cpiBaseline = oracle.base2026 * (1 + state.inflationPercent / 100);
  const inflatedMovingAvg = oracle.mu * (1 + state.cartelCreepPercent / 100);
  const isCartelDrifting = inflatedMovingAvg > cpiBaseline * 1.05;

  const refMean = isCartelDrifting ? cpiBaseline : inflatedMovingAvg;
  const zScore = (ratePerMin - refMean) / oracle.sigma;
  const rTargetRatio = item.rTarget / oracle.avgTarget;
  const exceedsPersonalCeiling = ratePerMin > state.personalMaxRatePerMin;

  return {
    pMax,
    ratePerMin,
    mu: refMean,
    sigma: oracle.sigma,
    zScore,
    rTargetRatio,
    isCartelDrifting,
    isOutlier: zScore > 1.5 || rTargetRatio > 5.0 || exceedsPersonalCeiling
  };
}

// ============================================================================
// 5. FIFO VAULT DEBITING & UI UPDATES
// ============================================================================

function debitUserVaultFIFO(deltaCost) {
  if (deltaCost <= 0) return;
  state.userBalance = Math.max(0, state.userBalance - deltaCost);
  state.spentToday += deltaCost;
  state.spentThisMonth += deltaCost;

  // Also decrement virtual $2 trial meter if active (< 1M users)
  if (state.organicUsers < state.trialUserCap && state.trialBalance > 0) {
    state.trialBalance = Math.max(0, state.trialBalance - deltaCost);
  }

  // Spend oldest FIFO tranche first
  let rem = deltaCost;
  for (let i = 0; i < state.fifoTranches.length && rem > 0; i++) {
    const t = state.fifoTranches[i];
    if (t.remaining > 0) {
      const cut = Math.min(t.remaining, rem);
      t.remaining -= cut;
      rem -= cut;
    }
  }
}

function renderCatalog() {
  const listEl = document.getElementById('contentCatalogList');
  listEl.innerHTML = '';

  CONTENT_CATALOG.forEach(item => {
    const metrics = computeMarketBandMetrics(item);
    const buyoutPct = Math.min(100, Math.round((item.totalRevenue / item.rTarget) * 100));
    const div = document.createElement('div');
    div.className = `catalog-item ${item.id === state.selectedContentId ? 'active' : ''} ${metrics.isOutlier ? 'outlier-item' : ''}`;

    div.innerHTML = `
      <div class="cat-top">
        <span class="cat-badge">${CATEGORY_ORACLE[item.category].label}</span>
        <span class="cat-price mono ${metrics.isOutlier ? 'text-danger' : 'text-emerald'}">
          Cap: $${metrics.pMax.toFixed(4)} (${metrics.ratePerMin.toFixed(3)}/m)
        </span>
      </div>
      <div class="cat-title">${item.title}</div>
      <div class="cat-meta">
        <span>${item.userThumbedUp ? '👍 Upvoted' : '👍 ' + item.thumbsUpCount} • Buyout: ${buyoutPct}% of $${item.rTarget.toLocaleString()}</span>
        <span>${metrics.isOutlier ? '⚠️ Outlier' : '✅ Fair Band'}</span>
      </div>
    `;

    div.addEventListener('click', () => selectContent(item.id));
    listEl.appendChild(div);
  });

  // Render Category Market Oracle Table
  const oracleEl = document.getElementById('categoryOracleList');
  oracleEl.innerHTML = '';
  Object.keys(CATEGORY_ORACLE).forEach(key => {
    const o = CATEGORY_ORACLE[key];
    const row = document.createElement('div');
    row.className = 'oracle-row mono';
    row.innerHTML = `
      <span>${o.label}</span>
      <span class="text-emerald">μ=$${o.mu.toFixed(3)}/m • Avg Target: $${o.avgTarget.toLocaleString()}</span>
    `;
    oracleEl.appendChild(row);
  });
}

function selectContent(contentId) {
  const prevItem = getSelectedContent();
  if (prevItem && state.focusedSeconds > 3) {
    const paid = computeCumulativeCost(prevItem, state.focusedSeconds);
    const metrics = computeMarketBandMetrics(prevItem);
    state.privateHistory.push({
      timeMin: state.privateHistory.length * 7 + 4,
      title: prevItem.title.slice(0, 32),
      category: prevItem.category,
      ratePerMin: +metrics.ratePerMin.toFixed(4),
      paid: +paid.toFixed(4),
      thumbed: prevItem.userThumbedUp
    });
  }

  state.selectedContentId = contentId;
  state.focusedSeconds = 0.0;
  state.sessionCostPaid = 0.0;
  state.outlierApprovedForSession = false;
  state.outlierModalOpen = false;
  state.sessionNonce += 1;
  document.getElementById('outlierModalBackdrop').classList.add('hidden');

  renderCatalog();
  updateViewport();
  drawCharts();
}

function updateViewport() {
  const item = getSelectedContent();
  const metrics = computeMarketBandMetrics(item);
  const t = state.focusedSeconds;
  const currentCost = computeCumulativeCost(item, t);

  const deltaCost = Math.max(0, currentCost - state.sessionCostPaid);
  if (deltaCost > 0) {
    debitUserVaultFIFO(deltaCost);
    state.sessionCostPaid = currentCost;
  }

  // Update Top HUD & Animated Electric Utility Meter
  const effectivelyFocused = state.isWindowFocused && !state.manualBlurSimulated;
  const instRate = effectivelyFocused ? computeMarginalRate(item, t) : 0;
  document.getElementById('electricMeterDisplay').textContent = `$${instRate.toFixed(5)} /s`;

  document.getElementById('userBalanceDisplay').innerHTML = `$${state.userBalance.toFixed(2)}`;
  const tA = state.fifoTranches[0] ? state.fifoTranches[0].remaining.toFixed(1) : '0.0';
  const tB = state.fifoTranches[1] ? state.fifoTranches[1].remaining.toFixed(1) : '0.0';
  document.getElementById('fifoTrancheSub').textContent = `FIFO: WalletA($${tA}) • WalletB($${tB})`;

  document.getElementById('trialBalanceDisplay').innerHTML = `$${state.trialBalance.toFixed(2)} <small>LEFT</small>`;
  const dailyPct = Math.min(100, (state.spentToday / state.dailyCap) * 100);
  document.getElementById('dailyCapBar').style.width = `${dailyPct}%`;
  document.getElementById('dailyCapText').textContent = `$${state.spentToday.toFixed(2)} / $3.00 today`;

  // Stage Banner Update (Streamlined & Jargon-Free)
  const banner = document.getElementById('sessionStageBanner');
  const stageIcon = document.getElementById('stageIcon');
  const stageTitle = document.getElementById('stageTitle');
  const stageSub = document.getElementById('stageSubtitle');

  if (!effectivelyFocused) {
    banner.className = 'stage-banner stage-paused';
    stageIcon.textContent = '⏸️';
    stageTitle.textContent = 'Paused';
    stageSub.textContent = 'No payment while tab is inactive';
    document.getElementById('focusedTimeDisplay').textContent = 'Paused';
  } else if (t < item.tGrace) {
    const countdown = Math.max(0, Math.ceil(item.tGrace - t));
    banner.className = 'stage-banner stage-grace';
    stageIcon.textContent = '⏱️';
    stageTitle.textContent = `Starts in ${countdown}s`;
    stageSub.textContent = '$0.0000 during preview countdown';
    document.getElementById('focusedTimeDisplay').textContent = `${countdown}s`;
  } else if (t < item.tCap) {
    banner.className = 'stage-banner stage-active';
    stageIcon.textContent = '⚡';
    stageTitle.textContent = `Paying attention ($${instRate.toFixed(4)}/s)`;
    stageSub.textContent = `${item.platformSplitText}`;
    document.getElementById('focusedTimeDisplay').textContent = `${t.toFixed(0)}s`;
  } else {
    banner.className = 'stage-banner stage-capped';
    stageIcon.textContent = '✅';
    stageTitle.textContent = `Session Cap Reached ($${metrics.pMax.toFixed(3)})`;
    stageSub.textContent = `Free for the next ${state.epochTTLHours}h ($0.0000/s)`;
    document.getElementById('focusedTimeDisplay').textContent = 'Capped';
  }

  document.getElementById('sessionCostDisplay').textContent = `$${currentCost.toFixed(4)} / $${metrics.pMax.toFixed(3)}`;

  // Content Meta Pills & Rationale
  document.getElementById('viewCategoryPill').textContent = CATEGORY_ORACLE[item.category].label;
  const zPill = document.getElementById('viewZScorePill');
  const zSign = metrics.zScore >= 0 ? '+' : '';
  zPill.textContent = `Rate Z: ${zSign}${metrics.zScore.toFixed(1)}σ • Target: ${metrics.rTargetRatio.toFixed(1)}x Avg`;
  zPill.className = `zscore-pill ${metrics.isOutlier ? 'outlier' : ''}`;

  document.getElementById('viewDecayPill').textContent = `Buyout: $${item.totalRevenue.toFixed(0)} / $${item.rTarget.toLocaleString()}`;
  document.getElementById('viewSplitPill').textContent = item.platformSplitText;
  document.getElementById('viewEpochPill').textContent = `⏳ Epoch #${state.attentionEpoch} (${state.epochTTLHours}h TTL)`;

  document.getElementById('viewTitle').textContent = item.title;
  document.getElementById('viewCreator').textContent = `Stealth Payout: ${item.creator} • ID: ${item.id}`;
  document.getElementById('creatorRationaleText').textContent = item.rationale;

  // Thumbs-Up Button & K/N Pool Stats
  const thumbBtn = document.getElementById('thumbsUpBtn');
  thumbBtn.className = `btn-thumbs-up ${item.userThumbedUp ? 'upvoted' : ''}`;
  document.getElementById('thumbsUpCountBadge').textContent = `(${item.thumbsUpCount + (item.userThumbedUp ? 1 : 0)})`;

  const tStats = computeThumbsUpPoolStats();
  document.getElementById('thumbsRatioBadge').textContent = `K/N = ${tStats.k}/${tStats.n} (ρ = ${(tStats.rho * 100).toFixed(1)}%)`;
  document.getElementById('nonUpvotedMultDisplay').textContent = `${tStats.nonUpvotedMult.toFixed(2)}x (≥0.50x Floor)`;
  document.getElementById('upvotedMultDisplay').textContent = `${tStats.upvotedMult.toFixed(2)}x (≤2.00x Cap)`;

  // Collective Buyout Progress Bar
  const buyoutPct = Math.min(100, (item.totalRevenue / Math.max(1, item.rTarget)) * 100);
  document.getElementById('buyoutProgressText').textContent = `$${item.totalRevenue.toFixed(2)} / $${item.rTarget.toLocaleString()} (${buyoutPct.toFixed(1)}%)`;
  document.getElementById('buyoutBarFill').style.width = `${buyoutPct}%`;

  // Progressive Content Chunk Unblurring (UN_PAYWALLED is 100% unblurred from t=0!)
  const isUnPaywalled = item.category === 'UN_PAYWALLED';
  const progressRatio = isUnPaywalled ? 1 : Math.min(1, Math.max(0.25, t / item.tCap));
  const unlockPct = Math.round(progressRatio * 100);
  document.getElementById('unlockPercentText').textContent = isUnPaywalled ? '100% Open-Web Un-Paywalled' : `${unlockPct}% Unlocked`;
  document.getElementById('unlockBarFill').style.width = `${unlockPct}%`;

  const bodyEl = document.getElementById('viewBody');
  bodyEl.innerHTML = item.chunks.map((chunkHtml, idx) => {
    const threshold = isUnPaywalled || idx === 0 ? 0 : (idx / item.chunks.length) * item.tCap * 0.85;
    const isUnlocked = t >= threshold;
    return `<div class="${isUnlocked ? 'chunk-unlocked' : 'chunk-locked'}" style="margin-bottom: 10px;">${chunkHtml}</div>`;
  }).join('');

  updateVoucherAndCoSigners(item, currentCost, t, tStats);
}

function updateVoucherAndCoSigners(item, currentCost, t, tStats) {
  document.getElementById('voucherNonceText').textContent = `Epoch #${state.attentionEpoch} • Nonce #${state.sessionNonce}`;
  const voucherEl = document.getElementById('liveVoucherJson');
  const mult = item.userThumbedUp ? tStats.upvotedMult : tStats.nonUpvotedMult;
  const adjustedCost = currentCost * mult;

  const pseudoHash = Math.abs(Math.sin(t * 13.37 + state.sessionNonce) * 1e16).toString(16).padStart(16, '0');
  const voucherObj = {
    vault: 'ImmutableUserVault.sol (FIFO)',
    zkBlindedProof: `zkSNARK_0x94c1${pseudoHash.slice(0, 10)}`,
    stealthRecipient: item.creator.slice(0, 22),
    baseUSD: `$${currentCost.toFixed(5)}`,
    thumbsUpAdjustedUSD: `$${adjustedCost.toFixed(5)} (${mult.toFixed(2)}x)`,
    splitRule: item.platformSplitText
  };
  voucherEl.textContent = JSON.stringify(voucherObj, null, 2);

  const listEl = document.getElementById('cosignersList');
  listEl.innerHTML = '';
  const allSigners = [
    { user: 'zkNote:0xYou...Blind', seconds: t.toFixed(0), amount: adjustedCost, sig: `zk_${pseudoHash.slice(0, 5)}` },
    ...state.coSigners
  ];

  let totalPoolRelease = 0;
  allSigners.forEach(s => {
    totalPoolRelease += s.amount;
    const row = document.createElement('div');
    row.className = 'cosigner-row';
    row.innerHTML = `
      <span>${s.user} (${s.seconds}s)</span>
      <span>$${s.amount.toFixed(4)} <strong class="sig-verified">✓ ${s.sig}</strong></span>
    `;
    listEl.appendChild(row);
  });

  document.getElementById('pendingSigCountBadge').textContent = `${allSigners.length} ZK Co-Signers`;
  document.getElementById('pooledTotalAmountText').textContent = `Total Release: $${totalPoolRelease.toFixed(4)}`;
}

// ============================================================================
// 6. CANVAS CHARTS (S-CURVE, COLLECTIVE BUYOUT DECAY, & 2D HISTORY TIMELINE)
// ============================================================================

function drawCharts() {
  drawSCurveChart();
  drawDecayChart();
}

function drawSCurveChart() {
  const canvas = document.getElementById('sCurveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const item = getSelectedContent();
  const pMax = computeCurrentPMax(item);
  const maxTimePlot = Math.round(item.tCap * 1.25);
  const padL = 42, padR = 16, padT = 16, padB = 26;
  const plotW = w - padL - padR, plotH = h - padT - padB;

  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (plotH * i) / 4;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
  }

  const xGrace = padL + (item.tGrace / maxTimePlot) * plotW;
  const xCap = padL + (item.tCap / maxTimePlot) * plotW;
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
  ctx.beginPath(); ctx.moveTo(xGrace, padT); ctx.lineTo(xGrace, h - padB); ctx.stroke();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
  ctx.beginPath(); ctx.moveTo(xCap, padT); ctx.lineTo(xCap, h - padB); ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '10px monospace';
  ctx.fillText(`t_grace(${item.tGrace}s)`, xGrace - 20, h - 8);
  ctx.fillText(`t_cap(${item.tCap}s)`, xCap - 24, h - 8);
  ctx.fillText(`$${pMax.toFixed(3)}`, 2, padT + 8);
  ctx.fillText('$0.00', 6, h - padB);

  let maxRate = 0.00001;
  for (let t = 0; t <= maxTimePlot; t += 1) maxRate = Math.max(maxRate, computeMarginalRate(item, t));

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (let px = 0; px <= plotW; px++) {
    const t = (px / plotW) * maxTimePlot;
    const r = computeMarginalRate(item, t);
    const x = padL + px, y = padT + plotH - (r / maxRate) * (plotH * 0.75);
    if (px === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let px = 0; px <= plotW; px++) {
    const t = (px / plotW) * maxTimePlot;
    const cost = computeCumulativeCost(item, t);
    const x = padL + px, y = padT + plotH - (cost / Math.max(0.0001, pMax)) * plotH;
    if (px === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const clampedT = Math.min(maxTimePlot, state.focusedSeconds);
  const curCost = computeCumulativeCost(item, clampedT);
  const curX = padL + (clampedT / maxTimePlot) * plotW;
  const curY = padT + plotH - (curCost / Math.max(0.0001, pMax)) * plotH;

  ctx.fillStyle = '#10b981';
  ctx.beginPath(); ctx.arc(curX, curY, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
}

function drawDecayChart() {
  const canvas = document.getElementById('decayCurveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const item = getSelectedContent();
  const maxRevPlot = Math.max(item.rTarget * 1.15, item.totalRevenue * 1.2);
  const maxP = Math.max(0.01, item.pInit);
  const padL = 44, padR = 16, padT = 16, padB = 26;
  const plotW = w - padL - padR, plotH = h - padT - padB;

  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (plotH * i) / 4;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
  }

  const xTarget = padL + (item.rTarget / maxRevPlot) * plotW;
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
  ctx.beginPath(); ctx.moveTo(xTarget, padT); ctx.lineTo(xTarget, h - padB); ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let px = 0; px <= plotW; px++) {
    const rev = (px / plotW) * maxRevPlot;
    const p = computeCurrentPMax(item, rev);
    const x = padL + px, y = padT + plotH - (p / maxP) * plotH;
    if (px === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const curP = computeCurrentPMax(item);
  const curX = padL + (Math.min(maxRevPlot, item.totalRevenue) / maxRevPlot) * plotW;
  const curY = padT + plotH - (curP / maxP) * plotH;

  ctx.fillStyle = '#06b6d4';
  ctx.beginPath(); ctx.arc(curX, curY, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.fillStyle = '#9ca3af';
  ctx.font = '10px monospace';
  ctx.fillText(`$${maxP.toFixed(3)}`, 2, padT + 8);
  ctx.fillText(`R_target($${item.rTarget.toLocaleString()})`, Math.min(w - 110, Math.max(padL, xTarget - 45)), h - 8);
}

function drawHistoryTimelineChart() {
  const canvas = document.getElementById('historyTimelineCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const hist = state.privateHistory;
  const padL = 48, padR = 24, padT = 22, padB = 28;
  const plotW = w - padL - padR, plotH = h - padT - padB;

  ctx.strokeStyle = '#1f2937';
  for (let i = 0; i <= 3; i++) {
    const y = padT + (plotH * i) / 3;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
  }

  const maxRate = Math.max(0.10, ...hist.map(d => d.ratePerMin));
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.2;
  ctx.beginPath();

  const points = hist.map((d, idx) => {
    const x = padL + (idx / Math.max(1, hist.length - 1)) * plotW;
    const y = padT + plotH - (d.ratePerMin / maxRate) * plotH;
    return { x, y, d };
  });

  points.forEach((pt, idx) => {
    if (idx === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();

  points.forEach(pt => {
    ctx.fillStyle = pt.d.thumbed ? '#10b981' : '#f59e0b';
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d1d5db';
    ctx.font = '10px sans-serif';
    ctx.fillText(pt.d.title.slice(0, 14) + '..', pt.x - 24, pt.y - 9);
  });

  ctx.fillStyle = '#9ca3af';
  ctx.font = '10px monospace';
  ctx.fillText(`$${maxRate.toFixed(3)}/m`, 2, padT + 8);
  ctx.fillText('$0.00/m', 4, h - padB);
}

// ============================================================================
// 7. ANALYTICS, CULTURAL HVI RANKINGS, FIFO VAULT & TAO DAO RENDERERS
// ============================================================================

let selectedRegionFilter = 'GLOBAL';

function renderAnalyticsTab() {
  drawHistoryTimelineChart();

  const listEl = document.getElementById('privateHistoryList');
  document.getElementById('historyCountBadge').textContent = `${state.privateHistory.length} Private Sessions On-Device`;
  listEl.innerHTML = state.privateHistory.slice().reverse().map(h => `
    <div class="cosigner-row">
      <span>t=${h.timeMin}m • <strong>${h.title}</strong> (${h.category}) ${h.thumbed ? '👍' : ''}</span>
      <span class="text-cyan">$${h.paid.toFixed(4)} (${h.ratePerMin.toFixed(3)}/m)</span>
    </div>
  `).join('');

  renderCulturalRankings();
}

function renderCulturalRankings() {
  const rankEl = document.getElementById('culturalRankingsList');
  if (!rankEl) return;

  const filtered = CONTENT_CATALOG
    .filter(c => !c.isOutlierDemo && (selectedRegionFilter === 'GLOBAL' || c.regionTag === selectedRegionFilter || c.regionTag === 'GLOBAL'))
    .slice()
    .sort((a, b) => (b.thumbsUpCount * b.totalRevenue) - (a.thumbsUpCount * a.totalRevenue));

  rankEl.innerHTML = filtered.map((item, idx) => {
    const hviScore = Math.round(Math.sqrt(item.thumbsUpCount * Math.max(10, item.totalRevenue)));
    return `
      <div class="catalog-item">
        <div class="cat-top">
          <span class="cat-badge">#${idx + 1} • ${item.cultureLabel}</span>
          <span class="cat-price mono text-emerald">HVI Score: ${hviScore.toLocaleString()} • 👍 ${item.thumbsUpCount}</span>
        </div>
        <div class="cat-title">${item.title}</div>
        <div class="cat-meta">
          <span>Collective Buyout: $${item.totalRevenue.toFixed(0)} / $${item.rTarget.toLocaleString()}</span>
          <span>${item.platformSplitText}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderDaoAndVaultTab() {
  const trancheEl = document.getElementById('fifoTranchesList');
  if (trancheEl) {
    trancheEl.innerHTML = state.fifoTranches.map((t, idx) => `
      <div class="cosigner-row">
        <span>Tranche #${idx + 1} (${idx === 0 ? 'Spends First - FIFO' : 'Queued'}) • ${t.funder}</span>
        <span class="text-emerald">Remaining: $${t.remaining.toFixed(4)} / $${t.initial.toFixed(2)}</span>
      </div>
    `).join('');
  }

  const totalGov = state.founderGovTokens + state.daoGovTokens;
  const founderPct = ((state.founderGovTokens / totalGov) * 100).toFixed(2);
  const daoPct = ((state.daoGovTokens / totalGov) * 100).toFixed(2);
  document.getElementById('govSplitDisplay').textContent = `${founderPct}% Founder / ${daoPct}% DAO`;
  document.getElementById('govTotalSupplyText').textContent = `Supply: ${totalGov.toLocaleString()} OSG`;
  document.getElementById('taoGrantPoolDisplay').textContent = `$${state.taoGrantPoolUSD.toFixed(2)} USDC`;

  const propEl = document.getElementById('taoProposalsList');
  if (propEl) {
    propEl.innerHTML = state.taoProposals.map(p => `
      <div class="catalog-item">
        <div class="cat-top">
          <span class="cat-badge">ZK-Locale: ${p.locale}</span>
          <span class="cat-price mono text-cyan">Grant: $${p.requested.toLocaleString()} USDC</span>
        </div>
        <div class="cat-title">${p.title}</div>
        <div class="cat-meta">
          <span>Verified 1-Yr+ Local Voters: <strong>${p.votes} Yes</strong></span>
          <button class="btn-xs ${p.voted ? 'btn-secondary' : 'btn-emerald'}" onclick="window.voteTaoProposal(${p.id})">
            ${p.voted ? '✓ ZK Vote Cast' : '🗳️ Cast ZK-Locale Vote'}
          </button>
        </div>
      </div>
    `).join('');
  }
}

window.voteTaoProposal = function(id) {
  const prop = state.taoProposals.find(p => p.id === id);
  if (prop && !prop.voted) {
    prop.voted = true;
    prop.votes += 1;
    renderDaoAndVaultTab();
  }
};

// ============================================================================
// 8. TIMERS, FOCUS TRACKING & INTERACTIVE EVENT LISTENERS
// ============================================================================

function updateFocusBadge() {
  const badge = document.getElementById('focusStatusBadge');
  const text = document.getElementById('focusStatusText');
  const btn = document.getElementById('toggleFocusSimBtn');
  const active = state.isWindowFocused && !state.manualBlurSimulated;

  if (active) {
    badge.className = 'focus-badge focused';
    text.textContent = 'FOCUSED';
    btn.textContent = '👁️ Unfocus';
  } else {
    badge.className = 'focus-badge unfocused';
    text.textContent = 'PAUSED ($0/s)';
    btn.textContent = '🟢 Focus';
  }
}

window.addEventListener('focus', () => { state.isWindowFocused = true; updateFocusBadge(); });
window.addEventListener('blur', () => { state.isWindowFocused = false; updateFocusBadge(); });
document.addEventListener('visibilitychange', () => { state.isWindowFocused = !document.hidden; updateFocusBadge(); });

setInterval(() => {
  const yieldPerTick = (state.poolTVL * 0.046) / (365 * 24 * 3600 * 5);
  state.yieldReserveUSD += yieldPerTick * 1200;
  document.getElementById('yieldReserveDisplay').textContent = `$${state.yieldReserveUSD.toFixed(6)}`;

  const effectivelyFocused = state.isWindowFocused && !state.manualBlurSimulated;
  if (!effectivelyFocused || state.outlierModalOpen) {
    updateViewport();
    return;
  }

  const item = getSelectedContent();
  const metrics = computeMarketBandMetrics(item);

  if (metrics.isOutlier && !state.outlierApprovedForSession && state.focusedSeconds + 0.2 >= item.tGrace) {
    state.focusedSeconds = item.tGrace;
    triggerOutlierModal(item, metrics);
    updateViewport();
    drawCharts();
    return;
  }

  state.focusedSeconds += 0.2;
  updateViewport();
  drawCharts();
}, 200);

function triggerOutlierModal(item, metrics) {
  state.outlierModalOpen = true;
  document.getElementById('modalCreatorRationale').textContent = item.rationale;
  document.getElementById('modalContentRate').textContent = `$${metrics.ratePerMin.toFixed(3)} / min`;
  document.getElementById('modalMarketAvg').textContent = `$${metrics.mu.toFixed(3)} / min`;
  document.getElementById('modalZScore').textContent = `+${metrics.zScore.toFixed(1)}σ • Target: $${item.rTarget.toLocaleString()}`;
  document.getElementById('outlierModalBackdrop').classList.remove('hidden');
}

// Thumbs-Up Button Click Handler
document.getElementById('thumbsUpBtn').addEventListener('click', () => {
  const item = getSelectedContent();
  item.userThumbedUp = !item.userThumbedUp;
  const tStats = computeThumbsUpPoolStats();
  logSettlementTx(
    `👍 Thumbs-Up ${item.userThumbedUp ? 'Added' : 'Removed'} on "${item.title.slice(0, 26)}..."`,
    `K/N = ${tStats.k}/${tStats.n} → Withholding Pool ρ = ${(tStats.rho * 100).toFixed(1)}% (Upvoted get ${tStats.upvotedMult.toFixed(2)}x, Non-upvoted get ${tStats.nonUpvotedMult.toFixed(2)}x)`
  );
  renderCatalog();
  updateViewport();
});

document.getElementById('toggleFocusSimBtn').addEventListener('click', () => {
  state.manualBlurSimulated = !state.manualBlurSimulated;
  updateFocusBadge();
  updateViewport();
});

document.getElementById('metaverseZoneBtn').addEventListener('click', () => {
  state.manualBlurSimulated = !state.manualBlurSimulated;
  updateFocusBadge();
  updateViewport();
  logSettlementTx(
    state.manualBlurSimulated
      ? '🕹️ SpatialTrigger.exitZone() — Avatar Left 3D Museum'
      : '🕹️ SpatialTrigger.enterZone() — Avatar Entered 3D Museum',
    state.manualBlurSimulated ? 'Micropayment meter paused at $0.00000/s.' : 'Micropayment S-curve resumed.'
  );
});

document.getElementById('bounceBtn').addEventListener('click', () => {
  state.focusedSeconds = 0.0;
  state.sessionCostPaid = 0.0;
  state.outlierApprovedForSession = false;
  state.sessionNonce += 1;
  updateViewport();
  drawCharts();
});

document.getElementById('fastForwardBtn').addEventListener('click', () => {
  const item = getSelectedContent();
  const metrics = computeMarketBandMetrics(item);
  if (metrics.isOutlier && !state.outlierApprovedForSession && state.focusedSeconds < item.tGrace) {
    state.focusedSeconds = item.tGrace;
    triggerOutlierModal(item, metrics);
  } else {
    state.focusedSeconds += 15;
  }
  updateViewport();
  drawCharts();
});

document.getElementById('epochResetBtn').addEventListener('click', () => {
  const item = getSelectedContent();
  const prevEpoch = state.attentionEpoch;
  state.attentionEpoch += 1;
  state.focusedSeconds = 0.0;
  state.sessionCostPaid = 0.0;
  state.outlierApprovedForSession = false;
  state.sessionNonce += 1;
  item.totalRevenue += computeCurrentPMax(item) * 35;

  logSettlementTx(
    `🗓️ +${state.epochTTLHours}h Elapsed → Epoch #${prevEpoch} Reset to t=0s`,
    `Anti-restreaming TTL expired. New repeat-view cap: $${computeCurrentPMax(item).toFixed(4)}.`
  );
  renderCatalog();
  updateViewport();
  drawCharts();
});

document.getElementById('simulateViralBtn').addEventListener('click', () => {
  const item = getSelectedContent();
  const oldPMax = computeCurrentPMax(item);
  const addedRev = Math.max(50, item.rTarget * 0.18);
  item.totalRevenue += addedRev;
  const newPMax = computeCurrentPMax(item);

  logSettlementTx(
    `🌍 +250 Global Viewers Advanced Collective Buyout on ${item.id}`,
    `R_total +$${addedRev.toFixed(2)} / $${item.rTarget.toLocaleString()} → Max cap dropped $${oldPMax.toFixed(4)} → $${newPMax.toFixed(4)}!`
  );
  renderCatalog();
  updateViewport();
  drawCharts();
});

// Modals
document.getElementById('modalRejectBtn').addEventListener('click', () => {
  state.outlierModalOpen = false;
  document.getElementById('outlierModalBackdrop').classList.add('hidden');
  selectContent(CONTENT_CATALOG[0].id);
});

document.getElementById('modalApproveBtn').addEventListener('click', () => {
  state.outlierApprovedForSession = true;
  state.outlierModalOpen = false;
  document.getElementById('outlierModalBackdrop').classList.add('hidden');
});

document.getElementById('finishTrialPopupBtn').addEventListener('click', () => {
  document.getElementById('trialReceiptModalBackdrop').classList.remove('hidden');
});

document.getElementById('closeTrialModalBtn').addEventListener('click', () => {
  document.getElementById('trialReceiptModalBackdrop').classList.add('hidden');
});

document.getElementById('convertTrialTopUpBtn').addEventListener('click', () => {
  document.getElementById('trialReceiptModalBackdrop').classList.add('hidden');
  document.getElementById('topUpBtn').click();
});

// ZK Pooled Batch Settlement (Zero Developer Fee Cut — 100% to Creators/Platforms)
document.getElementById('settleBatchBtn').addEventListener('click', () => {
  const item = getSelectedContent();
  const tStats = computeThumbsUpPoolStats();
  const mult = item.userThumbedUp ? tStats.upvotedMult : tStats.nonUpvotedMult;
  const myContribution = computeCumulativeCost(item, state.focusedSeconds) * mult;
  const coSignSum = state.coSigners.reduce((acc, s) => acc + s.amount, 0);
  const totalPayout = myContribution + coSignSum;
  const l2GasFee = 0.00042;

  state.yieldReserveUSD = Math.max(0, state.yieldReserveUSD - l2GasFee);
  item.totalRevenue += totalPayout;

  logSettlementTx(
    `✅ ZK-Blinded Batch Settled → ${item.platformSplitText}`,
    `Total: $${totalPayout.toFixed(4)} (${mult.toFixed(2)}x 👍 Pool) | 100% to Creator + 0 Gas!`
  );

  state.sessionNonce += 1;
  renderCatalog();
  updateViewport();
  drawCharts();
});

function logSettlementTx(title, detail) {
  const logList = document.getElementById('txLogList');
  if (!logList) return;
  const div = document.createElement('div');
  div.className = 'tx-item mono';
  div.innerHTML = `<div><strong>${title}</strong></div><div style="color:#9ca3af">${detail}</div>`;
  logList.prepend(div);
}

// ============================================================================
// 9. MACRO THERMOSTAT, ANTI-CARTEL SLIDERS, VAULT SAFETY & DAO ACTIONS
// ============================================================================

function onMacroSliderChange() {
  state.avgNetworkMonthlySpend = parseFloat(document.getElementById('avgMonthlySpendSlider').value);
  state.medianMonthlySalary = parseFloat(document.getElementById('medianSalarySlider').value);
  state.inflationPercent = parseFloat(document.getElementById('inflationSlider').value);
  computeMacroThermostat();

  document.getElementById('avgMonthlySpendVal').textContent = `$${state.avgNetworkMonthlySpend.toFixed(2)} / mo`;
  document.getElementById('medianSalaryVal').textContent = `$${state.medianMonthlySalary.toLocaleString()} / mo`;
  document.getElementById('inflationVal').textContent = `+${state.inflationPercent.toFixed(1)}% CPI`;
  document.getElementById('macroCeilingDisplay').textContent = `$${state.macroEffectiveCeiling.toFixed(2)} / mo`;

  const gammaPct = (state.gammaMacro * 100).toFixed(1);
  document.getElementById('gammaScalarDisplay').textContent = `${state.gammaMacro.toFixed(3)}x (${gammaPct}%)`;

  const badge = document.getElementById('macroStatusBadge');
  if (state.gammaMacro < 0.999) {
    badge.className = 'macro-badge dampening';
    badge.textContent = `DAMPENING (γ = ${state.gammaMacro.toFixed(2)}x)`;
  } else {
    badge.className = 'macro-badge balanced';
    badge.textContent = 'BALANCED (γ = 1.00x)';
  }

  renderCatalog();
  updateViewport();
  drawCharts();
}

['avgMonthlySpendSlider', 'medianSalarySlider', 'inflationSlider'].forEach(id => {
  document.getElementById(id).addEventListener('input', onMacroSliderChange);
});

// Anti-Cartel & Personal Ceiling Sliders
document.getElementById('cartelCreepSlider').addEventListener('input', (e) => {
  state.cartelCreepPercent = parseFloat(e.target.value);
  document.getElementById('cartelCreepVal').textContent = `+${state.cartelCreepPercent}% Coord. Hike`;
  const badge = document.getElementById('cartelStatusBadge');
  if (state.cartelCreepPercent > 5) {
    badge.className = 'macro-badge dampening';
    badge.textContent = `🚨 CARTEL CREEP FLAGGED (+${state.cartelCreepPercent}% > CPI!)`;
  } else {
    badge.className = 'macro-badge balanced';
    badge.textContent = 'NO CARTEL DRIFT (Anchored to CPI)';
  }
  renderCatalog();
  updateViewport();
});

document.getElementById('personalCeilingSlider').addEventListener('input', (e) => {
  state.personalMaxRatePerMin = parseFloat(e.target.value);
  document.getElementById('personalCeilingVal').textContent = `$${state.personalMaxRatePerMin.toFixed(3)} / min`;
  renderCatalog();
  updateViewport();
});

// Immutable Vault Actions ($200 Max Cap, Dust Attack Test, 1-Tap Exit)
document.getElementById('topUpBtn').addEventListener('click', () => {
  const room = Math.max(0, state.maxVaultCap - state.userBalance);
  const accepted = Math.min(10.0, room);
  state.userBalance += accepted;
  state.fifoTranches.push({ funder: '0xWalletB...88C2 (TopUp)', initial: accepted, remaining: accepted });
  updateViewport();
  renderDaoAndVaultTab();
  logSettlementTx('💰 Deposited +$' + accepted.toFixed(2) + ' USDC into ImmutableUserVault', 'Recorded as new FIFO funding tranche.');
});

document.getElementById('testOverCapDepositBtn').addEventListener('click', () => {
  const attempt = 220.0;
  const room = Math.max(0, state.maxVaultCap - state.userBalance);
  const reimbursed = attempt - room;
  state.userBalance += room;
  if (room > 0) {
    state.fifoTranches.push({ funder: '0xWalletC...99A1', initial: room, remaining: room });
  }
  updateViewport();
  renderDaoAndVaultTab();
  alert(`🔒 ImmutableUserVault $200.00 Cap Enforced!\n\n• Attempted Deposit: $${attempt.toFixed(2)}\n• Accepted (to hit $200.00 max): $${room.toFixed(2)}\n• Auto-Reimbursed to Sender Immediately: $${reimbursed.toFixed(2)}!`);
});

document.getElementById('testDustAttackBtn').addEventListener('click', () => {
  state.fifoTranches.push({ funder: '0xHackerDust...666F (Attacker)', initial: 1.00, remaining: 1.00 });
  state.userBalance += 1.00;
  renderDaoAndVaultTab();
  const breakdown = state.fifoTranches.map(t => `• ${t.funder}: receives strictly $${t.remaining.toFixed(2)}`).join('\n');
  alert(`🛡️ 60-Day Inactivity FIFO Proportional Refund Simulation:\n\nA hacker sent $1.00 hoping to hijack your balance as the "last sender". Because ImmutableUserVault tracks FIFO tranches, after 60 days of inactivity the contract refunds:\n\n${breakdown}\n\nThe hacker only gets their $1.00 back, and your original wallets recover 100% of their unspent funds!`);
});

document.getElementById('oneTapRefundBtn').addEventListener('click', () => {
  const refunded = state.userBalance;
  state.userBalance = 0;
  state.fifoTranches = [];
  updateViewport();
  renderDaoAndVaultTab();
  alert(`↩️ 1-Tap Instant Exit Executed!\n\n$${refunded.toFixed(4)} USDC has been returned directly to your original funding wallets in exact FIFO proportion.`);
});

document.getElementById('simulateAirdropBtn').addEventListener('click', () => {
  state.daoGovTokens += 100000;
  state.founderGovTokens += 50000; // 50k / 150k = 33.33% (1/3)
  renderDaoAndVaultTab();
});

// Region Filter Tabs in Cultural Rankings
document.querySelectorAll('#regionFilterTabs .code-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#regionFilterTabs .code-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    selectedRegionFilter = tab.getAttribute('data-region');
    renderCulturalRankings();
  });
});

// ============================================================================
// 10. 4-WAY MODE SWITCHER & PUBLISHER STUDIO v2.0
// ============================================================================
let activeSnippetType = 'meta';

function switchMode(mode) {
  const views = {
    consumer:  document.getElementById('consumerWorkspace'),
    publisher: document.getElementById('publisherWorkspace'),
    analytics: document.getElementById('analyticsWorkspace'),
    dao:       document.getElementById('daoWorkspace')
  };
  const tabs = {
    consumer:  document.getElementById('modeTabConsumer'),
    publisher: document.getElementById('modeTabPublisher'),
    analytics: document.getElementById('modeTabAnalytics'),
    dao:       document.getElementById('modeTabDao')
  };

  Object.keys(views).forEach(k => {
    if (k === mode) {
      views[k].classList.remove('hidden');
      tabs[k].classList.add('active');
    } else {
      views[k].classList.add('hidden');
      tabs[k].classList.remove('active');
    }
  });

  if (mode === 'consumer') drawCharts();
  if (mode === 'publisher') updatePublisherStudio();
  if (mode === 'analytics') renderAnalyticsTab();
  if (mode === 'dao') renderDaoAndVaultTab();
}

document.getElementById('modeTabConsumer').addEventListener('click', () => switchMode('consumer'));
document.getElementById('modeTabPublisher').addEventListener('click', () => switchMode('publisher'));
document.getElementById('modeTabAnalytics').addEventListener('click', () => switchMode('analytics'));
document.getElementById('modeTabDao').addEventListener('click', () => switchMode('dao'));

const headerWalletInfoBtn = document.getElementById('headerWalletInfoBtn');
if (headerWalletInfoBtn) {
  headerWalletInfoBtn.addEventListener('click', () => switchMode('dao'));
}

function getStudioConfig() {
  const title = document.getElementById('pubTitleInput').value.trim() || 'Untitled Stream';
  const category = document.getElementById('pubCategorySelect').value;
  const creator = document.getElementById('pubCreatorInput').value.trim() || 'st:eth:0x84B2...E91C';
  const pInit = parseFloat(document.getElementById('pubPInitSlider').value);
  const pFloor = Math.min(pInit, parseFloat(document.getElementById('pubPFloorSlider').value));
  const rTarget = parseFloat(document.getElementById('pubRTargetSlider').value);
  const platformPct = parseInt(document.getElementById('pubPlatformSplitSlider').value, 10);
  const tGrace = parseInt(document.getElementById('pubTGraceSlider').value, 10);
  const tCap = Math.max(tGrace + 15, parseInt(document.getElementById('pubTCapSlider').value, 10));
  const epochResetHours = parseInt(document.getElementById('pubEpochResetSlider').value, 10);
  const rationale = document.getElementById('pubRationaleInput').value.trim();
  const contentId = '0x' + Math.abs(title.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0)).toString(16).padStart(4, '0') + '...v200';

  return { title, category, creator, pInit, pFloor, rTarget, platformPct, tGrace, tCap, epochResetHours, rationale, contentId };
}

function updatePublisherStudio() {
  const cfg = getStudioConfig();
  document.getElementById('pubPInitVal').textContent = `$${cfg.pInit.toFixed(3)}`;
  document.getElementById('pubPFloorVal').textContent = `$${cfg.pFloor.toFixed(3)}`;
  document.getElementById('pubRTargetVal').textContent = `$${cfg.rTarget.toLocaleString()}`;
  document.getElementById('pubPlatformSplitVal').textContent = `${cfg.platformPct}% Platform / ${100 - cfg.platformPct}% Creator(s)`;
  document.getElementById('pubTGraceVal').textContent = `${cfg.tGrace}s → ${cfg.tCap}s`;

  const oracle = CATEGORY_ORACLE[cfg.category];
  const ratePerMin = (cfg.pInit * state.gammaMacro) / (cfg.tCap / 60);
  const zScore = (ratePerMin - oracle.mu) / oracle.sigma;
  const isOutlier = zScore > 1.5 || cfg.rTarget > oracle.avgTarget * 5;

  document.getElementById('studioRatePerMin').textContent = `$${ratePerMin.toFixed(3)} / min`;
  document.getElementById('studioCatAvg').textContent = `$${oracle.mu.toFixed(3)} / min`;
  document.getElementById('studioOutlierLimit').textContent = `$${cfg.rTarget.toLocaleString()} (Avg $${oracle.avgTarget.toLocaleString()})`;
  document.getElementById('studioZScore').textContent = `${zScore >= 0 ? '+' : ''}${zScore.toFixed(1)}σ`;

  const card = document.getElementById('studioBandCard');
  if (isOutlier) {
    card.className = 'studio-band-card outlier-zone';
    document.getElementById('studioBandIcon').textContent = '⚠️';
    document.getElementById('studioBandTitle').textContent = 'Two-Axis Outlier Flagged (Triggers User Rationale Popup)';
    document.getElementById('studioBandDesc').textContent = 'Your rate or R_target exceeds the category band. Users will see your Rationale statement in a confirmation popup at t_grace.';
  } else {
    card.className = 'studio-band-card green-zone';
    document.getElementById('studioBandIcon').textContent = '✅';
    document.getElementById('studioBandTitle').textContent = 'Competitive Green Zone (0 Popups • Frictionless Auto-Pay)';
    document.getElementById('studioBandDesc').textContent = 'Both your per-minute rate and Collective Buyout Target sit inside the fair band!';
  }

  renderIntegrationSnippet(cfg);
}

function renderIntegrationSnippet(cfg) {
  const pre = document.getElementById('generatedCodePre');
  const fileLabel = document.getElementById('snippetFileName');
  const domainInputEl = document.getElementById('creatorDomainInput');
  const domainVal = domainInputEl ? domainInputEl.value.trim() || 'aliceblog.com' : 'aliceblog.com';

  if (activeSnippetType === 'meta') {
    fileLabel.textContent = 'website.html — 1-Line <meta> Tag (Direct MetaMask Wallet or Domain URL)';
    pre.textContent = `<!-- Option A (Recommended): Direct MetaMask Wallet Tag (Instant Payouts) -->
<meta name="paidattention" content="wallet:${cfg.creator}" />

<!-- Option B (Zero-Wallet Start): 60-Second URL Tag (Redeem anytime later) -->
<meta name="paidattention"
  content="domain:${domainVal}"
  data-category="${cfg.category}"
  data-t-grace="${cfg.tGrace}"
  data-t-cap="${cfg.tCap}"
  data-p-cap="${cfg.pInit.toFixed(3)}" />`;
  } else if (activeSnippetType === 'ai_rag') {
    fileLabel.textContent = 'langchain-rag-server.js — Open-Source AI Attribution (@openstream/ai-rag-attribution)';
    pre.textContent = `import { OpenStreamAIRAG } from '@openstream/ai-rag-attribution';

// Phase 1: Drop-in Open-Source AI Middleware (LangChain / LlamaIndex / Ollama / vLLM)
// Battle-tested in open-source AI first -> Empirical proof for EU AI Act legislative mandate
export const ragPipeline = new OpenStreamAIRAG({
  modelId: 'ollama/llama-3.3-70b-open',
  algorithmCommitHash: 'ipfs://QmOpenSourceShapleyAttributionV2', // Publicly auditable code
  aiComputeShareBps: 2500, // 25% to AI compute, 75% auto-streamed to cited human websites!
  autoEscrowUnregisteredDomains: true // Uses DNSSEC domainEscrow for personal blogs
});`;
  } else if (activeSnippetType === 'html') {
    fileLabel.textContent = 'index.html — Universal Web Component (Supports UN_PAYWALLED & Trial Prompt)';
    pre.textContent = `<script src="https://cdn.openstream.org/sdk/openstream-sdk.js"></script>

<openstream-gate
  content-id="${cfg.contentId}"
  category="${cfg.category}"
  stealth-creator="${cfg.creator}"
  p-init="${cfg.pInit.toFixed(3)}"
  p-floor="${cfg.pFloor.toFixed(3)}"
  r-target="${cfg.rTarget}"
  platform-split-bps="${cfg.platformPct * 100}"
  t-grace="${cfg.tGrace}"
  t-cap="${cfg.tCap}"
  rationale="${cfg.rationale}">

  <article>
    <h1>${cfg.title}</h1>
    <p>Includes $2.00 Free Virtual Trial onboarding for new users!</p>
  </article>
</openstream-gate>`;
  } else if (activeSnippetType === 'metaverse') {
    fileLabel.textContent = 'decentraland-scene.ts — 3D Metaverse / Spatial Trigger API';
    pre.textContent = `import { SpatialTrigger } from '@openstream/metaverse-sdk';

// Trigger micropayment S-Curve when avatar steps inside your 3D Museum parcel
const museumZone = new SpatialTrigger({
  contentId: '${cfg.contentId}',
  stealthCreator: '${cfg.creator}',
  pInitUSD: ${cfg.pInit.toFixed(3)},
  rTargetUSD: ${cfg.rTarget},
  tGraceSec: ${cfg.tGrace},
  tCapSec: ${cfg.tCap}
});

onPlayerEnterParcel((parcel) => {
  museumZone.enterZone(); // Starts 10s free grace -> S-curve meter
});

onPlayerLeaveParcel((parcel) => {
  museumZone.exitZone();  // Immediately pauses meter at $0.00000/s
});`;
  } else if (activeSnippetType === 'hls') {
    fileLabel.textContent = 'netflix-youtube-split.js — Enterprise Platform & Co-Creator Split';
    pre.textContent = `import { OpenStreamEnterprise } from '@openstream/hls-middleware';

// Supports 100% Platform Buyout (Netflix) or Platform/Creator Split (YouTube)
export const streamConfig = OpenStreamEnterprise.createStream({
  contentId: '${cfg.contentId}',
  platformRecipient: '0xPlatformTreasury...L2',
  platformShareBps: ${cfg.platformPct * 100}, // ${cfg.platformPct}% to Platform, ${100 - cfg.platformPct}% to Creators
  coCreators: [
    { wallet: '${cfg.creator}', shareBps: 6000 }, // 60% Lead Creator (Stealth)
    { wallet: 'st:eth:0xCoAuthor...22B1', shareBps: 4000 } // 40% Collaborator
  ],
  collectiveBuyoutTargetUSD: ${cfg.rTarget}
});`;
  } else {
    fileLabel.textContent = 'register-v2.js — OpenStreamProtocol.sol v2.0 Call';
    pre.textContent = `await openStreamProtocol.registerContentV2(
  "${cfg.contentId}",
  ServiceCategory.${cfg.category},
  ${Math.round(cfg.pInit * 1e6)},      // pInit ($${cfg.pInit.toFixed(3)})
  ${Math.round(cfg.pFloor * 1e6)},     // pFloor ($${cfg.pFloor.toFixed(3)})
  ${Math.round(cfg.rTarget * 1e6)},    // rTarget ($${cfg.rTarget.toLocaleString()} Collective Buyout)
  ${cfg.tGrace}, ${Math.round((cfg.tGrace + cfg.tCap) / 2.2)}, ${cfg.tCap},
  ${cfg.epochResetHours * 3600},       // Anti-restreaming TTL
  "0xPlatformWallet", ${cfg.platformPct * 100}, // ${cfg.platformPct}% Platform Split
  ["${cfg.creator}"], [10000],
  "${cfg.rationale}",
  "0xStealthMetaAddress"
);`;
  }
}

['pubTitleInput', 'pubCategorySelect', 'pubCreatorInput', 'pubPInitSlider', 'pubPFloorSlider', 'pubRTargetSlider', 'pubPlatformSplitSlider', 'pubTGraceSlider', 'pubTCapSlider', 'pubEpochResetSlider', 'pubRationaleInput', 'creatorDomainInput'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updatePublisherStudio);
});

const passkeyBtn = document.getElementById('createPasskeyWalletBtn');
if (passkeyBtn) {
  passkeyBtn.addEventListener('click', () => {
    const domain = (document.getElementById('creatorDomainInput').value || 'aliceblog.com').trim();
    const sweepMode = document.getElementById('creatorFiatSweepSelect').value;
    const hash = Math.abs(Array.from(domain).reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0)).toString(16).slice(0, 6).toUpperCase();
    const stealthAddr = `st:eth:0x4337Passkey${hash}...E91C`;

    document.getElementById('pubCreatorInput').value = stealthAddr;
    document.getElementById('creatorEscrowBadge').textContent = 'Claimed $142.50 ✅';
    document.getElementById('passkeyStatusText').textContent =
      `✅ Passkey Wallet ${stealthAddr} active! $142.50 swept (${sweepMode}) • 0 Gas Paid`;
    passkeyBtn.textContent = `✅ Passkey Wallet Linked to ${domain} ($142.50 Claimed)`;

    logSettlementTx(
      `🔐 1-Click Passkey Smart Wallet Created (${domain})`,
      `Claimed $142.50 from DNSSEC domainEscrow -> ${stealthAddr} (${sweepMode}, 0 ETH gas paid by Yield Pool)`
    );
    updatePublisherStudio();
  });
}

document.querySelectorAll('.studio-code-panel .code-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.studio-code-panel .code-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeSnippetType = tab.getAttribute('data-snippet');
    updatePublisherStudio();
  });
});

document.getElementById('copySnippetBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('generatedCodePre').textContent);
  const btn = document.getElementById('copySnippetBtn');
  btn.textContent = '✅ Copied!';
  setTimeout(() => { btn.textContent = '📋 Copy Code'; }, 1800);
});

const webWpBtn = document.getElementById('downloadWebWpPluginBtn');
if (webWpBtn) {
  webWpBtn.addEventListener('click', () => {
    const cfg = getStudioConfig();
    const domainVal = (document.getElementById('creatorDomainInput').value || 'aliceblog.com').trim();
    const phpCode = `<?php
/**
 * Plugin Name: PaidAttention — Pay Attention Online (${domainVal})
 * Description: Automatically adds your PaidAttention micropayment tag to WordPress <head>.
 * Version: 2.0.0
 * License: MIT
 */
if (!defined('ABSPATH')) exit;
add_action('wp_head', function() {
  echo '<meta name="paidattention" content="domain:${domainVal}" data-category="${cfg.category}" data-t-grace="${cfg.tGrace}" data-t-cap="${cfg.tCap}" data-p-cap="${cfg.pInit.toFixed(3)}" />' . "\\n";
}, 1);
`;
    const blob = new Blob([phpCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paidattention-wordpress.php';
    a.click();
    URL.revokeObjectURL(url);
    webWpBtn.textContent = '✅ Downloaded Plugin!';
    setTimeout(() => { webWpBtn.textContent = '📥 Download WordPress Plugin (.php)'; }, 2000);
  });
}

document.getElementById('publishToCatalogBtn').addEventListener('click', () => {
  const cfg = getStudioConfig();
  const newItem = {
    id: cfg.contentId,
    title: cfg.title,
    creator: cfg.creator,
    category: cfg.category,
    pInit: cfg.pInit,
    pFloor: cfg.pFloor,
    rTarget: cfg.rTarget,
    tGrace: cfg.tGrace,
    tMid: Math.round((cfg.tGrace + cfg.tCap) / 2.2),
    tCap: cfg.tCap,
    steepness: 0.13,
    totalRevenue: 0.00,
    thumbsUpCount: 1,
    userThumbedUp: true,
    platformSplitText: `${cfg.platformPct}% Platform / ${100 - cfg.platformPct}% Creator(s)`,
    rationale: cfg.rationale,
    regionTag: 'GLOBAL',
    cultureLabel: '🆕 Custom Studio Release',
    chunks: [
      `<strong>[Free Grace Preview — 0s to ${cfg.tGrace}s]</strong> "${cfg.title}" — Configured in v2.0 Studio.`,
      `<strong>[Chunk #2 — Collective Buyout Target: $${cfg.rTarget.toLocaleString()}]</strong> Streaming via ZK-Blinded vouchers (${cfg.platformPct}% Platform / ${100 - cfg.platformPct}% Creator).`,
      `<strong>[Chunk #3 — K/N Thumbs-Up Pool Active]</strong> Eligible for up to +100% quality boost from upvoting viewers.`,
      `<strong>[Chunk #4 — Cap Reached at ${cfg.tCap}s]</strong> Marginal rate is now $0.00000/s for ${cfg.epochResetHours}h.`
    ]
  };
  CONTENT_CATALOG.unshift(newItem);
  switchMode('consumer');
  selectContent(newItem.id);
});

// ============================================================================
// 11. REAL METAMASK + BASE SEPOLIA TESTNET CONNECTION (Chain ID: 84532 / 0x14a34)
// ============================================================================
async function connectMetaMaskBaseSepolia() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask (or an Ethereum browser wallet) was not detected. Install MetaMask or open this page in a browser with MetaMask enabled.');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const addr = accounts[0];
    if (!addr) return;

    // Switch to or add Base Sepolia Testnet (Chain ID 84532 = 0x14a34)
    const BASE_SEPOLIA_CHAIN_ID = '0x14a34';
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }]
      });
    } catch (switchErr) {
      if (switchErr.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: BASE_SEPOLIA_CHAIN_ID,
            chainName: 'Base Sepolia Testnet',
            nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org']
          }]
        });
      }
    }

    const shortAddr = `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    state.connectedWallet = addr;

    const topBtn = document.getElementById('connectMetaMaskBtn');
    if (topBtn) topBtn.textContent = `🟢 ${shortAddr}`;
    const hudLabel = document.getElementById('walletHudLabel');
    if (hudLabel) hudLabel.textContent = `Wallet (Base Sepolia)`;

    const creatorInput = document.getElementById('pubCreatorInput');
    if (creatorInput) creatorInput.value = addr;

    const creatorBtn = document.getElementById('creatorConnectMetaMaskBtn');
    if (creatorBtn) creatorBtn.textContent = `✅ Connected: ${shortAddr} (Base Sepolia)`;

    const creatorStatus = document.getElementById('creatorMetaMaskStatus');
    if (creatorStatus) creatorStatus.textContent = `Auto-filled ${shortAddr} into your website tag!`;

    logSettlementTx(
      `🦊 MetaMask Connected on Base Sepolia (${shortAddr})`,
      `Ready for testnet voucher signing & direct creator payouts.`
    );
    updatePublisherStudio();
  } catch (err) {
    console.warn('MetaMask connection cancelled or failed:', err);
  }
}

['connectMetaMaskBtn', 'creatorConnectMetaMaskBtn'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', connectMetaMaskBaseSepolia);
});

// Initial Boot
computeMacroThermostat();
renderCatalog();
updateViewport();
drawCharts();
updatePublisherStudio();
logSettlementTx(
  '⚡ PaidAttention v2.0 Initialized',
  '15s preview countdown, Smart Quality Boost, & $200 Protected Wallet active.'
);
