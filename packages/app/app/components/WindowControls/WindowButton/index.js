import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

const WindowButton = ({ color, icon, onClick }) => (
  <div
    style={{ backgroundColor: color }}
    className={styles.window_button_container}
    onClick={onClick}
  >
    <FontAwesome name={icon} />
  </div>
);

export default WindowButton;
