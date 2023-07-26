import React, { useEffect } from 'react';
import { MiniPlayer } from '@nuclear/ui';

import {
  usePlayerControlsProps,
  useSeekbarProps,
  useTrackInfoProps,
  useVolumeControlsProps
} from '../PlayerBarContainer/hooks';
import { useMiniPlayerSettings } from './hooks';
import { ipcRenderer } from 'electron';
import { IpcEvents } from '@nuclear/core';


const MiniPlayerContainer: React.FC = () => {
  const seekbarProps = useSeekbarProps();
  const playerControlsProps = usePlayerControlsProps();
  const trackInfoProps = useTrackInfoProps();
  const volumeControlsProps = useVolumeControlsProps();

  const {
    isMiniPlayerEnabled,
    toggleMiniPlayer
  } = useMiniPlayerSettings();

  useEffect(() => {
    if (isMiniPlayerEnabled) {
      ipcRenderer.send(IpcEvents.WINDOW_MINIFY);
    } else {
      ipcRenderer.send(IpcEvents.WINDOW_RESTORE);
    }
  }, [isMiniPlayerEnabled]);

  return isMiniPlayerEnabled
    ? (
      <MiniPlayer
        {...seekbarProps}
        {...playerControlsProps}
        {...trackInfoProps}
        {...volumeControlsProps}
        onDisableMiniPlayer={toggleMiniPlayer}
        style={{
          zIndex: isMiniPlayerEnabled && 1000
        }}
      />
    )
    : null;
};

export default MiniPlayerContainer;
