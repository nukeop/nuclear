import React, { SyntheticEvent } from 'react';

import { Button, Dropdown } from '../..';

import styles from './styles.scss';

export type VisualizerOverlayProps = {
  presets: string[];
  selectedPreset: string;
  onPresetChange: (e: SyntheticEvent, { value: string }) => void;
  onEnterFullscreen: React.MouseEventHandler;
  exitFullscreenLabel?: string;
  isFullscreen?: boolean;
};

const VisualizerOverlay: React.FC<VisualizerOverlayProps> = ({
  presets,
  selectedPreset,
  onPresetChange,
  onEnterFullscreen,
  exitFullscreenLabel,
  isFullscreen = false
}) => {
  const presetOptions = presets.map(preset => ({
    text: preset,
    value: preset
  }));

  return <div className={styles.visualizer_overlay}>
    <Dropdown
      search
      selection
      options={presetOptions}
      defaultValue={selectedPreset}
      onChange={onPresetChange}
    />
    {
      isFullscreen
        ? <p>{exitFullscreenLabel}</p>
        : <Button
          basic
          icon='expand'
          onClick={onEnterFullscreen}
        />
    }
  </div>;
};
VisualizerOverlay.displayName = 'VisualizerOverlay';

export default VisualizerOverlay;
