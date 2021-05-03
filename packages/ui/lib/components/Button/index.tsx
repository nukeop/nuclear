import React from 'react';
import cx from 'classnames';
import {
  Button as SUIButton,
  ButtonProps as SUIButtonProps
} from 'semantic-ui-react';

import common from '../../common.scss';
import styles from './styles.scss';

type ButtonProps = SUIButtonProps & {
  rounded?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  rounded = false,
  ...rest
}) => <SUIButton
  className={cx(
    common.nuclear,
    styles.button,
    {
      [styles.rounded]: rounded
    }
  )}
  {...rest}
/>;

export default Button;
