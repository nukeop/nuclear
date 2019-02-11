import {
  READ_SETTINGS,
  SET_BOOLEAN_OPTION,
  SET_STRING_OPTION,
  SET_NUMBER_OPTION
} from '../actions/settings';

const initialState = {

};

export default function SettingsReducer(state=initialState, action) {
  switch (action.type) {
  case READ_SETTINGS:
    return Object.assign({}, action.payload);
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
