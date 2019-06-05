import React from 'react';

import styles from './styles.css';

import { sendClose, sendMinimize, sendMaximize } from '../../mpris';
import WindowButton from './WindowButton';

const WindowControls = () => (
  <div className={styles.window_controls_container}>
    <WindowButton icon='window-minimize' onClick={sendMinimize} />
    <WindowButton icon='window-maximize' onClick={sendMaximize} />
    <WindowButton icon='close' onClick={sendClose} />
  </div>
);

export default WindowControls;
