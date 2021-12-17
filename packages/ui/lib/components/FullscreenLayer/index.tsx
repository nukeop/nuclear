import React from 'react';
import { Transition } from 'semantic-ui-react';
import useKeyPress from '../../hooks/useKeyPress';

import styles from './styles.scss';

export type FullscreenLayerProps = {
    isOpen?: boolean;
    onClose?: (e?: KeyboardEvent) => void;
}

const FullscreenLayer: React.FC<FullscreenLayerProps> = ({
  isOpen=false,
  onClose,
  children
}) => {
  useKeyPress('Escape', onClose);

  return <Transition
    visible={isOpen}
    animation={'fade'}
    duration={200}
  >
    <div
      className={styles.fullscreen_layer}
    >
      {children}
    </div>
  </Transition>;
};

export default FullscreenLayer;
