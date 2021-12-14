import { RootState } from '../reducers';

type StateSelectors<S extends keyof RootState, K extends keyof RootState[S]> = {
  [key in K]: (state: RootState) => RootState[S][key];
};

export const createStateSelectors = <S extends keyof RootState, K extends keyof RootState[S]>(subtreeKey: S, keys: K[]): StateSelectors<S, K> => keys.reduce((acc, key) => {
  acc[key] = (state: RootState) => state[subtreeKey][key];
  return acc;
}, {} as StateSelectors<S, K>);
