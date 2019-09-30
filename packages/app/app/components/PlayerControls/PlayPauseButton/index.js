import React from 'react';
import classnames from 'classnames';
import FontAwesome from 'react-fontawesome';
import { withTranslation } from 'react-i18next';

import styles from './styles.scss';

@withTranslation('player')
class PlayPauseButton extends React.Component {
  getIcon() {
    if (this.props.loading) {
      return <FontAwesome name='spinner' pulse />;
    } else if (this.props.playing) {
      return <FontAwesome name='pause' />;
    } else {
      return <FontAwesome name='play' />;
    }
  }

  render() {
    return (
      <div
        className={classnames(
          styles.play_pause_button_container,
          {
            'loading': this.props.loading,
            [styles.player_button_disabled]: !this.props.onClick
          }
        )}
        aria-label={this.props.t('play-pause-button')}
      >
        <a href='#' onClick={this.props.onClick}>{
          this.getIcon()
        }</a>
      </div>
    );
  }
}

export default PlayPauseButton;
