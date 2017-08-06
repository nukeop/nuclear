import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

class PlayerButton extends React.Component {

  render() {
    return (
      <div onClick={this.props.onClick} className={styles.player_button_container}>
        <a href='#'><FontAwesome name={this.props.icon} /></a>
      </div>
    );
  }
}

export default PlayerButton;
