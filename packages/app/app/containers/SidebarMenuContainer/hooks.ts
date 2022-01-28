import { useCallback, useState } from 'react';

type UseResizablePanelArgs = {
  initialWidth: number;
  collapsedWidth: number;
  collapseThreshold: number;
  isCollapsed: boolean;
  onCollapse: (isCollapsed: boolean) => void;
};

export const useResizablePanel = ({
  initialWidth,
  collapsedWidth,
  collapseThreshold,
  isCollapsed,
  onCollapse
}: UseResizablePanelArgs) => {
  const [width, setWidth] = useState(initialWidth);

  const onSetWidth = useCallback(
    (width) => {
      if (!isCollapsed && width < collapseThreshold) {
        onCollapse(true);
        setWidth(collapsedWidth);
      }

      if (isCollapsed && width >= collapseThreshold) {
        onCollapse(false);
        setWidth(collapseThreshold);
      } else {
        setWidth(width);
      }
    },
    [collapseThreshold, collapsedWidth, isCollapsed, onCollapse]
  );

  return {
    width,
    onSetWidth
  };
};
