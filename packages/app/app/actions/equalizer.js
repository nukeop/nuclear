export const CHANGE_VALUE = 'CHANGE_VALUE';
export const SELECT_PRESET = 'SELECT_PRESET';
export const SET_PREAMP = 'SET_PREAMP';
export const TOGGLE_SPECTRUM = 'TOGGLE_VISUALIZATION'; 
export const SET_SPECTRUM = 'SET_SPECTRUM';

export const changeValue = ({index, value}) => ({
  type: CHANGE_VALUE,
  payload: {index, value}
});

export const selectPreset = (payload) => ({
  type: SELECT_PRESET,
  payload
});

export const setPreAmp = (value) => ({
  type: SET_PREAMP,
  payload: value
});

export const toggleSpectrum = () => ({
  type: TOGGLE_SPECTRUM
});

export const setSpectrum = (payload) => ({
  type: SET_SPECTRUM,
  payload
});
