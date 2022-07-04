import React from 'react';
import { Tab } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';

import BestNewMusicTab from './BestNewMusicTab';
import ChartsTab from './ChartsTab';
import GenresTab from './GenresTab';

import styles from './styles.scss';
import { DashboardReducerState } from '../../reducers/dashboard';
import StreamProviderPlugin from '@nuclear/core/src/plugins/streamProvider';
import { QueueItem } from '../../reducers/queue';
import EditorialsTab from './EditorialsTab';

type DashboardProps = {
  dashboardData: DashboardReducerState;
  streamProviders: StreamProviderPlugin[];
  isConnected: boolean;

  artistInfoSearchByName: (artistName: string) => void;
  albumInfoSearchByName: (albumName: string) => void;
  addToQueue: (item: QueueItem) => void;
  selectSong: (song: number) => void;
  clearQueue: () => void;
  startPlayback: () => void;
  onEditorialPlaylistClick: (playlistId: number) => void;
};

export const Dashboard: React.FC<DashboardProps> = ({
  dashboardData,
  streamProviders,
  isConnected,

  artistInfoSearchByName,
  albumInfoSearchByName,
  addToQueue,
  selectSong,
  clearQueue,
  startPlayback,
  onEditorialPlaylistClick
}) => {
  const { t } = useTranslation('dashboard');
  const history = useHistory();

  const {editorialCharts} = dashboardData;

  return (
    <div className={styles.dashboard}>
      {isConnected && (
        <Tab
          menu={{ secondary: true, pointing: true }}
          panes={[
            {
              menuItem: t('playlists'),
              render: () => (
                <EditorialsTab
                  isLoading={editorialCharts.isLoading || !editorialCharts.isReady}
                  playlists={dashboardData.editorialCharts.data?.playlists.data}
                  artists={dashboardData.editorialCharts.data?.artists.data}

                  artistInfoSearchByName={artistInfoSearchByName}
                  onEditorialPlaylistClick={onEditorialPlaylistClick}
                />
              )
            },
            {
              menuItem: t('best'),
              render: () => (
                <BestNewMusicTab
                  dashboardData={dashboardData}
                  artistInfoSearchByName={artistInfoSearchByName}
                  albumInfoSearchByName={albumInfoSearchByName}
                  history={history}
                  addToQueue={addToQueue}
                  selectSong={selectSong}
                  clearQueue={clearQueue}
                  startPlayback={startPlayback}
                  streamProviders={streamProviders}
                />
              )
            },
            {
              menuItem: t('top'),
              render: () => <ChartsTab topTracks={dashboardData.topTracks} />
            },
            {
              menuItem: t('genres'),
              render: () => (
                <GenresTab genres={dashboardData.topTags} history={history} />
              )
            }
          ]}
          className={styles.dashboard_tabs}
        />
      )}
      {!isConnected && <Redirect to='/library' />}
    </div>
  );
};

export default Dashboard;
