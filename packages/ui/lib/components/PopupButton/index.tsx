import React from 'react';
import { Icon, IconProps } from 'semantic-ui-react';

import styles from './styles.scss';

export type PopupButtonProps = {
  onClick?: React.MouseEventHandler;
  ariaLabel: string;
  label: string;
  icon: IconProps['name'];
};

const PopupButton: React.FC<PopupButtonProps> = ({
  onClick,
  ariaLabel,
  icon,
  label,
  ...other
}) => (
  <a
    href='#'
    className={styles.popup_button}
    onClick={onClick}
    aria-label={ariaLabel}
    {...other}
  >
    <Icon name={icon} /> {label}
  </a>
);

export default PopupButton;
