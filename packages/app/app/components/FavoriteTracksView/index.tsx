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
import { settingsSelector } from '../../selectors/settings';
import { useToggleOptionCallback } from '../../containers/PlayerBarContainer/hooks';
import settingsConst from '../../constants/settings';

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


  const addToQueue = useCallback(( tracks: Track[]) => {
    tracks.map(async (track) => {
      dispatch(queueActions.addToQueue(queueActions.toQueueItem(track)));
    });
  }, [dispatch]);


  return (
    <div className={styles.favorite_tracks_view}>
      {
        _.isEmpty(tracks) 
          ? <EmptyState />
          :  <>
            <Header>
              {t('header')}
            </Header>
            <Button onClick={() => {
              addToQueue(tracks);
              toggleShuffle();
            }}>Shuffle Play</Button>
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

