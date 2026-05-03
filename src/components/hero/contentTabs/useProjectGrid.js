import { useEffect, useMemo, useState } from "react";

const getOptimalCols = (count, maxCols) => {
  if (count <= 0 || maxCols <= 1) return maxCols;
  if (count <= maxCols) return count;

  const minCols = Math.max(3, maxCols - 2);
  if (minCols > maxCols) return maxCols;

  let bestCols = maxCols;
  let bestEmpty = count % maxCols === 0 ? 0 : maxCols - (count % maxCols);

  for (let cols = maxCols; cols >= minCols; cols -= 1) {
    const remainder = count % cols;
    const empty = remainder === 0 ? 0 : cols - remainder;

    if (empty < bestEmpty) {
      bestEmpty = empty;
      bestCols = cols;
    }

    if (empty === 0) break;
  }

  return bestCols;
};

const getMaxColsForWidth = () => {
  const width = window.innerWidth;
  if (width <= 360) return 1;
  if (width <= 900) return 2;
  if (width <= 1100) return 3;
  return 4;
};

export const useProjectGrid = (projectCount) => {
  const [maxCols, setMaxCols] = useState(getMaxColsForWidth);

  useEffect(() => {
    const handleResize = () => setMaxCols(getMaxColsForWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return useMemo(() => {
    const optimalCols = getOptimalCols(projectCount, maxCols);
    const lastRowCount = projectCount % optimalCols;
    const lastRowStartIdx = lastRowCount > 0 ? projectCount - lastRowCount : -1;
    const lastRowOffset = lastRowCount > 0 ? Math.floor((optimalCols - lastRowCount) / 2) + 1 : 0;

    return {
      adaptiveGridStyle: { gridTemplateColumns: `repeat(${optimalCols}, 1fr)` },
      lastRowStartIdx,
      lastRowOffset,
    };
  }, [maxCols, projectCount]);
};
