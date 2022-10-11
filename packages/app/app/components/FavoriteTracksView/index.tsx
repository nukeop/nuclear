import React, { useCallback } from 'react';
import _ from 'lodash';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import { Track } from '@nuclear/core';

import TrackTableContainer from '../../containers/TrackTableContainer';
import Header from '../Header';
import styles from './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as queueActions from '../../actions/queue';
import * as settingsActions from '../../actions/settings';
import * as playerActions from '../../actions/player';
import { settingsSelector } from '../../selectors/settings';
import { useToggleOptionCallback } from '../../containers/PlayerBarContainer/hooks';

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
}

const FavoriteTracksView: React.FC<FavoriteTracksViewProps> = ({
  tracks,
  removeFavoriteTrack
}) => {
  const { t } = useTranslation('favorites');
  const dispatch = useDispatch();
  const settings = useSelector(settingsSelector);

  const toggleOption = useCallback(
    (option, state) => dispatch(settingsActions.toggleOption(option, state)), [dispatch]
  );

  const toggleShuffle = useToggleOptionCallback(toggleOption, 'shuffleQueue', settings);

  const addToQueue = useCallback(async( tracks: Track[]) => {
    dispatch(queueActions.clearQueue());
    await tracks.map(async (track) => {
      await dispatch(queueActions.addToQueue(queueActions.toQueueItem(track)));
    });
    dispatch(queueActions.selectSong(0));
    dispatch(playerActions.startPlayback(false));
  }, [dispatch]);

  const shufflePlay = () => {
    addToQueue(tracks);
    if (settings.shuffleQueue === false){
      toggleShuffle();
    }
  };

  return (
    <div className={styles.favorite_tracks_view}>
      {
        _.isEmpty(tracks) 
          ? <EmptyState />
          :  <>
            <Header>
              {t('header')}
            </Header>
            <Segment>
              <Button className={styles.play_button} data-testid='shuffle_play_button' onClick={shufflePlay}>
                <Icon name='shuffle' /> {t('shuffle')}
              </Button>
            </Segment>
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

