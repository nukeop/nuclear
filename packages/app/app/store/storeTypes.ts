import { ThunkAction, Action } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootStateRTK {
}

export type AppDispatchRTK = typeof import('./configureStoreRTK').storeRTK.dispatch;

export type AppThunkRTK<ReturnType = void> = ThunkAction<
  ReturnType,
  RootStateRTK,
  unknown,
  Action<string>
>;
