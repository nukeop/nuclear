import { useVirtualizer } from '@tanstack/react-virtual';
import { RefObject, useLayoutEffect } from 'react';

type UseVirtualRowsOptions = {
  count: number;
  rowHeight: number;
  overscan: number;
  scrollParentRef: RefObject<HTMLDivElement | null>;
};

export const useVirtualRows = ({
  count,
  rowHeight,
  overscan,
  scrollParentRef,
}: UseVirtualRowsOptions) => {
  const virtualizer = useVirtualizer({
    count,
    estimateSize: () => rowHeight,
    getScrollElement: () => scrollParentRef.current,
    overscan,
  });

  useLayoutEffect(() => {
    virtualizer.measure();
  }, [virtualizer, rowHeight]);

  const virtualItems = virtualizer.getVirtualItems();
  const firstRowStart = virtualItems.at(0)?.start ?? 0;
  const lastRowEnd = virtualItems.at(-1)?.end ?? 0;

  return {
    virtualItems,
    paddingTop: firstRowStart,
    paddingBottom: virtualizer.getTotalSize() - lastRowEnd,
  };
};
