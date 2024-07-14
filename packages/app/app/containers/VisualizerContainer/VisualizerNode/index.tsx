import React from 'react';
import butterchurnPresets from 'butterchurn-presets';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { VisualizerOverlay } from '@nuclear/ui';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';
import { useVisualizerOverlayProps, useVisualizerProps, useVisualizerShuffleProps, useVisualizerOverlayShuffleProps} from '../hooks';

const VisualizerNode: React.FC = () => {
  const handle = useFullScreenHandle();
  const presets = butterchurnPresets.getPresets();
  const { t } = useTranslation('visualizer');
  const { presetName } = useVisualizerProps();
  const { onPresetChange } = useVisualizerOverlayProps();
  const { shuffleValue } = useVisualizerShuffleProps();
  const { onShuffleChange } = useVisualizerOverlayShuffleProps();
  // The id is a hack to allow the visualizer to render in a portal in the correct place
  return <FullScreen
    className={styles.visualizer_fullscreen}
    handle={handle}
  >
    <div
      id='visualizer_node'
      className={styles.visualizer_node}
    >
      <VisualizerOverlay
        presets={Object.keys(presets)}
        selectedPreset={presetName}
        onPresetChange={onPresetChange}
        shuffleState={shuffleValue}
        onShuffleChange={onShuffleChange}
        onEnterFullscreen={handle.enter}
        exitFullscreenLabel={t('exit-fullscreen')}
        isFullscreen={handle.active}
      />
    </div>
  </FullScreen>;
};

export default VisualizerNode;
