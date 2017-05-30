import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.css';

class Seekbar extends React.Component {

  render() {
    return (
      <div className={styles.seekbar_container}>
        <div style={{width: this.props.fill}} className={styles.seekbar_fill} />
      </div>
    );
  }
}

export default Seekbar;
