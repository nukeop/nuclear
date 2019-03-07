import React from 'react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';

import styles from './styles.scss';

class PlayerButton extends React.Component {

  render() {
    return (
      <div
        onClick={this.props.onClick}
        className={classNames(styles.player_button_container, {
          [styles.player_button_disabled]: !this.props.onClick
        })}
        aria-label={this.props.ariaLabel}
      >
        <a href='#'><FontAwesome name={this.props.icon} /></a>
      </div>
    );
  }
}

export default PlayerButton;
