import { useRouterState } from '@tanstack/react-router';
import { useRef } from 'react';

export const useCanGoForward = (): boolean => {
  const maxIndexRef = useRef(0);

  return useRouterState({
    select: (state) => {
      const currentIndex = state.location.state.__TSR_index;

      if (currentIndex >= maxIndexRef.current) {
        maxIndexRef.current = currentIndex;
      }

      return currentIndex < maxIndexRef.current;
    },
  });
};
