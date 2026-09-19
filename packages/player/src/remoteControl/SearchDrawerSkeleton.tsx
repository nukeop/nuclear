import range from 'lodash-es/range';
import { FC } from 'react';

import { NuclearJam } from '@nuclearplayer/ui';

export const SearchDrawerSkeleton: FC = () => (
  <NuclearJam.SearchDrawer.Results>
    {range(6).map((index) => (
      <NuclearJam.SearchResultTrack.Skeleton key={index} />
    ))}
  </NuclearJam.SearchDrawer.Results>
);
