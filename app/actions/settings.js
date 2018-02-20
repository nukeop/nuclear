import { store } from '../persistence/store';

export const SET_BOOLEAN_OPTION = 'SET_BOOLEAN_OPTION';

export function setBooleanOption(option, state) {
  store.set(`settings.${option}`, state).write();

  return {
    type: SET_BOOLEAN_OPTION,
    payload: {option, state}
  };
}
