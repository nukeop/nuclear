import { IpcEvents } from '@nuclear/core';
import React from 'react';

import styles from './styles.scss';

import WindowButton from './WindowButton';
import { ipcRenderer } from 'electron';

// TODO move this elsewhere (redux middleware ?)
const handleMinimize = () => ipcRenderer.send(IpcEvents.WINDOW_MINIMIZE);
const handleMaximize = () => ipcRenderer.send(IpcEvents.WINDOW_MAXIMIZE);
const handleClose = () => ipcRenderer.send(IpcEvents.WINDOW_CLOSE);

const WindowControls = () => (
  <div className={styles.window_controls_container}>
    <WindowButton icon='window-minimize' onClick={handleMinimize} />
    <WindowButton icon='window-maximize' onClick={handleMaximize} />
    <WindowButton icon='close' onClick={handleClose} />
  </div>
);

export default WindowControls;
