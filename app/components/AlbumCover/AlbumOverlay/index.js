import React from 'react';
import FontAwesome from 'react-fontawesome';

import Spacer from '../../Spacer';

import styles from './styles.css';

class AlbumOverlay extends React.Component {

  render() {
    return (
      <div className={styles.overlay_container}>
        <Spacer />
        <a
          onClick={this.props.handlePlay}
          href='#'
          className={styles.overlay_play_button}
        >
          <FontAwesome name='play' />
        </a>
        <Spacer />
      </div>
    );
  }
}

export default AlbumOverlay;
