import type { FC } from 'react';

import { useStreamResolution } from '../hooks/useStreamResolution';

export const StreamResolver: FC = () => {
  useStreamResolution();
  return null;
};
