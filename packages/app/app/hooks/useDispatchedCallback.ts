import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

type ActionCreator = (...args: any[]) => any;

export const useDispatchedCallback = <F extends ActionCreator>(action: F) => {
  const dispatch = useDispatch();
  return useCallback((...args: Parameters<F>) => dispatch(action(...args)), [action]);
};
