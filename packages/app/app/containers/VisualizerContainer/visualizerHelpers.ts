import butterchurnPresets from 'butterchurn-presets';
import { setStringOption } from '../../actions/settings';

export const randomizePreset = (dispatch) => {
  const presets = butterchurnPresets.getPresets();
  const randomIndex = Math.floor(Math.random() * Object.keys(presets).length);
  dispatch(setStringOption(
    'visualizer.preset',
    Object.keys(presets)[randomIndex],
    false
  ));
};
