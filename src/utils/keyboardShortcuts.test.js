import { describe, expect, it } from "vitest";

import { getTabIndexForShortcutKey, isEditableShortcutTarget, TAB_SHORTCUT_KEYS } from "./keyboardShortcuts";

describe("keyboard shortcut helpers", () => {
  it("maps number keys to the correct tab indexes", () => {
    expect(TAB_SHORTCUT_KEYS).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);
    expect(getTabIndexForShortcutKey("1")).toBe(0);
    expect(getTabIndexForShortcutKey("5")).toBe(4);
    expect(getTabIndexForShortcutKey("0")).toBe(9);
    expect(getTabIndexForShortcutKey("r")).toBeNull();
  });

  it("detects editable targets so shortcuts can be ignored while typing", () => {
    expect(isEditableShortcutTarget(document.createElement("input"))).toBe(true);
    expect(isEditableShortcutTarget(document.createElement("textarea"))).toBe(true);
    expect(isEditableShortcutTarget(document.createElement("select"))).toBe(true);
    expect(isEditableShortcutTarget(document.createElement("button"))).toBe(false);

    const editable = document.createElement("div");
    editable.contentEditable = "true";
    expect(isEditableShortcutTarget(editable)).toBe(true);
  });
});
