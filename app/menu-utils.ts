export type FoodImageCache = Record<
  string,
  {
    results: string[];
    usedUrls: string[];
    currentUrl: string | null;
  }
>;

export const MAX_RECENT_FOODS = 14;

export const DEFAULT_RECENTS = [
  "Cheerios",
  "mango",
  "apples",
  "omelet",
  "pancakes",
  "bagel",
  "yogurt"
];

const FOOD_EMOJIS: Record<string, string> = {
  apple: "🍎",
  apples: "🍎",
  bagel: "🥯",
  banana: "🍌",
  cereal: "🥣",
  cheerios: "🥣",
  egg: "🥚",
  eggs: "🥚",
  mango: "🥭",
  omelet: "🍳",
  omelette: "🍳",
  pancake: "🥞",
  pancakes: "🥞",
  toast: "🍞",
  waffle: "🧇",
  waffles: "🧇",
  yogurt: "🥣"
};

export function normalizeFoodName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function parseFoods(input: string) {
  const seen = new Set<string>();

  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const normalized = normalizeFoodName(item);

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
}

export function getSearchTerm(foodName: string) {
  const normalized = normalizeFoodName(foodName);

  if (normalized === "cheerios") {
    return "cereal bowl food";
  }

  if (normalized === "apple" || normalized === "apples") {
    return "apple fruit food";
  }

  return `${normalized} food`;
}

export function getFallbackEmoji(foodName: string) {
  const normalized = normalizeFoodName(foodName);
  const directMatch = FOOD_EMOJIS[normalized];

  if (directMatch) {
    return directMatch;
  }

  const partialMatch = Object.keys(FOOD_EMOJIS).find((key) =>
    normalized.includes(key)
  );

  return partialMatch ? FOOD_EMOJIS[partialMatch] : "🍽️";
}

export function shuffleItems<T>(items: T[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index]
    ];
  }

  return shuffled;
}

export function mergeRecentFoods(current: string[], nextFoods: string[]) {
  return [
    ...nextFoods,
    ...current.filter(
      (food) =>
        !nextFoods.some(
          (nextFood) =>
            normalizeFoodName(nextFood) === normalizeFoodName(food)
        )
    )
  ].slice(0, MAX_RECENT_FOODS);
}

export function getNextImageUrl(
  results: string[],
  cached:
    | {
        usedUrls: string[];
        currentUrl: string | null;
      }
    | undefined,
  forceDifferent: boolean
) {
  if (!forceDifferent && cached?.currentUrl && results.includes(cached.currentUrl)) {
    return cached.currentUrl;
  }

  const usedUrls = forceDifferent ? cached?.usedUrls ?? [] : [];

  return (
    results.find(
      (url) => url !== cached?.currentUrl && !usedUrls.includes(url)
    ) ?? null
  );
}
