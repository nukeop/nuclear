import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const AlbumPreview = ({album}) => (
  <div className={styles.album_preview} >
    <div
      className={styles.album_cover}
      style={{backgroundImage: `url(${album.image[0]['#text']})`}}
    />
  </div>
);

AlbumPreview.propTypes = {
  album: PropTypes.shape({
    artist: PropTypes.shape({
      name: PropTypes.string
    }),
    title: PropTypes.string.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      artist: PropTypes.shape({
        name: PropTypes.string
      })
    })),
    image: PropTypes.arrayOf(PropTypes.shape({
      '#text': PropTypes.string
    }))
  })
};

export default AlbumPreview;
