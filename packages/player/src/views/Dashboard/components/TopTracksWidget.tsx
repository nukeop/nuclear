import { FC, useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Loader } from '@nuclearplayer/ui';

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
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader data-testid="dashboard-top-tracks-loader" />
        </div>
      ) : (
        <ConnectedTrackTable
          tracks={tracks}
          features={{ filterable: true, playAll: true, addAllToQueue: true }}
          display={{ displayDuration: false }}
        />
      )}
    </div>
  );
};
