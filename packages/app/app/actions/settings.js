import { store, setOption } from '@nuclear/core';

export const READ_SETTINGS = 'READ_SETTINGS';
export const SET_BOOLEAN_OPTION = 'SET_BOOLEAN_OPTION';
export const SET_STRING_OPTION = 'SET_STRING_OPTION';
export const SET_NUMBER_OPTION = 'SET_NUMBER_OPTION';

export function readSettings() {
  const settings = store.get('settings');
  return {
    type: READ_SETTINGS,
    payload: settings
  };
}

export function setBooleanOption(option, state, fromMain) {
  setOption(option, state);

  return {
    type: SET_BOOLEAN_OPTION,
    payload: {option, state},
    meta: { fromMain }
  };
}

export function setStringOption(option, state, fromMain) {
  setOption(option, state);

  return {
    type: SET_STRING_OPTION,
    payload: {option, state},
    meta: { fromMain }
  };
}

export function setNumberOption(option, state, fromMain) {
  setOption(option, state);

  return {
    type: SET_NUMBER_OPTION,
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
