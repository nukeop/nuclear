import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import Header from '../Header';
import TrackRow from '../TrackRow';

import trackRowStyles from '../TrackRow/styles.scss';
import styles from './styles.scss';

export const EmptyState = () => {
  const { t } = useTranslation('favorites');

  return (
    <div className={styles.empty_state} >
      <Icon name='star'/>
      <h2>{t('empty')}</h2>
      <div>{t('empty-help')}</div>
    </div>
  );
};

const FavoriteTracksView = ({
  tracks,
  removeFavoriteTrack
}) => {
  const { t } = useTranslation('favorites');
  
  return (
    <div className={styles.favorite_tracks_view}>
      {
        _.isEmpty(tracks) &&
          <EmptyState />
      }
      {
        !_.isEmpty(tracks) &&
        <React.Fragment>
          <Header>
            {t('header')}
          </Header>
          <Segment className={trackRowStyles.tracks_container}>
            <table>
              <thead>
                <tr>
                  <th />
                  <th><Icon name='image' /></th>
                  <th>{t('artist')}</th>
                  <th>{t('title')}</th>
                </tr>
              </thead>
              <tbody>
                {
                  tracks.map((track, i) => {
                    return (
                      <TrackRow
                        key={'favorite-track-' + i}
                        track={track}
                        index={i}
                        displayCover
                        displayArtist
                        withDeleteButton
                        withAddToFavorites={false}
                        onDelete={e => {
                          e.stopPropagation();
                          removeFavoriteTrack(track);
                        }}
                      />
                    );
                  })
                }
              </tbody>
            </table>
          </Segment>
        </React.Fragment>
      }
    </div>
  );
};

FavoriteTracksView.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    artist: PropTypes.shape({
      name: PropTypes.string
    }),
    name: PropTypes.string
  })),
  removeFavoriteTrack: PropTypes.func
};

FavoriteTracksView.defaultProps = {
  tracks: [],
  removeFavoriteTrack: () => {}
};

export default FavoriteTracksView;
