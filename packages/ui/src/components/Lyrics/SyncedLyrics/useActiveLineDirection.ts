import { RefObject, useEffect, useState } from 'react';

export type ActiveLineDirection = 'up' | 'down';

const getDirection = (
  viewport: HTMLDivElement,
  activeLine: HTMLButtonElement,
): ActiveLineDirection | undefined => {
  const viewportRect = viewport.getBoundingClientRect();
  const lineRect = activeLine.getBoundingClientRect();
  if (lineRect.bottom < viewportRect.top) {
    return 'up';
  }
  if (lineRect.top > viewportRect.bottom) {
    return 'down';
  }
  return undefined;
};

export const useActiveLineDirection = (
  viewportRef: RefObject<HTMLDivElement>,
  activeLineRef: RefObject<HTMLButtonElement>,
  activeLineIndex: number,
) => {
  const [direction, setDirection] = useState<ActiveLineDirection>();

  useEffect(() => {
    const viewport = viewportRef.current;
    const activeLine = activeLineRef.current;
    if (!viewport || !activeLine) {
      return;
    }
    const updateDirection = () =>
      setDirection(getDirection(viewport, activeLine));
    updateDirection();
    viewport.addEventListener('scroll', updateDirection);
    return () => viewport.removeEventListener('scroll', updateDirection);
  }, [viewportRef, activeLineRef, activeLineIndex]);

  return direction;
};
