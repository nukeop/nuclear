import React from 'react';
import { Tab } from 'semantic-ui-react';
import { DeezerTopTrack } from '@nuclear/core/src/rest/Deezer';
import { Track } from '@nuclear/ui/lib/types';

import TrackTableContainer from '../../../containers/TrackTableContainer';
import styles from './styles.scss';
import { useTranslation } from 'react-i18next';

type ChartsTabProps = {
  topTracks: DeezerTopTrack[];
}

const mapDeezerTopTrackToTrack = (topTrack: DeezerTopTrack): Track => ({
  artist: topTrack.artist?.name,
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
    <Tab.Pane attached={false}>
      <div
        className={styles.popular_tracks_container}
      >
        <div className='popular_tracks_header'>
          <h3>{t('popular-track-title')}</h3>
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
