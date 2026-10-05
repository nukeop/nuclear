import { useLayoutEffect, useRef, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';

export type TextSize = {
  width: number;
  height: number;
};

const loadFontOf = (element: HTMLElement) =>
  document.fonts.load(
    getComputedStyle(element).font,
    element.textContent ?? '',
  );

const measure = (element: HTMLElement): TextSize => {
  const range = document.createRange();
  range.selectNodeContents(element);
  const elementBox = element.getBoundingClientRect();
  const zoom = elementBox.width / element.offsetWidth;

  return {
    width: Math.ceil(range.getBoundingClientRect().width / zoom) + 1,
    height: elementBox.height / zoom,
  };
};

export const useTextSizes = (texts: string[]) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<TextSize[]>([]);
  const [handle] = useState(() => delayRender('Measuring caption text'));
  const textsKey = texts.join('\n');

  useLayoutEffect(() => {
    const elements = Array.from(containerRef.current?.children ?? []).filter(
      (child) => child instanceof HTMLElement,
    );

    Promise.all(elements.map(loadFontOf))
      .then(() => {
        setSizes(elements.map(measure));
        continueRender(handle);
      })
      .catch(cancelRender);
  }, [textsKey, handle]);

  return { sizes, containerRef };
};
