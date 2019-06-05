import React from 'react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';

import styles from './styles.scss';

const PlayerButton = ({ ariaLabel, icon, onClick }) => (
  <div
    onClick={onClick}
    className={classNames(styles.player_button_container, {
      [styles.player_button_disabled]: !onClick
    })}
    aria-label={ariaLabel}
  >
    <a href='#'>
      <FontAwesome name={icon} />
    </a>
  </div>
);

export default PlayerButton;
