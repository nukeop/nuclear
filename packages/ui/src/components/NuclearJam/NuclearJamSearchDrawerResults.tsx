import { FC, ReactNode } from 'react';

import { ScrollableArea } from '../ScrollableArea';

export type NuclearJamSearchDrawerResultsProps = {
  children: ReactNode;
};

export const NuclearJamSearchDrawerResults: FC<
  NuclearJamSearchDrawerResultsProps
> = ({ children }) => (
  <div className="relative h-128 min-h-0" data-testid="jam-search-results">
    <ScrollableArea viewportClassName="max-h-full h-full">
      {children}
    </ScrollableArea>
  </div>
);
