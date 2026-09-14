import findLast from 'lodash-es/findLast';
import { useEffect, useMemo, useRef } from 'react';

import { useSettingsModalStore } from '../../stores/settingsModalStore';
import { useSettingsGroups } from './useSettingsGroups';

type SectionElements = Record<string, HTMLDivElement>;

const highlightedSection = (
  sectionNames: string[],
  sections: SectionElements,
  viewport: HTMLDivElement,
): string => {
  const isScrolledToBottom =
    viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight;
  if (isScrolledToBottom) {
    return sectionNames[sectionNames.length - 1];
  }

  const viewportMiddle = viewport.scrollTop + viewport.clientHeight / 2;
  const lastSectionStartingAboveMiddle = findLast(
    sectionNames,
    (name) => sections[name].offsetTop <= viewportMiddle,
  );
  return lastSectionStartingAboveMiddle ?? sectionNames[0];
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
        highlightedSection(sectionNames, sectionsRef.current, viewport),
      );
    };

    viewport.addEventListener('scroll', handleScroll);
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [sectionNames, selectItem]);

  useEffect(() => {
    if (activeItemId === null) {
      return;
    }
    const currentSection = highlightedSection(
      sectionNames,
      sectionsRef.current,
      viewportRef.current!,
    );
    if (currentSection !== activeItemId) {
      sectionsRef.current[activeItemId].scrollIntoView();
    }
  }, [sectionNames, activeItemId]);

  return { viewportRef, registerSection };
};
