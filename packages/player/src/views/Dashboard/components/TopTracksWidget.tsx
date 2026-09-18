import { FC, useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { TrackTable } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../../components/ConnectedTrackTable';
import { useDashboardTopTracks } from '../hooks/useDashboardData';

export const TopTracksWidget: FC = () => {
  const { t } = useTranslation('dashboard');
  const { data: results, isLoading } = useDashboardTopTracks();

  const tracks = useMemo(
    () => results?.flatMap((result) => result.items) ?? [],
    [results],
  );

  return (
    <div data-testid="dashboard-top-tracks" className="flex flex-col">
      <h2 className="mb-2 text-lg font-semibold">{t('top-tracks')}</h2>
      {isLoading && (
        <TrackTable.Skeleton
          display={{ displayDuration: false }}
          data-testid="dashboard-top-tracks-skeleton"
        />
      )}
      {!isLoading && (
        <ConnectedTrackTable
          tracks={tracks}
          features={{ filterable: true, playAll: true, addAllToQueue: true }}
          display={{ displayDuration: false }}
        />
      )}
    </div>
  );
};
