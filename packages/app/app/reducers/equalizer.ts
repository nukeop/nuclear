import _ from 'lodash';
import { store } from '@nuclear/core';
import * as EqualizerActions from '../actions/equalizer';
import { ActionType, getType } from 'typesafe-actions';

type CustomPreset = {
  values: number[]
  preAmp: number
}

type Preset = {
  label: string
  id: string
  values: number[]
  preAmp: number
}

type EqualizerState = {
  presets: {
    [id: string]: Preset
  }
  presetIDs: string[]
  selected: string
  enableSpectrum: boolean
  spectrum: number[]
  custom?: Preset
}

const getPresets = (custom:CustomPreset): Preset[] => [
  {
    label: 'default',
    id: 'default',
    values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    preAmp: 0
  },
  {
    label: 'classical',
    id: 'classical',
    values: [0, 0, 0, 0, 0, 0, 0, -4, -4, -4, -6],
    preAmp: 0
  },
  {
    label: 'club',
    id: 'club',
    values: [0, 0, 0, 2, 4, 4, 4, 2, 0, 0, 0],
    preAmp: 0
  },
  {
    label: 'pop',
    id: 'pop',
    values: [-2, -1, 2, 3, 4, 3, 0, -1, -1, -1, -1],
    preAmp: 0
  },
  {
    label: 'reggae',
    id: 'reggae',
    values: [0, 0, 0, 0, -2, 0, 2, 2, 0, 0, 0],
    preAmp: 0
  },
  {
    label: 'rock',
    id: 'rock',
    values: [5, 4, 3, -2, -3, -2, 2, 5, 6, 6, 6],
    preAmp: 0
  },
  {
    label: 'full-bass',
    id: 'full-bass',
    values: [6, 6, 6, 6, 4, 0, -2, -4, -6, -6, -6],
    preAmp: 0
  },
  {
    label: 'full-treble',
    id: 'full-treble',
    values: [-6, -6, -6, -6, -2, 2, 6, 8, 8, 9, 9],
    preAmp: 0
  },
  {
    label: 'custom',
    id: 'custom',
    ...custom
  }
];

const normalize = (list: Preset[]): {ids: string[], map: {[id: string]: Preset}} => list.reduce(({ids, map}, item) => ({
  ids: [...ids, item.id],
  map: {...map, [item.id]: item}
}), {ids: [], map: {}});

const getSelected = (selected: string, presets: Preset[]) => {
  if (selected.toLowerCase() === selected) {
    return selected;
  }
  const legacySelected = presets.find(preset => preset.label === selected);
  return legacySelected ? legacySelected.id : presets[0].id;
};

const getSpectrumStatus = (otherConfig: Omit<EqualizerState, 'custom' | 'selected'>) => {
  return _.get(otherConfig, 'enableSpectrum', false);
};

const getInitialState = (): EqualizerState => {
  const {custom, selected, ...other} = store.get('equalizer') as EqualizerState;
  const customPreset = custom;
  const presets = getPresets(customPreset);
  const {ids, map} = normalize(presets);
  return {
    presets: map,
    presetIDs: ids,
    selected: getSelected(selected, presets),
    enableSpectrum: getSpectrumStatus(other),
    spectrum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };
};

const persist = (state: EqualizerState) => store.set('equalizer', {
  custom: state.presets.custom,
  selected: state.selected,
  enableSpectrum: state.enableSpectrum
});

type EqualizerReducerActions = ActionType<typeof EqualizerActions>

export default function EqualizerReducer(state = getInitialState(), action:EqualizerReducerActions): EqualizerState {
  let newState: EqualizerState;

  switch (action.type) {
  case getType(EqualizerActions.changeValue): {
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
  case getType(EqualizerActions.setPreAmp): {
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
  case getType(EqualizerActions.selectPreset):
    newState = {
      ...state,
      selected: action.payload
    };
    persist(newState);
    return newState;
  case getType(EqualizerActions.toggleSpectrum):
    newState = {
      ...state,
      enableSpectrum: !state.enableSpectrum
    };
    persist(newState);
    return newState;
  case getType(EqualizerActions.setSpectrum):
    return {
      ...state,
      spectrum: action.payload
    };
  default:
    return state;
  }
}
