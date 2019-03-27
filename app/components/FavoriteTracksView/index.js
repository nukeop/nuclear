import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const FavoriteTracksView = props => {
  return (
    <div className={styles.favorite_tracks_view}>
      {
        props.tracks.map(track => {
          return (
            <div className={styles.favorite_track}>
              { track.artist.name } - { track.name }
            </div>
          );
        })
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
  }))
};

FavoriteTracksView.defaultProps = {
  tracks: []
};

export default FavoriteTracksView;
