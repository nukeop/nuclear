import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Segment } from 'semantic-ui-react';

import Header from '../Header';
import TrackRow from '../TrackRow';

import styles from './styles.scss';

const FavoriteTracksView = props => {
  const {
    tracks
  } = props;
  
  return (
    <div className={styles.favorite_tracks_view}>
      <Header>
        Your favorite tracks
      </Header>
      <Segment>
        <table>
          <thead>
            <tr>
              <th><FontAwesome name='image' /></th>
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
                    withAddToFavorites={false}
                  />
                );
              })
            }
          </tbody>
        </table>
      </Segment>
    </div>
  );
};

FavoriteTracksView.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    artist: PropTypes.shape({
      name: PropTypes.string
    }),
    name: PropTypes.string
  }))
};

FavoriteTracksView.defaultProps = {
  tracks: []
};

export default FavoriteTracksView;
