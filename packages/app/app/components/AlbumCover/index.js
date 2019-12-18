import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

import AlbumInfo from './AlbumInfo';
import AlbumOverlay from './AlbumOverlay';

const AlbumCover = ({ artist, cover, nameOnly, handlePlay, title }) => {
  let style = {};

  if (nameOnly) {
    style = {
      backgroundImage: `url(${cover})`,
      height: '250px'
    };
  }

  return (
    <div style={style} className={styles.album_cover_container}>
      <AlbumOverlay handlePlay={handlePlay} />

      {nameOnly ? null : <img src={cover} />}

      <AlbumInfo
        artist={artist}
        title={title}
        nameOnly={nameOnly}
      />
    </div>
  );
};

AlbumCover.propTypes = {
  nameOnly: PropTypes.bool,
  cover: PropTypes.string,
  artist: PropTypes.string,
  title: PropTypes.string,
  handlePlay: PropTypes.func
};

export default AlbumCover;
