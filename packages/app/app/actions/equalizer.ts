import { createStandardAction } from 'typesafe-actions';
import { Equalizer } from './actionTypes';


export const changeValue = createStandardAction(
  Equalizer.CHANGE_VALUE
)<{index: number, value: number}>();

export const selectPreset = createStandardAction(
  Equalizer.SELECT_PRESET
)<string>();

export const setPreAmp = createStandardAction(Equalizer.SET_PREAMP)<number>();

export const toggleSpectrum = createStandardAction(Equalizer.TOGGLE_SPECTRUM)();

export const setSpectrum = createStandardAction(Equalizer.SET_SPECTRUM)<number[]>();
