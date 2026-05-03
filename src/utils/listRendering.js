export const normalizeListValue = (value) =>
  typeof value === "string" ? value.trim() : "";

export const getRenderableListValues = (values = []) =>
  values.map(normalizeListValue).filter(Boolean);

export const getListItemKey = (scope, value, index) =>
  `${scope}-${index}-${normalizeListValue(value) || "item"}`;
