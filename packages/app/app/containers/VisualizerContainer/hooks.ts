import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setBooleanOption, setStringOption } from '../../actions/settings';
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

export const useVisualizerShuffleProps = () => {
  const settings = useSelector(settingsSelector);
  return {
    shuffleValue: settings['visualizer.shuffle'] as boolean
  };
};

export const useVisualizerOverlayShuffleProps = () => {
  const dispatch = useDispatch();
  const onShuffleChange = useCallback(() => {
    dispatch((dispatch, getState) => {
      const currentState = settingsSelector(getState());
      const currentShuffleValue = currentState['visualizer.shuffle'];
      dispatch(setBooleanOption(
        'visualizer.shuffle',
        !currentShuffleValue,
        false
      ));
    });
  }, [dispatch]);
  return {onShuffleChange};
};
