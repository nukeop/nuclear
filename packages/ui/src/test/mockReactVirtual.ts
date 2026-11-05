type MockVirtualizerOptions = {
  count: number;
  estimateSize: (index: number) => number;
};

export const useVirtualizer = ({
  count,
  estimateSize,
}: MockVirtualizerOptions) => {
  const rowHeight = estimateSize(0);
  const visibleCount = Math.min(count, 20);

  return {
    getVirtualItems: () =>
      Array.from({ length: visibleCount }, (_, index) => ({
        index,
        start: index * rowHeight,
        end: (index + 1) * rowHeight,
        key: index,
        size: rowHeight,
      })),
    getTotalSize: () => count * rowHeight,
    measureElement: () => {},
    measure: () => {},
  };
};
