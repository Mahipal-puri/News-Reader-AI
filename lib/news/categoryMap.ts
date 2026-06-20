// Strict provider category → our category mapping.
//
// Rule (from user, prompt 15): an article only appears in the category
// it genuinely belongs to. If we can't confidently map it, we DROP it
// instead of dumping it into "general".

export type OurCategory =
  | "politics"
  | "technology"
  | "business"
  | "sports"
  | "entertainment"
  | "science"
  | "health"
  | "education"
  | "finance"
  | "crypto"
  | "startups"
  | "local"
  | "world";

type Provider = "newsapi" | "gnews" | "currents";

const STRICT_MAP: Record<string, OurCategory> = {
  // NewsAPI top-headlines categories (7)
  "newsapi:business": "business",
  "newsapi:entertainment": "entertainment",
  "newsapi:health": "health",
  "newsapi:science": "science",
  "newsapi:sports": "sports",
  "newsapi:technology": "technology",
  // newsapi:general intentionally omitted -> drop

  // GNews top-headlines topics (9)
  "gnews:business": "business",
  "gnews:technology": "technology",
  "gnews:entertainment": "entertainment",
  "gnews:sports": "sports",
  "gnews:science": "science",
  "gnews:health": "health",
  "gnews:world": "world",
  "gnews:nation": "local",
  // gnews:general intentionally omitted -> drop

  // Currents per-article category strings
  "currents:business": "business",
  "currents:technology": "technology",
  "currents:programming": "technology",
  "currents:science": "science",
  "currents:entertainment": "entertainment",
  "currents:sports": "sports",
  "currents:health": "health",
  "currents:politics": "politics",
  "currents:world": "world",
  "currents:regional": "local"
  // currents: general / lifestyle / food / music / fashion / gaming /
  // arts and culture -> drop
};

// Keyword refinements for categories no provider tags directly
// (crypto, startups, finance, education) and for politics from sources
// that bury it under generic tags. Order matters — first match wins, so
// specific terms (crypto, startup) come before broader ones (finance).
const KEYWORD_RULES: Array<{ category: OurCategory; pattern: RegExp }> = [
  { category: "crypto",     pattern: /\b(bitcoin|crypto(?:currenc(?:y|ies))?|ethereum|blockchain|stablecoin|defi|nft|btc|eth)\b/i },
  { category: "startups",   pattern: /\b(startup|founders?|seed round|series\s?[a-d]\b|y\s?combinator|venture\s?capital|vc-?back(?:ed|ing))\b/i },
  { category: "finance",    pattern: /\b(stocks?\b|wall\s?street|federal\s?reserve|interest\s?rate|nasdaq|s&p\s?500|dow\s?jones|gdp\b|inflation|bond\s?yield|earnings\s?report)\b/i },
  { category: "education",  pattern: /\b(universit(?:y|ies)|colleges?|students?|tuition|curriculum|school\s?district|edtech|k-?12|professors?)\b/i },
  { category: "politics",   pattern: /\b(election|senate|congress|parliament|prime\s?minister|president(?:ial)?|cabinet|legislature|impeachment|sanction\b|geopolitic|diplomat)\b/i }
];

export function mapCategory(
  provider: Provider,
  providerCategories: string[] | undefined,
  text: string
): OurCategory | null {
  // 1. Keyword rules first. They take priority because they target
  //    fine-grained categories (crypto, startups, finance, education)
  //    that none of the three providers tag directly. Without this, a
  //    Bitcoin article tagged "business" by the provider would land in
  //    business instead of crypto.
  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(text)) return rule.category;
  }

  // 2. Strict provider category map. Walk all categories the provider
  //    attached (Currents returns arrays); first one that maps wins.
  if (providerCategories?.length) {
    for (const raw of providerCategories) {
      const key = `${provider}:${raw.toLowerCase().trim()}`;
      if (key in STRICT_MAP) return STRICT_MAP[key];
    }
  }

  // 3. No mapping -> DROP. We never default to "general".
  return null;
}
