import React from 'react';
import { Icon, SemanticICONS } from 'semantic-ui-react';

import styles from './styles.scss';

type WindowButtonControls = {
  color?: string;
  className?: string;
  icon: SemanticICONS;
  onClick: React.MouseEventHandler;
  [x: string]: any;
}

const WindowButton: React.FC<WindowButtonControls> = ({
  color,
  icon,
  onClick,
  ...rest
}) => (
  <div
    style={{ backgroundColor: color }}
    className={styles.window_button_container}
    onClick={onClick}
    {...rest}
  >
    <Icon name={icon} />
  </div>
);

export default WindowButton;
