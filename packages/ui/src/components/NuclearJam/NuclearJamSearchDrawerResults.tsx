import { FC, ReactNode } from 'react';

import { ScrollableArea } from '../ScrollableArea';

export type NuclearJamSearchDrawerResultsProps = {
  children: ReactNode;
};

export const NuclearJamSearchDrawerResults: FC<
  NuclearJamSearchDrawerResultsProps
> = ({ children }) => (
  <ScrollableArea className="min-h-0 flex-1" data-testid="jam-search-results">
    {children}
  </ScrollableArea>
);
