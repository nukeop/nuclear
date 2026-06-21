import React, { useCallback } from 'react';

type UseTitleBarDragOptions = {
  onMaximize: () => void;
  onStartDrag?: () => void;
};

export const useTitleBarDrag = ({
  onMaximize,
  onStartDrag,
}: UseTitleBarDragOptions) =>
  useCallback(
    (event: React.MouseEvent) => {
      if (
        (event.target as HTMLElement).closest('button') ||
        event.buttons !== 1
      ) {
        return;
      }

      if (event.detail === 2) {
        onMaximize();
      } else {
        onStartDrag?.();
      }
    },
    [onMaximize, onStartDrag],
  );
