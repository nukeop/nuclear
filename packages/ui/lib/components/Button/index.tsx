import React from 'react';
import cx from 'classnames';
import {
  Button as SUIButton,
  ButtonProps as SUIButtonProps
} from 'semantic-ui-react';

import common from '../../common.scss';
import styles from './styles.scss';

export type ButtonProps = SUIButtonProps & {
  rounded?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  rounded = false,
  className,
  ...rest
}) => <SUIButton
  className={cx(
    common.nuclear,
    styles.button,
    {
      [styles.rounded]: rounded
    },
    className
  )}
  {...rest}
/>;

export default Button;
