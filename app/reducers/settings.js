import {
  READ_SETTINGS,
  SET_BOOLEAN_OPTION,
  SET_STRING_OPTION,
  SET_NUMBER_OPTION
} from '../actions/settings';
import settingsOptions from '../constants/settings';

const initialState = {};
const defaultSettings = settingsOptions.reduce((acc, option) => ({
  ...acc,
  [option.name]: option.default
}), {});

export default function SettingsReducer(state=initialState, action) {
  switch (action.type) {
  case READ_SETTINGS:
    return Object.assign(defaultSettings, action.payload);
  case SET_BOOLEAN_OPTION:
  case SET_STRING_OPTION:
  case SET_NUMBER_OPTION:
    return Object.assign({}, state, {
      [`${action.payload.option}`]: action.payload.state
    });
  default:
    return state;
  }
}
