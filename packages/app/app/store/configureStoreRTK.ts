import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {};

export const storeRTK = configureStore({
  reducer: rootReducer
});

export type RootStateRTK = ReturnType<typeof storeRTK.getState>;
export type AppDispatchRTK = typeof storeRTK.dispatch;
