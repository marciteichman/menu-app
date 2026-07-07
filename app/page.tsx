"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_RECENTS,
  FoodImageCache,
  getFallbackEmoji,
  getNextImageUrl,
  getSearchTerm,
  mergeRecentFoods,
  normalizeFoodName,
  parseFoods,
  shuffleItems
} from "./menu-utils";

type ImageStatus = "idle" | "loading" | "ready" | "fallback" | "error";

type FoodCard = {
  id: string;
  name: string;
  normalizedName: string;
  imageUrl: string | null;
  status: ImageStatus;
};

const IMAGE_CACHE_KEY = "breakfast-menu-image-cache";
const RECENT_FOODS_KEY = "breakfast-menu-recent-foods";

function createFoodCard(name: string): FoodCard {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    name: name.trim(),
    normalizedName: normalizeFoodName(name),
    imageUrl: null,
    status: "idle"
  };
}

async function searchWikimediaImages(foodName: string) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: getSearchTerm(foodName),
    gsrnamespace: "6",
    gsrlimit: "16",
    prop: "imageinfo",
    iiprop: "url|mime",
    iiurlwidth: "700",
    format: "json",
    origin: "*"
  });

  const response = await fetch(
    `https://commons.wikimedia.org/w/api.php?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Wikimedia image search failed");
  }

  const data = (await response.json()) as {
    query?: {
      pages?: Record<
        string,
        {
          imageinfo?: Array<{
            mime?: string;
            thumburl?: string;
            url?: string;
          }>;
        }
      >;
    };
  };

  return Object.values(data.query?.pages ?? {})
    .flatMap((page) => page.imageinfo ?? [])
    .filter((image) => image.mime?.startsWith("image/"))
    .map((image) => image.thumburl ?? image.url)
    .filter((url): url is string => Boolean(url))
    .filter((url) => !url.toLowerCase().endsWith(".svg"))
    .filter((url, index, urls) => urls.indexOf(url) === index);
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be disabled in private or restricted browser contexts.
  }
}

export default function BreakfastMenuApp() {
  const [input, setInput] = useState("");
  const [foods, setFoods] = useState<FoodCard[]>([]);
  const [imageCache, setImageCache] = useState<FoodImageCache>({});
  const [recentFoods, setRecentFoods] = useState(DEFAULT_RECENTS);

  useEffect(() => {
    setImageCache(readJson<FoodImageCache>(IMAGE_CACHE_KEY, {}));
    setRecentFoods(readJson<string[]>(RECENT_FOODS_KEY, DEFAULT_RECENTS));
  }, []);

  useEffect(() => {
    writeJson(IMAGE_CACHE_KEY, imageCache);
  }, [imageCache]);

  useEffect(() => {
    writeJson(RECENT_FOODS_KEY, recentFoods);
  }, [recentFoods]);

  async function chooseImage(food: FoodCard, forceDifferent = false) {
    setFoods((current) =>
      current.map((item) =>
        item.id === food.id ? { ...item, status: "loading" } : item
      )
    );

    try {
      const cached = imageCache[food.normalizedName];
      const results = cached?.results.length
        ? cached.results
        : await searchWikimediaImages(food.name);
      const nextUrl = getNextImageUrl(results, cached, forceDifferent);

      if (!nextUrl) {
        setImageCache((current) => ({
          ...current,
          [food.normalizedName]: {
            results,
            usedUrls: current[food.normalizedName]?.usedUrls ?? [],
            currentUrl: null
          }
        }));
        updateFoodImage(food.id, null, "fallback");
        return;
      }

      setImageCache((current) => {
        const currentEntry = current[food.normalizedName];
        const usedUrls = Array.from(
          new Set([...(currentEntry?.usedUrls ?? cached?.usedUrls ?? []), nextUrl])
        );

        return {
          ...current,
          [food.normalizedName]: {
            results,
            usedUrls,
            currentUrl: nextUrl
          }
        };
      });
      updateFoodImage(food.id, nextUrl, "ready");
    } catch {
      updateFoodImage(food.id, null, "error");
    }
  }

  function updateFoodImage(id: string, imageUrl: string | null, status: ImageStatus) {
    setFoods((current) =>
      current.map((item) =>
        item.id === id ? { ...item, imageUrl, status } : item
      )
    );
  }

  function createMenu(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedFoods = parseFoods(input);
    const nextFoods = parsedFoods.map(createFoodCard);

    setFoods(nextFoods);
    setRecentFoods((current) => mergeRecentFoods(current, parsedFoods));
    nextFoods.forEach((food) => void chooseImage(food));
  }

  function addRecentFood(food: string) {
    const existingFoods = parseFoods(input);
    const alreadyAdded = existingFoods.some(
      (existingFood) =>
        normalizeFoodName(existingFood) === normalizeFoodName(food)
    );

    if (alreadyAdded) {
      return;
    }

    setInput((current) => {
      const trimmed = current.trim();
      return trimmed ? `${trimmed}, ${food}` : food;
    });
  }

  function removeFood(id: string) {
    setFoods((current) => current.filter((food) => food.id !== id));
  }

  function editFood(id: string) {
    const food = foods.find((item) => item.id === id);

    if (!food) {
      return;
    }

    const nextName = window.prompt("Edit food name", food.name)?.trim();

    if (!nextName) {
      return;
    }

    const updatedFood: FoodCard = {
      ...food,
      name: nextName,
      normalizedName: normalizeFoodName(nextName),
      imageUrl: null,
      status: "idle"
    };

    setFoods((current) =>
      current.map((item) => (item.id === id ? updatedFood : item))
    );
    setRecentFoods((current) => mergeRecentFoods(current, [nextName]));
    void chooseImage(updatedFood);
  }

  const hasFoods = foods.length > 0;
  const statusText = useMemo(() => {
    if (!hasFoods) {
      return "Add breakfast foods to make today's picture menu.";
    }

    return `${foods.length} food${foods.length === 1 ? "" : "s"} on the menu`;
  }, [foods.length, hasFoods]);

  return (
    <main className="app-shell">
      <FoodInputPanel
        input={input}
        recentFoods={recentFoods}
        hasFoods={hasFoods}
        onInputChange={setInput}
        onCreateMenu={createMenu}
        onClearMenu={() => setFoods([])}
        onAddRecentFood={addRecentFood}
      />

      <MenuToolbar
        statusText={statusText}
        hasFoods={hasFoods}
        onShuffle={() => setFoods((current) => shuffleItems(current))}
        onPrint={() => window.print()}
      />

      {hasFoods ? (
        <FoodGrid
          foods={foods}
          onRegenerate={(food) => chooseImage(food, true)}
          onEdit={editFood}
          onRemove={removeFood}
          onImageError={(food) => updateFoodImage(food.id, null, "fallback")}
        />
      ) : (
        <EmptyMenu />
      )}
    </main>
  );
}

function FoodInputPanel({
  input,
  recentFoods,
  hasFoods,
  onInputChange,
  onCreateMenu,
  onClearMenu,
  onAddRecentFood
}: {
  input: string;
  recentFoods: string[];
  hasFoods: boolean;
  onInputChange: (value: string) => void;
  onCreateMenu: (event: FormEvent<HTMLFormElement>) => void;
  onClearMenu: () => void;
  onAddRecentFood: (food: string) => void;
}) {
  return (
    <section className="menu-builder" aria-label="Breakfast menu builder">
      <div>
        <p className="eyebrow">Breakfast Menu</p>
        <h1>Today&apos;s picture menu</h1>
      </div>

      <form onSubmit={onCreateMenu} className="food-form">
        <label htmlFor="foods" className="visually-hidden">
          Breakfast foods
        </label>
        <textarea
          id="foods"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Type breakfast foods separated by commas, like: Cheerios, mango, apples, omelet"
        />
        <div className="form-actions">
          <button type="submit" className="primary-action">
            Create Breakfast Menu
          </button>
          <button
            type="button"
            className="secondary-action"
            onClick={onClearMenu}
            disabled={!hasFoods}
          >
            Clear Menu
          </button>
        </div>
      </form>

      <RecentFoodChips foods={recentFoods} onAddFood={onAddRecentFood} />
    </section>
  );
}

function RecentFoodChips({
  foods,
  onAddFood
}: {
  foods: string[];
  onAddFood: (food: string) => void;
}) {
  return (
    <div className="recent-foods" aria-label="Recently used breakfast foods">
      {foods.map((food) => (
        <button key={food} type="button" onClick={() => onAddFood(food)}>
          {food}
        </button>
      ))}
    </div>
  );
}

function MenuToolbar({
  statusText,
  hasFoods,
  onShuffle,
  onPrint
}: {
  statusText: string;
  hasFoods: boolean;
  onShuffle: () => void;
  onPrint: () => void;
}) {
  return (
    <section className="menu-toolbar" aria-label="Menu actions">
      <p>{statusText}</p>
      <div>
        <button type="button" onClick={onShuffle} disabled={!hasFoods}>
          Shuffle order
        </button>
        <button type="button" onClick={onPrint} disabled={!hasFoods}>
          Print / Save as PDF
        </button>
      </div>
    </section>
  );
}

function FoodGrid({
  foods,
  onRegenerate,
  onEdit,
  onRemove,
  onImageError
}: {
  foods: FoodCard[];
  onRegenerate: (food: FoodCard) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onImageError: (food: FoodCard) => void;
}) {
  return (
    <section className="food-grid" aria-label="Visual breakfast menu">
      {foods.map((food) => (
        <FoodCardView
          key={food.id}
          food={food}
          onRegenerate={onRegenerate}
          onEdit={onEdit}
          onRemove={onRemove}
          onImageError={onImageError}
        />
      ))}
    </section>
  );
}

function FoodCardView({
  food,
  onRegenerate,
  onEdit,
  onRemove,
  onImageError
}: {
  food: FoodCard;
  onRegenerate: (food: FoodCard) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onImageError: (food: FoodCard) => void;
}) {
  return (
    <article className="food-card">
      <div className="food-image-wrap">
        {food.status === "loading" ? (
          <div className="food-placeholder" aria-live="polite">
            Finding picture...
          </div>
        ) : food.imageUrl ? (
          <img
            src={food.imageUrl}
            alt={`${food.name} breakfast food`}
            onError={() => onImageError(food)}
          />
        ) : (
          <div
            className="food-fallback"
            role="img"
            aria-label={`${food.name} breakfast food`}
          >
            {getFallbackEmoji(food.name)}
          </div>
        )}
      </div>

      <div className="card-controls">
        <button type="button" onClick={() => onRegenerate(food)}>
          Regenerate picture
        </button>
        <button type="button" onClick={() => onEdit(food.id)}>
          Edit
        </button>
        <button type="button" onClick={() => onRemove(food.id)}>
          Remove
        </button>
      </div>
    </article>
  );
}

function EmptyMenu() {
  return (
    <section className="empty-state" aria-label="Empty menu">
      <div>🥞</div>
      <p>Your breakfast pictures will appear here.</p>
    </section>
  );
}
