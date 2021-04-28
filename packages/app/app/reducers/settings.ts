import { Settings } from '../actions/actionTypes';
import settingsOptions from '../constants/settings';

const initialState = {};
const defaultSettings = settingsOptions.reduce((acc, option) => ({
  ...acc,
  [option.name]: option.default
}), {});

export default function SettingsReducer(state=initialState, action) {
  switch (action.type) {
  case Settings.READ_SETTINGS:
    return Object.assign(defaultSettings, action.payload);
  case Settings.SET_BOOLEAN_OPTION:
  case Settings.SET_STRING_OPTION:
  case Settings.SET_NUMBER_OPTION:
    return Object.assign({}, state, {
      [`${action.payload.option}`]: action.payload.state
    });
  default:
    return state;
  }
}
