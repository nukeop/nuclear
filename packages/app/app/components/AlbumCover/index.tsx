import React from 'react';
import styles from './styles.scss';

import AlbumInfo from './AlbumInfo';
import AlbumOverlay from './AlbumOverlay';

type AlbumCoverProps = {
  nameOnly: boolean;
  cover: string;
  artist: string;
  title: string;
  handlePlay: React.MouseEventHandler;
}

const AlbumCover: React.FC<AlbumCoverProps> = ({ artist, cover, nameOnly, handlePlay, title }) => {
  
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

export default AlbumCover;
