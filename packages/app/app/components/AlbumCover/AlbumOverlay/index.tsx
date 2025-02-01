import React from 'react';
import FontAwesome from 'react-fontawesome';

import Spacer from '../../Spacer';

import styles from './styles.scss';

type AlbumOverlayProps = {
  handlePlay: React.MouseEventHandler;
}

const AlbumOverlay : React.FC<AlbumOverlayProps>= ({ handlePlay }) => (
  <div className={styles.overlay_container}>
    <Spacer />
    <a
      onClick={handlePlay}
      href='#'
      className={styles.overlay_play_button}
    >
      <FontAwesome name='play' />
    </a>
    <Spacer />
  </div>
);

export default AlbumOverlay;
