import { ThunkAction, Action } from '@reduxjs/toolkit';
import { PlayerState } from '../slices/playerSlice';

export interface RootStateRTK {
  player: PlayerState;
}

export type AppDispatchRTK = typeof import('./configureStoreRTK').storeRTK.dispatch;

export type AppThunkRTK<ReturnType = void> = ThunkAction<
  ReturnType,
  RootStateRTK,
  unknown,
  Action<string>
>;
