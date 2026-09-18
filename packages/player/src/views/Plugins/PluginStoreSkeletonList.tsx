import range from 'lodash-es/range';
import { FC } from 'react';

import { PluginStoreItem, ScrollableArea } from '@nuclearplayer/ui';

export const PluginStoreSkeletonList: FC = () => (
  <ScrollableArea
    className="flex-1 overflow-hidden"
    data-testid="plugin-store-skeleton"
  >
    <div className="flex flex-col gap-3 px-2 py-2">
      {range(6).map((index) => (
        <PluginStoreItem.Skeleton key={index} />
      ))}
    </div>
  </ScrollableArea>
);
