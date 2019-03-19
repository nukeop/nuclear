import {
  UPDATE_EQUALIZER,
  SET_EQUALIZER
} from '../actions/equalizer';
import { store } from '../persistence/store';

const { presets, selected } = store.get('equalizer');

const initialState = {
  presets,
  selected
};

export default function EqualizerReducer(state = initialState, action) {
  let newState;

  switch (action.type) {
  case UPDATE_EQUALIZER:
    newState = {
      selected: 'custom',
      presets: {
        ...state.presets,
        custom: action.payload
      }
    };
    store.set('equalizer', newState);

    return newState;
  case SET_EQUALIZER:
    newState = {
      presets: state.presets,
      selected: action.payload
    };
    store.set('equalizer', newState);
    
    return newState;
  default:
    return state;
  }
}
