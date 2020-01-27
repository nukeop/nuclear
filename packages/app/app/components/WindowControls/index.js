import React from 'react';
import { mpris } from '@nuclear/core';

import styles from './styles.scss';

import WindowButton from './WindowButton';

const WindowControls = () => (
  <div className={styles.window_controls_container}>
    <WindowButton icon='window-minimize' onClick={mpris.sendMinimize} />
    <WindowButton icon='window-maximize' onClick={mpris.sendMaximize} />
    <WindowButton icon='close' onClick={mpris.sendClose} />
  </div>
);

export default WindowControls;
