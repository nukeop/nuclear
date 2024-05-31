import { Settings } from './actionTypes';
import butterchurnPresets from 'butterchurn-presets';

export function randomizePreset() {
  const presetNames = Object.keys(butterchurnPresets.getPresets());
  const randomPreset = presetNames[Math.floor(Math.random() * presetNames.length)];
  return dispatch => {
    dispatch({
      type: Settings.SET_STRING_OPTION,
      payload: {
        option: 'visualizer.preset',
        state: randomPreset
      }
    });
  };
}
