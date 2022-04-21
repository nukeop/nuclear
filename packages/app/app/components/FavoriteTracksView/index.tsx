import React from 'react';
import _ from 'lodash';
import { Icon, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { getTrackItem } from '@nuclear/ui';
import Header from '../Header';

import styles from './styles.scss';
import { Track } from '@nuclear/core';
import { addToQueue } from '../../actions/queue';
import TrackTableContainer from '../../containers/TrackTableContainer';

export const EmptyState = () => {
  const { t } = useTranslation('favorites');

  return (
    <div className={styles.empty_state} >
      <Icon.Group>
        <Icon name='star' />
        <Icon corner name='music' />
      </Icon.Group>
      <h2>{t('empty')}</h2>
      <div>{t('empty-help')}</div>
    </div>
  );
};

type FavoriteTracksViewProps = {
  tracks: Track[];
  removeFavoriteTrack: (track:Track) => void;
  clearQueue: () => void;
  selectSong: (x:number) =>void;
  startPlayback: () => void;
  addToQueue: typeof addToQueue;
}

const FavoriteTracksView: React.FC<FavoriteTracksViewProps> = ({
  tracks,
  removeFavoriteTrack,
  clearQueue,
  selectSong,
  startPlayback,
  addToQueue
}) => {
  const { t } = useTranslation('favorites');

  const addTracksToQueue = () => {
    tracks.map(track => {
      addToQueue(getTrackItem(track));
    });
  };

  const playAll = () => {
    clearQueue();
    addTracksToQueue();
    selectSong(0);
    startPlayback();
  };

  const renderPlayAllButton = () => {
    return (
      <a href='#' className={styles.play_button} onClick={playAll}>
        <Icon name='play'/> Play
      </a>
    );
  };

  return (
    <div className={styles.favorite_tracks_view}>
      {
        _.isEmpty(tracks) &&
          <EmptyState />
      }
      {
        !_.isEmpty(tracks) &&
        <>
          <Header>
            {t('header')}
          </Header>
          <div className={styles.button_container}>
            {renderPlayAllButton()}
          </div>
          <Segment>
            <TrackTableContainer 
              tracks={tracks}
              onDelete={removeFavoriteTrack}
              displayAlbum={false}
              displayFavorite={false}
            />
          </Segment>
        </>
      }
    </div>
  );
};


export default FavoriteTracksView;

