import {
  SET_BOOLEAN_OPTION
} from '../actions/settings';

const initialState = {

};

export default function SettingsReducer(state=initialState, action) {
  switch(action.type) {
    case SET_BOOLEAN_OPTION:
    return Object.assign({}, state, {
      [`${action.payload.option}`]: action.payload.state
    });
    default:
    return state;
  }
}
