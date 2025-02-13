import React from 'react';
import { Tab } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';

import ChartsTab from './ChartsTab';
import GenresTab from './GenresTab';

import styles from './styles.scss';
import { DashboardReducerState } from '../../reducers/dashboard';
import EditorialsTab from './EditorialsTab';

type DashboardProps = {
  dashboardData: DashboardReducerState;
  isConnected: boolean;

  artistInfoSearchByName: (artistName: string) => void;
  albumInfoSearchByName: (albumName: string, artistName: string) => void;
  onEditorialPlaylistClick: (playlistId: number) => void;
};

export const Dashboard: React.FC<DashboardProps> = ({
  dashboardData,
  isConnected,
  artistInfoSearchByName,
  albumInfoSearchByName,
  onEditorialPlaylistClick
}) => {
  const { t } = useTranslation('dashboard');

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
                  playlists={dashboardData.editorialCharts?.data?.playlists?.data}
                  artists={dashboardData.editorialCharts?.data?.artists?.data}
                  albums={dashboardData.editorialCharts?.data?.albums?.data}

                  artistInfoSearchByName={artistInfoSearchByName}
                  albumInfoSearchByName={albumInfoSearchByName}
                  onEditorialPlaylistClick={onEditorialPlaylistClick}
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
                <GenresTab genres={dashboardData.topTags}/>
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
