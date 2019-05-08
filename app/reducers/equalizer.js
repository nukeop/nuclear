import {
  UPDATE_EQUALIZER,
  SET_EQUALIZER,
  TOGGLE_VISUALIZATION,
  SET_VISUALIZATION_DATA
} from '../actions/equalizer';
import { store } from '../persistence/store';

const { presets, selected } = store.get('equalizer');

const initialState = {
  presets,
  selected,
  viz: false,
  dataViz: []
};

export default function EqualizerReducer(state = initialState, action) {
  let newState;

  switch (action.type) {
  case UPDATE_EQUALIZER:
    newState = {
      selected: 'Custom',
      presets: {
        ...state.presets,
        Custom: action.payload
      }
    };
    store.set('equalizer', newState);

    return {
      ...state,
      ...newState
    };
  case SET_EQUALIZER:
    newState = {
      presets: state.presets,
      selected: action.payload
    };
    store.set('equalizer', newState);
    
    return {
      ...state,
      ...newState
    };
  case TOGGLE_VISUALIZATION:
    return {
      ...state,
      viz: !state.viz
    };
  case SET_VISUALIZATION_DATA:
    return {
      ...state,
      dataViz: action.payload
    };
  default:
    return state;
  }
}
