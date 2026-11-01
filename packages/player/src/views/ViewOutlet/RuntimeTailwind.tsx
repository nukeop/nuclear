import { FC, PropsWithChildren, useRef } from 'react';

import { useRuntimeTailwind } from './useRuntimeTailwind';

export const RuntimeTailwind: FC<PropsWithChildren> = ({ children }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const css = useRuntimeTailwind(rootRef);

  return (
    <>
      <style data-testid="custom-view-tailwind-styles">{css}</style>
      <div ref={rootRef} className="contents">
        {children}
      </div>
    </>
  );
};
