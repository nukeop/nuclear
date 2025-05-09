import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import ReduxPromise from 'redux-promise';

import ipcConnect from './middlewares/ipc';
import { 
  persistenceMiddleware, 
  initializePersistenceCache, 
  getPersistedState 
} from './middlewares/persistence';
import { RootStateRTK, AppDispatchRTK } from './storeTypes';
import { playerSlice } from '../slices/playerSlice';

const preloadedState = getPersistedState();

const rootReducer = {
  player: playerSlice.reducer
};

export const storeRTK = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ReduxPromise, ipcConnect, persistenceMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState
});

initializePersistenceCache(storeRTK.getState() as RootStateRTK);

export const useAppDispatchRTK = () => useDispatch<AppDispatchRTK>();
export const useAppSelectorRTK: TypedUseSelectorHook<RootStateRTK> = useSelector;
