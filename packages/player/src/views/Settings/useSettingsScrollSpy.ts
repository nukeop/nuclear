import findLast from 'lodash-es/findLast';
import { useEffect, useMemo, useRef } from 'react';

import { useSettingsModalStore } from '../../stores/settingsModalStore';
import { useSettingsGroups } from './useSettingsGroups';

type SectionElements = Record<string, HTMLDivElement>;

const sectionAtTopOfViewport = (
  sectionNames: string[],
  sections: SectionElements,
  scrollTop: number,
): string => {
  const lastSectionStartingAboveScrollPosition = findLast(
    sectionNames,
    (name) => sections[name].offsetTop <= scrollTop,
  );
  return lastSectionStartingAboveScrollPosition ?? sectionNames[0];
};

// Scrolls to the selected section when clicked, and updates the selected section when scrolling
export const useSettingsScrollSpy = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<SectionElements>({});
  const groups = useSettingsGroups();
  const activeItemId = useSettingsModalStore((state) => state.activeItemId);
  const selectItem = useSettingsModalStore((state) => state.selectItem);

  const sectionNames = useMemo(
    () => groups.map((group) => group.name),
    [groups],
  );

  const registerSection = (name: string) => (element: HTMLDivElement) => {
    sectionsRef.current[name] = element;
  };

  useEffect(() => {
    const viewport = viewportRef.current!;
    const handleScroll = () => {
      selectItem(
        sectionAtTopOfViewport(
          sectionNames,
          sectionsRef.current,
          viewport.scrollTop,
        ),
      );
    };

    viewport.addEventListener('scroll', handleScroll);
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [sectionNames, selectItem]);

  useEffect(() => {
    if (activeItemId === null) {
      return;
    }
    const topSection = sectionAtTopOfViewport(
      sectionNames,
      sectionsRef.current,
      viewportRef.current!.scrollTop,
    );
    if (topSection !== activeItemId) {
      sectionsRef.current[activeItemId].scrollIntoView();
    }
  }, [sectionNames, activeItemId]);

  return { viewportRef, registerSection };
};
