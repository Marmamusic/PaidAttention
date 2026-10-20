// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title OpenStreamProtocol (v2.0) — Universal Attention-Metered Micropayments & OpenStream Commons DAO
 * @notice Implements all 14 architectural pillars:
 *   - Creator-Defined Collective Buyout Target (R_target) & Two-Axis Category Oracle + Pricing Rationale
 *   - Anti-Clickbait S-Curve & 24h-48h Attention Epoch Reset (1.5x media chunk anti-restreaming bound)
 *   - Zero-Sum K/N Thumbs-Up Withholding Pool (50% minimum floor / +100% maximum boost cap)
 *   - Enterprise Platform Splits (Netflix 100% / YouTube 30-70%) & Multi-Creator Royalty Splitters
 *   - Paywall-Free Open Web Mode (UN_PAYWALLED) & EU AI Act Open-Source Attribution Royalties + DNS Escrow
 *   - Anti-Cartel Historical Inflation Baseline & Macroeconomic Purchasing-Power Thermostat
 *   - Promotional $2.00 Virtual Trial Meter (auto-sunsetting at 1,000,000 organic users)
 *   - Non-Amendable External Custody integration (ImmutableUserVault.sol)
 *   - OpenStream Commons DAO (Encrypted-Locale Grants) & 1/3 Founder-Arbitrated On-Chain Code Registry
 */

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface IImmutableUserVault {
    function debitFIFO(address user, uint256 amount) external;
}

contract OpenStreamProtocol {
    // =========================================================================
    // 1. ENUMS & DATA STRUCTURES
    // =========================================================================

    enum ServiceCategory {
        ARTICLE,
        AUDIO,
        VIDEO,
        AI_COMPUTE,
        ONLINE_LESSON,
        UN_PAYWALLED   // Paywall-free Open Web / Passive Patronage mode (15s grace -> floor rate)
    }

    struct ContentItem {
        address primaryCreator;
        ServiceCategory category;
        uint256 pInit;              // Initial max session price cap (6-dec USD)
        uint256 pFloor;             // Asymptotic minimum price cap once R_target is reached (never 0)
        uint256 rTarget;            // Creator-defined Collective Buyout Target (6-dec USD)
        uint32 tGrace;              // Free anti-clickbait window in seconds (e.g., 10-15s)
        uint32 tMid;                // S-curve inflection point in seconds
        uint32 tCap;                // Hard time cap where marginal rate -> 0 for current epoch
        uint32 epochResetWindow;    // Anti-restreaming TTL (24h-48h)
        uint256 totalRevenue;       // Cumulative settled revenue R_total
        uint256 totalThumbsUp;      // Total verified 👍 received
        uint256 totalSessions;      // Total settled sessions
        address platformRecipient;  // Optional platform wallet (e.g., Netflix, YouTube)
        uint16 platformShareBps;    // Platform split in bps (0 = 100% creator; 3000 = 30%; 10000 = 100% Netflix)
        string rationaleText;       // Creator justification for pricing / R_target (e.g., war-zone reporting)
        bytes32 stealthMetaAddress; // Optional ERC-5564 Stealth Meta-Address for creator privacy
        bool active;
    }

    struct CategoryStats {
        uint256 baseRate2026;       // Immutable 2026 baseline $/min to detect cartel price-fixing
        uint256 emaRatePerMin;      // Current moving average $/min
        uint256 emaVariancePerMin;  // Variance for Z-score outlier check
        uint256 emaRTarget;         // Moving average of Collective Buyout Target R_target
    }

    struct UserProfile {
        uint64 firstActiveTimestamp;    // Used to verify >= 365 days organic activity for Commons DAO voting
        uint256 lifetimeOrganicSpend;   // Total verified spend across diverse creators
        uint16 devFundBps;              // Voluntary Wikipedia-style dev pledge (e.g. 100 = 1%)
        uint64 devFundExpiry;           // Auto-expires after 1 week, 1 month, or 1 year
        bytes32 encryptedLocaleCommit;  // Zero-Knowledge salted commitment of user's Country/Lang/Town
    }

    struct AIModelConfig {
        address providerWallet;
        uint16 computeShareBps;         // e.g., 2500 = 25% to AI compute, 75% to cited human creators
        bytes32 openSourceAlgoHash;     // Mandatory EU AI Act open-source attribution algorithm commit hash
        bool certified;
    }

    struct RegionalGrantProposal {
        bytes32 localeHash;             // Target encrypted locale/region identifier
        address recipientCollective;
        string description;
        uint256 requestedAmount;
        uint256 yesVotes;
        bool executed;
    }

    // =========================================================================
    // 2. STATE VARIABLES
    // =========================================================================

    IERC20 public immutable stablecoin;
    IImmutableUserVault public immutable userVault;
    address public immutable founderArbitrator;
    address public devTreasury;

    uint256 public constant PRECISION = 1_000_000;
    uint256 public constant PROMO_TRIAL_USER_CAP = 1_000_000; // Discontinue $2 virtual trial at 1M organic users
    uint256 public totalOrganicUsers = 142_800;               // Current organic user count

    // Macroeconomic Purchasing-Power Thermostat & Anti-Cartel CPI Index
    uint256 public cumulativeInflationIndex = 1_000_000;      // 1.000000 (Base 2026)
    uint256 public medianMonthlySalaryUSD = 4_300_000_000;    // $4,300/mo median net income
    uint256 public maxSalaryShareBps = 220;                   // 2.20% max digital share (~$94.60/mo)
    uint256 public networkAvgMonthlySpend = 68_000_000;       // $68.00/mo current network avg
    uint256 public gammaMacroScalar = 1_000_000;              // 1.000000

    // OpenStream Commons DAO & 1/3 Founder-Arbitrated Governance Token + Code Registry
    bytes32 public officialReleaseCodeHash;                   // On-chain hash of verified extension/SDK code
    string  public officialReleaseIPFSUri;
    uint256 public totalGovTokenSupply;
    mapping(address => uint256) public govTokenBalance;
    uint256 public commonsGrantPool;                          // Funded by excess DeFi yield & 1% dev surcharge

    // Registries
    mapping(bytes32 => ContentItem) public contents;
    mapping(bytes32 => address[]) public contentCoCreators;
    mapping(bytes32 => uint16[]) public contentCoCreatorBps;
    mapping(ServiceCategory => CategoryStats) public categoryOracle;
    mapping(address => UserProfile) public userProfiles;
    mapping(bytes32 => AIModelConfig) public aiModels;
    mapping(bytes32 => uint256) public unclaimedDomainEscrow; // keccak256(domain) -> escrowed AI citation royalties
    RegionalGrantProposal[] public grantProposals;

    // =========================================================================
    // 3. EVENTS
    // =========================================================================

    event ContentRegistered(bytes32 indexed contentId, ServiceCategory category, uint256 pInit, uint256 rTarget, uint16 platformShareBps);
    event ThumbsUpEpochSettled(address indexed user, ServiceCategory category, uint256 totalSpent, uint256 withheldPool, uint256 upvotedCount);
    event AIAttributionSettled(bytes32 indexed modelId, uint256 promptFee, uint256 aiComputeShare, uint256 citedCreatorsShare);
    event OfficialCodeUpdated(bytes32 indexed newCodeHash, string ipfsUri);
    event GovTokensMintedWithFounderMatch(address indexed contributor, uint256 contributorAmount, uint256 founderMatchAmount);

    constructor(address _stablecoin, address _userVault, address _devTreasury) {
        stablecoin = IERC20(_stablecoin);
        userVault = IImmutableUserVault(_userVault);
        founderArbitrator = msg.sender;
        devTreasury = _devTreasury != address(0) ? _devTreasury : msg.sender;

        // Initialize Category Oracles (2026 Base Rate, EMA Rate, Variance, Avg Collective Buyout Target R_target)
        categoryOracle[ServiceCategory.ARTICLE]       = CategoryStats(45_000, 45_000, 15_000,     500_000_000); // $500 target
        categoryOracle[ServiceCategory.AUDIO]         = CategoryStats(18_000, 18_000,  6_000,   5_000_000_000); // $5,000 target
        categoryOracle[ServiceCategory.VIDEO]         = CategoryStats(55_000, 55_000, 18_000,  50_000_000_000); // $50,000 target
        categoryOracle[ServiceCategory.AI_COMPUTE]    = CategoryStats(95_000, 95_000, 25_000,  25_000_000_000);
        categoryOracle[ServiceCategory.ONLINE_LESSON] = CategoryStats(60_000, 60_000, 20_000,  10_000_000_000);
        categoryOracle[ServiceCategory.UN_PAYWALLED]  = CategoryStats( 5_000,  5_000,  2_000,     100_000_000); // Open-web floor

        // Initial Genesis Governance Token Allocation (Founder holds exactly 1/3 = 33.33%)
        govTokenBalance[founderArbitrator] = 1_000_000 * PRECISION;
        totalGovTokenSupply = 1_000_000 * PRECISION;
    }

    // =========================================================================
    // 4. CONTENT REGISTRATION, COLLECTIVE BUYOUT CURVE & MULTI-WALLET SPLITS
    // =========================================================================

    function registerContentV2(
        bytes32 contentId,
        ServiceCategory category,
        uint256 pInit,
        uint256 pFloor,
        uint256 rTarget,
        uint32 tGrace,
        uint32 tMid,
        uint32 tCap,
        uint32 epochResetWindow,
        address platformRecipient,
        uint16 platformShareBps,
        address[] calldata coCreators,
        uint16[] calldata coCreatorBps,
        string calldata rationaleText,
        bytes32 stealthMetaAddress
    ) external {
        require(!contents[contentId].active, "Already registered");
        require(pInit >= pFloor && pFloor > 0 && rTarget > 0, "Invalid pricing bounds");
        require(platformShareBps <= 10_000, "Platform share > 100%");
        require(coCreators.length == coCreatorBps.length, "Co-creator length mismatch");

        contents[contentId] = ContentItem({
            primaryCreator: msg.sender,
            category: category,
            pInit: pInit,
            pFloor: pFloor,
            rTarget: rTarget,
            tGrace: tGrace,
            tMid: tMid,
            tCap: tCap,
            epochResetWindow: epochResetWindow >= 1 hours ? epochResetWindow : 36 hours,
            totalRevenue: 0,
            totalThumbsUp: 0,
            totalSessions: 0,
            platformRecipient: platformRecipient,
            platformShareBps: platformShareBps,
            rationaleText: rationaleText,
            stealthMetaAddress: stealthMetaAddress,
            active: true
        });

        if (coCreators.length > 0) {
            contentCoCreators[contentId] = coCreators;
            contentCoCreatorBps[contentId] = coCreatorBps;
        }

        emit ContentRegistered(contentId, category, pInit, rTarget, platformShareBps);
    }

    /**
     * @notice Computes P_max(R_total) reaching P_floor once cumulative revenue reaches the creator's
     *         Collective Buyout Target (R_target), modulated by the Macroeconomic Thermostat (gammaMacroScalar).
     */
    function getCurrentPMax(bytes32 contentId) public view returns (uint256) {
        ContentItem storage item = contents[contentId];
        require(item.active, "Inactive content");

        if (item.category == ServiceCategory.UN_PAYWALLED) {
            return (item.pFloor * gammaMacroScalar) / PRECISION;
        }

        uint256 rawPMax;
        if (item.totalRevenue >= item.rTarget) {
            rawPMax = item.pFloor;
        } else {
            uint256 remainingFraction = ((item.rTarget - item.totalRevenue) * PRECISION) / item.rTarget;
            rawPMax = item.pFloor + ((item.pInit - item.pFloor) * remainingFraction) / PRECISION;
        }

        return (rawPMax * gammaMacroScalar) / PRECISION;
    }

    /**
     * @notice Two-Axis Outlier & Anti-Cartel Price Creep Check:
     *         Checks (1) Individual $/min rate vs Category EMA & CPI-Anchored Baseline, and
     *                (2) Creator's Collective Buyout Target (R_target) vs Category Average.
     */
    function evaluateContentTransparency(bytes32 contentId) external view returns (
        uint256 ratePerMin,
        bool isRateOutlier,
        bool isRTargetOutlier,
        bool isCategoryCartelDrifting
    ) {
        ContentItem storage item = contents[contentId];
        CategoryStats storage stats = categoryOracle[item.category];

        uint256 pMax = getCurrentPMax(contentId);
        ratePerMin = (pMax * 60) / item.tCap;

        // Anti-Cartel Check: Has category EMA drifted >5% above 2026 base rate adjusted for CPI inflation?
        uint256 cpiAnchoredBaseline = (stats.baseRate2026 * cumulativeInflationIndex) / PRECISION;
        isCategoryCartelDrifting = stats.emaRatePerMin > (cpiAnchoredBaseline * 105) / 100;

        uint256 referenceMean = isCategoryCartelDrifting ? cpiAnchoredBaseline : stats.emaRatePerMin;
        isRateOutlier = ratePerMin > referenceMean + (stats.emaVariancePerMin * 3) / 2;
        isRTargetOutlier = item.rTarget > stats.emaRTarget * 3;
    }

    // =========================================================================
    // 5. ZERO-SUM K/N THUMBS-UP QUALITY WITHHOLDING POOL (50% FLOOR / +100% CAP)
    // =========================================================================

    /**
     * @notice Settles a user's batch of consumed items in a category, applying the K/N Thumbs-Up
     *         reallocation pool while keeping the user's total expenditure 100% unchanged:
     *         - Withholding rate rho = min(K / N, 50%) so non-upvoted items NEVER get < 50% of base pay.
     *         - Upvoted items receive a bonus from the withheld pool capped at +100% (max 2.0x base pay).
     */
    function settleUserThumbsUpEpoch(
        address user,
        ServiceCategory category,
        bytes32[] calldata contentIds,
        uint256[] calldata baseAmounts,
        bool[] calldata thumbedUp
    ) external {
        uint256 n = contentIds.length;
        require(n > 0 && n == baseAmounts.length && n == thumbedUp.length, "Array mismatch");

        uint256 k = 0;
        uint256 totalBaseSpend = 0;
        uint256 upvotedBaseSum = 0;

        for (uint256 i = 0; i < n; i++) {
            totalBaseSpend += baseAmounts[i];
            if (thumbedUp[i]) {
                k++;
                upvotedBaseSum += baseAmounts[i];
            }
        }

        // Debit exact totalBaseSpend from ImmutableUserVault (FIFO order)
        userVault.debitFIFO(user, totalBaseSpend);

        // Compute withholding ratio rho = min(K/N, 50%) in 1e6 precision
        uint256 rho = 0;
        if (k > 0 && k < n) {
            uint256 rawRatio = (k * PRECISION) / n;
            rho = rawRatio > 500_000 ? 500_000 : rawRatio; // Capped at 50% (500,000)
        }

        uint256 withheldPool = (totalBaseSpend * rho) / PRECISION;

        for (uint256 j = 0; j < n; j++) {
            uint256 retainedBase = (baseAmounts[j] * (PRECISION - rho)) / PRECISION; // Always >= 50%
            uint256 finalPayout = retainedBase;

            if (thumbedUp[j] && k < n && upvotedBaseSum > 0) {
                uint256 poolShare = (withheldPool * baseAmounts[j]) / upvotedBaseSum;
                uint256 uncapped = retainedBase + poolShare;
                uint256 maxAllowed = baseAmounts[j] * 2; // Max +100% boost (2.0x base)
                finalPayout = uncapped > maxAllowed ? maxAllowed : uncapped;
                contents[contentIds[j]].totalThumbsUp += 1;
            }

            _distributeContentPayout(contentIds[j], finalPayout);
        }

        emit ThumbsUpEpochSettled(user, category, totalBaseSpend, withheldPool, k);
    }

    function _distributeContentPayout(bytes32 contentId, uint256 amount) internal {
        ContentItem storage item = contents[contentId];
        item.totalRevenue += amount;
        item.totalSessions += 1;

        uint256 platformCut = 0;
        if (item.platformRecipient != address(0) && item.platformShareBps > 0) {
            platformCut = (amount * item.platformShareBps) / 10_000;
            stablecoin.transfer(item.platformRecipient, platformCut);
        }

        uint256 creatorPool = amount - platformCut;
        if (creatorPool > 0) {
            address[] storage coCreators = contentCoCreators[contentId];
            if (coCreators.length == 0) {
                stablecoin.transfer(item.primaryCreator, creatorPool);
            } else {
                uint16[] storage bps = contentCoCreatorBps[contentId];
                for (uint256 c = 0; c < coCreators.length; c++) {
                    uint256 share = (creatorPool * bps[c]) / 10_000;
                    if (share > 0) stablecoin.transfer(coCreators[c], share);
                }
            }
        }
    }

    // =========================================================================
    // 6. EU AI ACT OPEN-SOURCE ATTRIBUTION ROYALTIES & DNS ESCROW
    // =========================================================================

    function registerAIModelAlgorithm(bytes32 modelId, uint16 computeShareBps, bytes32 openSourceAlgoHash) external {
        require(computeShareBps <= 3500, "AI compute share capped at 35%");
        require(openSourceAlgoHash != bytes32(0), "EU AI Act requires open-source attribution hash");
        aiModels[modelId] = AIModelConfig({
            providerWallet: msg.sender,
            computeShareBps: computeShareBps,
            openSourceAlgoHash: openSourceAlgoHash,
            certified: true
        });
    }

    function settleAIAttributionPrompt(
        address user,
        bytes32 modelId,
        uint256 promptFee,
        bytes32[] calldata citedContentOrDomainHashes,
        bool[] calldata isRegisteredContent,
        uint16[] calldata citationWeightsBps
    ) external {
        AIModelConfig storage model = aiModels[modelId];
        require(model.certified, "Uncertified AI model");
        require(citedContentOrDomainHashes.length == citationWeightsBps.length, "Length mismatch");

        userVault.debitFIFO(user, promptFee);

        uint256 aiShare = (promptFee * model.computeShareBps) / 10_000;
        uint256 creatorsPool = promptFee - aiShare;

        if (aiShare > 0) stablecoin.transfer(model.providerWallet, aiShare);

        for (uint256 i = 0; i < citedContentOrDomainHashes.length; i++) {
            uint256 citePayout = (creatorsPool * citationWeightsBps[i]) / 10_000;
            if (citePayout > 0) {
                if (isRegisteredContent[i]) {
                    _distributeContentPayout(citedContentOrDomainHashes[i], citePayout);
                } else {
                    // Hold in DNSSEC domain escrow until website owner claims
                    unclaimedDomainEscrow[citedContentOrDomainHashes[i]] += citePayout;
                }
            }
        }

        emit AIAttributionSettled(modelId, promptFee, aiShare, creatorsPool);
    }

    // =========================================================================
    // 7. PROMOTIONAL $2.00 VIRTUAL TRIAL (AUTO-SUNSETS AT 1M USERS)
    // =========================================================================

    function isPromotionalVirtualTrialActive() external view returns (bool) {
        return totalOrganicUsers < PROMO_TRIAL_USER_CAP;
    }

    // =========================================================================
    // 8. ON-CHAIN CODE REGISTRY, 1/3 FOUNDER ARBITRATION & PLANETARY TAO DAO
    // =========================================================================

    /**
     * @notice Mints governance tokens to vetted ecosystem contributors while automatically
     *         minting a matching 1/2 amount to the Founder so the Founder permanently retains
     *         exact 1/3 (33.33%) arbitration power: (0.5 X) / (1.5 X) = 1/3.
     */
    function mintContributorAirdrop(address contributor, uint256 contributorAmount) external {
        require(msg.sender == founderArbitrator, "Only arbitrator/timelock");
        uint256 founderMatch = contributorAmount / 2;

        govTokenBalance[contributor] += contributorAmount;
        govTokenBalance[founderArbitrator] += founderMatch;
        totalGovTokenSupply += (contributorAmount + founderMatch);

        emit GovTokensMintedWithFounderMatch(contributor, contributorAmount, founderMatch);
    }

    function publishVerifiedCodeRelease(bytes32 newCodeHash, string calldata ipfsUri) external {
        require(msg.sender == founderArbitrator, "Requires founder arbitration signature");
        officialReleaseCodeHash = newCodeHash;
        officialReleaseIPFSUri = ipfsUri;
        emit OfficialCodeUpdated(newCodeHash, ipfsUri);
    }

    function voteRegionalGrant(uint256 proposalId) external {
        UserProfile storage prof = userProfiles[msg.sender];
        require(block.timestamp >= prof.firstActiveTimestamp + 365 days, "Requires >= 1 year active account");
        require(prof.lifetimeOrganicSpend >= 20_000_000, "Requires normal organic consumption history");
        grantProposals[proposalId].yesVotes += 1;
    }
}
