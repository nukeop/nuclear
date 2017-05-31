import React from 'react';

import styles from './styles.css';

import WindowButton from './WindowButton';

class WindowControls extends React.Component {

  render() {
    return (
      <div className={styles.window_controls_container}>
      <WindowButton
          icon="window-minimize"
        />
        <WindowButton
          icon="window-maximize"
        />
        <WindowButton
          icon="close"
        />
      </div>
    );
  }
}

export default WindowControls;
