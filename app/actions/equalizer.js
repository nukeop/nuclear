export const UPDATE_EQUALIZER = 'UPDATE_EQUALIZER';
export const SET_EQUALIZER = 'SET_EQUALIZER';

export function updateEqualizer(payload) {
  return {
    type: UPDATE_EQUALIZER,
    payload
  };
}

export function setEqualizer(payload) {
  return {
    type: SET_EQUALIZER,
    payload
  };
}
