import { store, setOption, Setting } from '@nuclear/core';

import { Settings } from './actionTypes';

export function readSettings() {
  const settings = store.get('settings');
  return {
    type: Settings.READ_SETTINGS,
    payload: settings
  };
}

export function setBooleanOption(key: string, value: unknown, fromMain?: boolean) {
  setOption(key, value);

  return {
    type: Settings.SET_BOOLEAN_OPTION,
    payload: {option: key, state: value},
    meta: { fromMain }
  };
}

export function setStringOption(key: string, value: unknown, fromMain?: boolean) {
  setOption(key, value);

  return {
    type: Settings.SET_STRING_OPTION,
    payload: {option: key, state: value},
    meta: { fromMain }
  };
}

export function setNumberOption(key: string, value: unknown, fromMain?: boolean) {
  setOption(key, value);

  return {
    type: Settings.SET_NUMBER_OPTION,
    payload: {option: key, state: value},
    meta: { fromMain }
  };
}

export function toggleOption(key: Setting, state: unknown) {
  const optionState = state[key.name];
  return optionState !== undefined
    ? setBooleanOption(key.name, !optionState)
    : setBooleanOption(key.name, !key.default);
}
