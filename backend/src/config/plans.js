// Single source of truth for the 4 subscription tiers.
// Used by seller signup, product-limit enforcement, ranking, and Razorpay order creation.

export const PLANS = {
  basic: {
    key: "basic",
    label: "Basic",
    annualFee: 1999,
    productLimit: 50,
    landingPageTier: "standard",
    searchPriority: 1,
    bannerCreditsPerYear: 0,
    hasVideo: false,
    hasAnalyticsDashboard: false,
    hasWhatsappBroadcast: false,
    rankingScope: "none",
    customDomain: false,
    dedicatedManager: false,
  },
  silver: {
    key: "silver",
    label: "Silver",
    annualFee: 4999,
    productLimit: 200,
    landingPageTier: "premium",
    searchPriority: 2,
    bannerCreditsPerYear: 1,
    hasVideo: false,
    hasAnalyticsDashboard: true,
    hasWhatsappBroadcast: false,
    rankingScope: "pincode",
    customDomain: false,
    dedicatedManager: false,
  },
  gold: {
    key: "gold",
    label: "Gold",
    annualFee: 9999,
    productLimit: 500,
    landingPageTier: "premium",
    searchPriority: 3,
    bannerCreditsPerYear: 1,
    hasVideo: true,
    hasAnalyticsDashboard: true,
    hasWhatsappBroadcast: true,
    rankingScope: "city",
    customDomain: false,
    dedicatedManager: false,
  },
  platinum: {
    key: "platinum",
    label: "Platinum",
    annualFee: 19999,
    productLimit: Infinity,
    landingPageTier: "premium",
    searchPriority: 4,
    bannerCreditsPerYear: 1,
    hasVideo: true,
    hasAnalyticsDashboard: true,
    hasWhatsappBroadcast: true,
    rankingScope: "state",
    customDomain: true,
    dedicatedManager: true,
  },
};

export const PLAN_KEYS = Object.keys(PLANS);

export function getPlan(key) {
  const plan = PLANS[key];
  if (!plan) throw new Error(`Unknown plan: ${key}`);
  return plan;
}
