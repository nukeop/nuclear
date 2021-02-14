import { VisualizerOverlay } from '../lib';
import { makeSnapshotTest } from './helpers';

makeSnapshotTest(VisualizerOverlay, {
  presets: ['preset 1', 'preset 2', 'preset 3'],
  selectedPreset: 'preset 2',
  onPresetChange: () => { },
  isFullscreen: false
}, '(Snapshot) Visualizer overlay');

makeSnapshotTest(VisualizerOverlay, {
  presets: ['preset 1', 'preset 2', 'preset 3'],
  selectedPreset: 'preset 2',
  onPresetChange: () => { },
  isFullscreen: true,
  exitFullscreenLabel: 'Press ESC to exit full screen'
}, '(Snapshot) Visualizer overlay - full screen');
