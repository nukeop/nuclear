import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.css';

class PlayerButton extends React.Component {

  render() {
    return (
      <div className={styles.player_button_container}>
        <FontAwesome name={this.props.icon} />
      </div>
    );
  }
}

export default PlayerButton;
