import React from 'react';

import styles from './styles.css';

import WindowButton from './WindowButton';

class WindowControls extends React.Component {

  render() {
    return (
      <div className={styles.window_controls_container}>
      <WindowButton
          icon="window-minimize"
          color="#f1c40f"
        />
        <WindowButton
          icon="window-maximize"
          color="#2ecc71"
        />
        <WindowButton
          icon="close"
          color="#e74c3c"
        />
      </div>
    );
  }
}

export default WindowControls;
