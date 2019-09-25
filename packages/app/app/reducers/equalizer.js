import {
  TOGGLE_SPECTRUM,
  SET_SPECTRUM,
  CHANGE_VALUE,
  SELECT_PRESET,
  SET_PREAMP
} from '../actions/equalizer';
import { store } from '../persistence/store';

const getPresets = (custom) => [
  {
    label: 'Default',
    id: 'default',
    values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    preAmp: 0
  },
  {
    label: 'Classical',
    id: 'classical',
    values: [0, 0, 0, 0, 0, 0, 0, -4, -4, -4, -6],
    preAmp: 0
  },
  {
    label: 'Club',
    id: 'club',
    values: [0, 0, 0, 2, 4, 4, 4, 2, 0, 0, 0],
    preAmp: 0
  },
  {
    label: 'Pop',
    id: 'pop',
    values: [-2, -1, 2, 3, 4, 3, 0, -1, -1, -1, -1],
    preAmp: 0
  },
  {
    label: 'Reggae',
    id: 'reggae',
    values: [0, 0, 0, 0, -2, 0, 2, 2, 0, 0, 0],
    preAmp: 0
  },
  {
    label: 'Rock',
    id: 'rock',
    values: [5, 4, 3, -2, -3, -2, 2, 5, 6, 6, 6],
    preAmp: 0
  },
  {
    label: 'Full bass',
    id: 'full-bass',
    values: [6, 6, 6, 6, 4, 0, -2, -4, -6, -6, -6],
    preAmp: 0
  },
  {
    label: 'Full trebble',
    id: 'full-treble',
    values: [-6, -6, -6, -6, -2, 2, 6, 8, 8, 9, 9],
    preAmp: 0
  },
  {
    label: 'Custom',
    id: 'custom',
    ...custom
  }
];

const normalize = list => list.reduce(({ids, map}, item) => ({
  ids: [...ids, item.id],
  map: {...map, [item.id]: item}
}), {ids: [], map: {}});

const getSelected = (selected, presets) => {
  if (selected.toLowerCase() === selected) {
    return selected;
  } 
  const legacySelected = presets.find(preset => preset.label === selected);  
  return legacySelected ? legacySelected.id : presets[0].id;
};

const getLegacyCustom = ({presets}) => {
  return {
    values: _.get(presets, 'Custom.values', []),
    preAmp: _.get(presets, 'Custom.preAmp', 0)
  };
};
const getInitialState = () => {
  const {custom, selected, ...other} = store.get('equalizer');
  const customPreset = custom ? custom : getLegacyCustom(other);
  const presets = getPresets(customPreset);
  const {ids, map} = normalize(presets);
  return {
    presets: map,
    presetIDs: ids,
    selected: getSelected(selected, presets, map),

    enableSpectrum: false,
    spectrum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };
};

const persist = state => store.set('equalizer', {
  custom: state.presets.custom,
  selected: state.selected  
});

export default function EqualizerReducer(state = getInitialState(), action) {
  let newState;

  switch (action.type) {
  case CHANGE_VALUE: {
    const {index, value} = action.payload;
    const values = [...state.presets[state.selected].values];
    values[index] = value;
    newState = {
      ...state,
      selected: 'custom',
      presets: {
        ...state.presets,
        custom: {
          ...state.presets.custom,
          values
        }
      }
    };
    persist(newState);
    return newState;
  }
  case SET_PREAMP: {
    newState = {
      ...state,
      selected: 'custom',
      presets: {
        ...state.presets,
        custom: {
          ...state.presets.custom,
          preAmp: action.payload,
          values: [...(state.selected === 'custom' ? state.presets.custom.values : state.presets[state.selected].values)].map(value => value + action.payload * 0.00001)
        }
      }
    };
    persist(newState);
    return newState;
  }
  case SELECT_PRESET:
    newState = {
      ...state,
      selected: action.payload
    };
    persist(newState);
    return newState;
  case TOGGLE_SPECTRUM:
    newState = {
      ...state,
      enableSpectrum: !state.enableSpectrum
    };
    persist(newState);
    return newState;
  case SET_SPECTRUM:
    return {
      ...state,
      spectrum: action.payload
    };
  default:
    return state;
  }
}
