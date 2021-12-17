import { useEffect } from 'react';

export type NamedKey = 'Escape';
export type KeyboardEventHandler = (e: KeyboardEvent) => void;

const useKeyPress = (key: NamedKey, onKeyPress: KeyboardEventHandler) => {
  useEffect(() => {
    const keyPressListener = (e: KeyboardEvent) => {
      if (e.key === key) {
        onKeyPress(e);
      }
    };
    window.addEventListener('keyup', keyPressListener);

    return () => window.removeEventListener('keyup', keyPressListener);
  }, [key, onKeyPress]);
};

export default useKeyPress;
