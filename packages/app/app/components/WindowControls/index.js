import React from 'react';

import styles from './styles.scss';

import WindowButton from './WindowButton';
import { ipcRenderer } from 'electron';

const handleMinimize = () => ipcRenderer.send('minimize');
const handleMaximize = () => ipcRenderer.send('maximize');
const handleClose = () => ipcRenderer.send('close');

const WindowControls = () => (
  <div className={styles.window_controls_container}>
    <WindowButton icon='window-minimize' onClick={handleMinimize} />
    <WindowButton icon='window-maximize' onClick={handleMaximize} />
    <WindowButton icon='close' onClick={handleClose} />
  </div>
);

export default WindowControls;
