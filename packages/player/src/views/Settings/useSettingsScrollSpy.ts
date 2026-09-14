import { RefObject, useCallback, useEffect, useRef } from 'react';

import { useSettingsModalStore } from '../../stores/settingsModalStore';

type UseSettingsScrollSpyOptions = {
  categories: string[];
  viewportRef: RefObject<HTMLDivElement | null>;
};

const findCategoryInView = (
  categories: string[],
  sectionRefs: Map<string, HTMLDivElement>,
  scrollTop: number,
): string | undefined => {
  const scrolledPast = categories.filter((category) => {
    const node = sectionRefs.get(category);
    return node !== undefined && node.offsetTop <= scrollTop;
  });

  return scrolledPast.at(-1) ?? categories[0];
};

export const useSettingsScrollSpy = ({
  categories,
  viewportRef,
}: UseSettingsScrollSpyOptions) => {
  const sectionRefs = useRef(new Map<string, HTMLDivElement>());
  const lastScrolledToRef = useRef<string | null>(null);
  const isScrollingProgrammaticallyRef = useRef(false);
  const settleTimerRef = useRef<number | undefined>(undefined);
  const activeItemId = useSettingsModalStore((state) => state.activeItemId);
  const selectItem = useSettingsModalStore((state) => state.selectItem);

  const registerSection = useCallback(
    (category: string) => (node: HTMLDivElement | null) => {
      if (node) {
        sectionRefs.current.set(category, node);
      } else {
        sectionRefs.current.delete(category);
      }
    },
    [],
  );

  const armSettleTimer = useCallback(() => {
    window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => {
      isScrollingProgrammaticallyRef.current = false;
    }, 150);
  }, []);

  useEffect(() => {
    const isCategorySelected =
      activeItemId !== null && categories.includes(activeItemId);
    if (!isCategorySelected && categories.length > 0) {
      selectItem(categories[0]);
    }
  }, [activeItemId, categories, selectItem]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const handleScroll = () => {
      if (isScrollingProgrammaticallyRef.current) {
        armSettleTimer();
        return;
      }
      const category = findCategoryInView(
        categories,
        sectionRefs.current,
        viewport.scrollTop,
      );
      if (category) {
        lastScrolledToRef.current = category;
        selectItem(category);
      }
    };

    viewport.addEventListener('scroll', handleScroll);
    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      window.clearTimeout(settleTimerRef.current);
    };
  }, [categories, viewportRef, selectItem, armSettleTimer]);

  useEffect(() => {
    if (!activeItemId || lastScrolledToRef.current === activeItemId) {
      return;
    }
    const target = sectionRefs.current.get(activeItemId);
    if (!target) {
      return;
    }
    lastScrolledToRef.current = activeItemId;
    isScrollingProgrammaticallyRef.current = true;
    armSettleTimer();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeItemId, armSettleTimer]);

  return { registerSection };
};
