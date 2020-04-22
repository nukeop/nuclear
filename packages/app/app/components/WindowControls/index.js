import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

import WindowButton from './WindowButton';

const WindowControls = ({ onCloseClick, onMaxClick, onMinClick }) => (
  <div className={styles.window_controls_container}>
    <WindowButton icon='window-minimize' onClick={onMinClick} />
    <WindowButton icon='window-maximize' onClick={onMaxClick} />
    <WindowButton icon='close' onClick={onCloseClick} />
  </div>
);

WindowControls.propTypes = {
  onMaxClick: PropTypes.func,
  onMinClick: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default WindowControls;
