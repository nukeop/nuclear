import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setStringOption } from '../../actions/settings';
import { settingsSelector } from '../../selectors/settings';

export const useVisualizerProps = () => {
  const settings = useSelector(settingsSelector);
  return {
    presetName: settings['visualizer.preset'] as string
  };
};

export const useVisualizerOverlayProps = () => {
  const dispatch = useDispatch();
  const onPresetChange = useCallback((e, { value }) => dispatch(setStringOption(
    'visualizer.preset',
    value,
    false
  )), [dispatch]);
  return { onPresetChange };
};
