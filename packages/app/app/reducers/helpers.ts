import produce from 'immer';
import { EmptyPayloadKeyCreator as EmptyActionKeyCreator, KeyCreator, LoadableMeta } from './types';

export const startingStateMeta: LoadableMeta = {
  isLoading: false,
  isReady: false,
  hasError: false
};

export const loadingStateMeta: LoadableMeta = {
  isLoading: true,
  isReady: false,
  hasError: false
};

export const successStateMeta: LoadableMeta = {
  isLoading: false,
  isReady: true,
  hasError: false
};

export const errorStateMeta: LoadableMeta = {
  isLoading: false,
  isReady: true,
  hasError: true
};

export const handleSpreadAction = <S extends {}, P = any>(state: S, { payload }: { payload: P }) => produce(state, draft => {
  for (const key of Object.keys(payload)) {
    draft[key] = payload[key];
  }
});

export const handleLoadableActionStart = <P, S>(keyCreator: KeyCreator<P> | EmptyActionKeyCreator) => (state: S, { payload }: { payload: P } | undefined) =>
  produce(state, draft => {
    draft[keyCreator(payload)] = loadingStateMeta;
  });

export const handleLoadableEmptyActionStart = <S>(keyCreator: EmptyActionKeyCreator) => (state: S) =>
  produce(state, draft => { 
    draft[keyCreator()] = loadingStateMeta;
  });

export const handleLoadableActionSuccess = <P, S>(keyCreator: KeyCreator<P>) => (state: S, { payload }: { payload: P }) =>
  produce(state, draft => {
    draft[keyCreator(payload)] = {
      ...successStateMeta,
      data: payload
    };
  });

export const handleLoadableActionError = <P, S>(keyCreator: KeyCreator<P>, data = []) => (state: S, { payload }: { payload: P }) =>
  produce(state, draft => {
    draft[keyCreator(payload)] = {
      ...errorStateMeta,
      error: payload,
      data
    };
  });
