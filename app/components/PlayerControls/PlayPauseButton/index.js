import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

class PlayPauseButton extends React.Component {
  getIcon() {
    if (this.props.playing) {
      return <FontAwesome name="pause" />;
    } else if (this.props.loading) {
      return <FontAwesome name="spinner" pulse />;
    } else {
      return <FontAwesome name="play" />;
    }
  }

  render() {
    return (
      <div className={styles.play_pause_button_container}>
        <a href='#' onClick={this.props.onClick}>{
          this.getIcon()
        }</a>
      </div>
    );
  }
}

export default PlayPauseButton;
