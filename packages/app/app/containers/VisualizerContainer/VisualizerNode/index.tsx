import React, { useState } from 'react';
import butterchurnPresets from 'butterchurn-presets';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { VisualizerOverlay } from '@nuclear/ui';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';

const VisualizerNode: React.FC = () => {
  const [presetName, setPresetName] = useState('$$$ Royal - Mashup (431)');
  const handle = useFullScreenHandle();
  const presets = butterchurnPresets.getPresets();
  const { t } = useTranslation('visualizer');

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
        onPresetChange={(e, { value }) => setPresetName(value)}
        onEnterFullscreen={handle.enter}
        exitFullscreenLabel={t('exit-fullscreen')}
        isFullscreen={handle.active}
      />
    </div>
  </FullScreen>;
};

export default VisualizerNode;
