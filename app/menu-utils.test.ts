import { describe, expect, it } from "vitest";
import {
  getFallbackEmoji,
  getNextImageUrl,
  getSearchTerm,
  mergeRecentFoods,
  parseFoods
} from "./menu-utils";

describe("parseFoods", () => {
  it("trims empty entries and removes duplicates without changing display text", () => {
    expect(parseFoods(" Cheerios, mango, , cheerios, Sliced  Mango ")).toEqual([
      "Cheerios",
      "mango",
      "Sliced  Mango"
    ]);
  });
});

describe("mergeRecentFoods", () => {
  it("puts new foods first and keeps only one copy of a food", () => {
    expect(
      mergeRecentFoods(["Cheerios", "bagel", "yogurt"], ["bagel", "apples"])
    ).toEqual(["bagel", "apples", "Cheerios", "yogurt"]);
  });

  it("limits the recent food list", () => {
    const current = Array.from({ length: 20 }, (_, index) => `food ${index}`);

    expect(mergeRecentFoods(current, ["waffles"])).toHaveLength(14);
  });
});

describe("getSearchTerm", () => {
  it("uses friendlier search terms for foods that need them", () => {
    expect(getSearchTerm("Cheerios")).toBe("cereal bowl food");
    expect(getSearchTerm("apples")).toBe("apple fruit food");
  });

  it("adds a food keyword for general searches", () => {
    expect(getSearchTerm("sliced mango")).toBe("sliced mango food");
  });
});

describe("getNextImageUrl", () => {
  it("reuses the current image when a new picture is not requested", () => {
    expect(
      getNextImageUrl(
        ["first.jpg", "second.jpg"],
        { currentUrl: "first.jpg", usedUrls: ["first.jpg"] },
        false
      )
    ).toBe("first.jpg");
  });

  it("picks a different unused image when requested", () => {
    expect(
      getNextImageUrl(
        ["first.jpg", "second.jpg", "third.jpg"],
        { currentUrl: "first.jpg", usedUrls: ["first.jpg"] },
        true
      )
    ).toBe("second.jpg");
  });
});

describe("getFallbackEmoji", () => {
  it("uses known food emojis and falls back for unknown foods", () => {
    expect(getFallbackEmoji("banana slices")).toBe("🍌");
    expect(getFallbackEmoji("mystery breakfast")).toBe("🍽️");
  });
});
