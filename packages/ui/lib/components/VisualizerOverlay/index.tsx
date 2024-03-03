import React, { useState, useEffect, SyntheticEvent } from 'react';

import { Button, Dropdown } from '../..';

import styles from './styles.scss';

import classNames from 'classnames';

export type VisualizerOverlayProps = {
  presets: string[];
  selectedPreset: string;
  onPresetChange: (e: SyntheticEvent, { value }: { value: string }) => void;
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
  // State for managing overlay opacity
  const [isHovered, setIsHovered] = useState(false);

  // Establish timer for overlay opacity
  useEffect(() => {
    let timeoutId: number | undefined;
    if (isHovered) {
      // Set the timeout to remove the hover effect after 3 seconds
      timeoutId = window.setTimeout(() => {
        setIsHovered(false);
      }, 3000);
    }
    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [isHovered]);

  // Handler definitions for relevant mouse events
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseMove = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const presetOptions = presets.map((preset) => ({
    text: preset,
    value: preset
  }));

  const stylesMod = classNames.bind(styles);

  const ovClasses = stylesMod({
    visualizer_overlay: true,
    hover: isHovered
  });

  return (
    <div
      className={ovClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <Dropdown
        search
        selection
        options={presetOptions}
        defaultValue={selectedPreset}
        onChange={onPresetChange}
      />
      {isFullscreen ? (
        <p>{exitFullscreenLabel}</p>
      ) : (
        <Button basic icon='expand' onClick={onEnterFullscreen} />
      )}
    </div>
  );
};

VisualizerOverlay.displayName = 'VisualizerOverlay';

export default VisualizerOverlay;
