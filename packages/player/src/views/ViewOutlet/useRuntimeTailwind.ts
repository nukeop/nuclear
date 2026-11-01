import { useEffect, useState } from 'react';

import { compileTailwind } from './compileTailwind';

const classNamesIn = (root: Element) =>
  [root, ...root.querySelectorAll('[class]')].flatMap((element) => [
    ...element.classList,
  ]);

const classNamesFrom = (mutations: MutationRecord[]) =>
  mutations.flatMap((mutation) => {
    if (mutation.type === 'attributes') {
      return [...(mutation.target as Element).classList];
    }
    return [...mutation.addedNodes]
      .filter((node) => node instanceof Element)
      .flatMap(classNamesIn);
  });

export const useRuntimeTailwind = () => {
  const [css, setCss] = useState<string>();

  useEffect(() => {
    const compile = async (classNames: string[]) => {
      setCss(await compileTailwind(classNames));
    };

    void compile(classNamesIn(document.body));
    const observer = new MutationObserver(
      (mutations) => void compile(classNamesFrom(mutations)),
    );
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return css;
};
