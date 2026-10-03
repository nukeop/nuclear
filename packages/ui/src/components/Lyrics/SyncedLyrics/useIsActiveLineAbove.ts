import { RefObject, useEffect, useState } from 'react';

export const useIsActiveLineAbove = (
  viewportRef: RefObject<HTMLDivElement>,
  activeLineRef: RefObject<HTMLButtonElement>,
  activeLineIndex: number,
) => {
  const [isAbove, setIsAbove] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const activeLine = activeLineRef.current;
    if (!viewport || !activeLine) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) =>
        setIsAbove(
          entry.boundingClientRect.top < viewport.getBoundingClientRect().top,
        ),
      { root: viewport },
    );
    observer.observe(activeLine);
    return () => observer.disconnect();
  }, [viewportRef, activeLineRef, activeLineIndex]);

  return isAbove;
};
