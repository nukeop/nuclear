import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Segment } from 'semantic-ui-react';
import _ from 'lodash';

import Header from '../Header';
import TrackRow from '../TrackRow';

import trackRowStyles from '../TrackRow/styles.scss';
import styles from './styles.scss';

const EmptyState = () => {
  return (
    <div className={styles.empty_state} >
      <Icon name='star'/>
      <h2>No favorites added.</h2>
      <div>Try favoriting some tracks and they will appear here!</div>
    </div>
  );
};

const FavoriteTracksView = props => {
  const {
    tracks,
    removeFavoriteTrack
  } = props;
  
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
        Your favorite tracks
          </Header>
          <Segment className={trackRowStyles.tracks_container}>
            <table>
              <thead>
                <tr>
                  <th />
                  <th><Icon name='image' /></th>
                  <th>Artist</th>
                  <th>Title</th>
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
                        withAddToFavorites={ false }
                        onDelete={ e => {
                          e.stopPropagation();
                          removeFavoriteTrack(track);
                        } }
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
