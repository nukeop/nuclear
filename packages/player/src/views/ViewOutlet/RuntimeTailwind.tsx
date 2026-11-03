import { FC } from 'react';

import { useRuntimeTailwind } from './useRuntimeTailwind';

export const RuntimeTailwind: FC = () => {
  const css = useRuntimeTailwind();

  return <style data-testid="custom-view-tailwind-styles">{css}</style>;
};
