import React from 'react';
import _ from 'lodash';
import { Icon, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import { Track } from '@nuclear/core';

import TrackTableContainer from '../../containers/TrackTableContainer';
import Header from '../Header';
import styles from './styles.scss';

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

