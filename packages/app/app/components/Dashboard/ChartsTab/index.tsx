import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Track } from '@nuclear/ui/lib/types';

import TrackTableContainer from '../../../containers/TrackTableContainer';
import styles from './styles.scss';
import { useTranslation } from 'react-i18next';
import { InternalTopTrack } from '../../../reducers/dashboard';

type ChartsTabProps = {
  topTracks: InternalTopTrack[];
}

const mapDeezerTopTrackToTrack = (topTrack: InternalTopTrack): Track => ({
  artist: topTrack.artist,
  title: topTrack.title,
  album: topTrack.album?.title,
  duration: topTrack.duration,
  position: topTrack.position,
  thumbnail: topTrack.album?.cover_medium,
  uuid: topTrack.id?.toString()
});

const ChartsTab: React.FC<ChartsTabProps> = ({
  topTracks
}) => {
  const { t } = useTranslation('dashboard');
  return (
    <Tab.Pane attached={false} className={styles.popular_tracks_tab}>
      <div
        className={styles.popular_tracks_container}
      >
        <div className='popular_tracks_header'>
          <h2>{t('popular-track-title')}</h2>
        </div>
        <TrackTableContainer 
          tracks={topTracks.map(mapDeezerTopTrackToTrack)}
          displayDeleteButton={false}
          displayAlbum={false}
        /> 
      </div>
    </Tab.Pane>
  );
};

export default ChartsTab;
