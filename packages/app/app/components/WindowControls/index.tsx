import React from 'react';

import styles from './styles.scss';

import WindowButton from './WindowButton';

type WindowControlsProps = {
  onCloseClick: React.MouseEventHandler;
  onMaxClick: React.MouseEventHandler;
  onMinClick: React.MouseEventHandler;
};

const WindowControls: React.FC<WindowControlsProps> = ({
  onCloseClick,
  onMaxClick,
  onMinClick
}) => (
  <div className={styles.window_controls_container}>
    <WindowButton data-testid='minimize-button' icon='window minimize' onClick={onMinClick} />
    <WindowButton data-testid='maximize-button' icon='window maximize outline' onClick={onMaxClick} />
    <WindowButton data-testid='close-button' icon='close' onClick={onCloseClick} />
  </div>
);

export default WindowControls;
