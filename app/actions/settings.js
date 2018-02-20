import { store } from '../persistence/store';

export const SET_BOOLEAN_OPTION = 'SET_BOOLEAN_OPTION';

export function setBooleanOption(option, state) {
  return {
    type: SET_BOOLEAN_OPTION,
    payload: {option, state}
  };
}
