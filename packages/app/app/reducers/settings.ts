import { Settings } from '../actions/actionTypes';
import settingsOptions from '../constants/settings';

export type SettingsState = {
  [key: string]: boolean | string | number;
  isLoading: boolean;
  isReady: boolean;
};

const initialState: SettingsState = {
  isLoading: false,
  isReady: false
};
const defaultSettings: Partial<SettingsState> = settingsOptions.reduce((acc, option) => ({
  ...acc,
  [option.name]: option.default
}), {});

export default function SettingsReducer(state=initialState, action) {
  switch (action.type) {
  case Settings.READ_SETTINGS:
    return { 
      ...defaultSettings,
      ...action.payload,
      isLoading: false,
      isReady: true
    };
  case Settings.SET_BOOLEAN_OPTION:
  case Settings.SET_STRING_OPTION:
  case Settings.SET_NUMBER_OPTION:
    return {
      ...state, 
      ...{
        [`${action.payload.option}`]: action.payload.state
      }
    };
  default:
    return state;
  }
}
