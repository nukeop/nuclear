import React from 'react';
import cx from 'classnames';
import {
  Button as SUIButton,
  ButtonProps as SUIButtonProps
} from 'semantic-ui-react';

import common from '../../common.scss';
import styles from './styles.scss';

export type ButtonProps = SUIButtonProps & {
  borderless?: boolean;
  text?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  borderless = false,
  text = false,
  className,
  ...rest
}) => <SUIButton
  className={cx(
    common.nuclear,
    styles.button,
    {
      [styles.borderless]: borderless,
      [styles.text]: text
    },
    className
  )}
  {...rest}
/>;

export default Button;
