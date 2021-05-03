import { store, setOption } from '@nuclear/core';

import { Settings } from './actionTypes';

export function readSettings() {
  const settings = store.get('settings');
  return {
    type: Settings.READ_SETTINGS,
    payload: settings
  };
}

export function setBooleanOption(option, state, fromMain?) {
  setOption(option, state);

  return {
    type: Settings.SET_BOOLEAN_OPTION,
    payload: {option, state},
    meta: { fromMain }
  };
}

export function setStringOption(option, state, fromMain) {
  setOption(option, state);

  return {
    type: Settings.SET_STRING_OPTION,
    payload: {option, state},
    meta: { fromMain }
  };
}

export function setNumberOption(option, state, fromMain) {
  setOption(option, state);

  return {
    type: Settings.SET_NUMBER_OPTION,
    payload: {option, state},
    meta: { fromMain }
  };
}

export function toggleOption(option, state) {
  const optionState = state[option.name];
  return optionState !== undefined
    ? setBooleanOption(option.name, !optionState)
    : setBooleanOption(option.name, !option.default);
}
