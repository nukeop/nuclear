export const UPDATE_EQUALIZER = 'UPDATE_EQUALIZER';
export const SET_EQUALIZER = 'SET_EQUALIZER';
export const TOGGLE_VISUALIZATION = 'TOGGLE_VISUALIZATION'; 
export const SET_VISUALIZATION_DATA = 'SET_VISUALIZATION_DATA';

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

export function toggleVisualization() {
  return {
    type: TOGGLE_VISUALIZATION
  };
}

export function setVisualizationData(payload) {
  return {
    type: SET_VISUALIZATION_DATA,
    payload
  };
}
