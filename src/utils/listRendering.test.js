import { describe, expect, it } from "vitest";

import {
  getListItemKey,
  getRenderableListValues,
  normalizeListValue,
} from "./listRendering";

describe("list rendering utilities", () => {
  it("normalizes string values for list rendering", () => {
    expect(normalizeListValue("  Technical  ")).toBe("Technical");
    expect(normalizeListValue("   ")).toBe("");
    expect(normalizeListValue(null)).toBe("");
  });

  it("drops blank list values before rendering", () => {
    expect(getRenderableListValues([" Technical ", "", "  ", "Personal"])).toEqual([
      "Technical",
      "Personal",
    ]);
  });

  it("builds stable non-empty keys even for blank values", () => {
    expect(getListItemKey("blog-category", " Technical ", 2)).toBe(
      "blog-category-2-Technical",
    );
    expect(getListItemKey("blog-category", "   ", 3)).toBe("blog-category-3-item");
  });
});
