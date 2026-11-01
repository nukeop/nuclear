import { RefObject, useEffect, useState } from 'react';

import { compileTailwind } from './compileTailwind';

const collectClassNames = (root: Element) =>
  Array.from(root.querySelectorAll('[class]'), (element) => [
    ...element.classList,
  ]).flat();

export const useRuntimeTailwind = (rootRef: RefObject<HTMLElement>) => {
  const [css, setCss] = useState<string>();

  useEffect(() => {
    const root = rootRef.current!;
    const rebuild = async () => {
      setCss(await compileTailwind(collectClassNames(root)));
    };

    void rebuild();
    const observer = new MutationObserver(() => void rebuild());
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [rootRef]);

  return css;
};
