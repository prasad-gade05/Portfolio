export const TAB_SHORTCUT_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export const getTabIndexForShortcutKey = (key) => {
  if (!TAB_SHORTCUT_KEYS.includes(key)) {
    return null;
  }

  return key === "0" ? 9 : Number(key) - 1;
};

export const isEditableShortcutTarget = (target) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  const contentEditable = target.getAttribute("contenteditable");

  return (
    target.isContentEditable ||
    target.contentEditable === "true" ||
    contentEditable === "" ||
    contentEditable === "true" ||
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT"
  );
};
