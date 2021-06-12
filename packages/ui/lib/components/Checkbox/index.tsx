import React from 'react';
import cx from 'classnames';
import {
  Checkbox as SUICheckbox,
  CheckboxProps as SUICheckboxProps
} from 'semantic-ui-react';

import common from '../../common.scss';
import styles from './styles.scss';

export type CheckboxProps = SUICheckboxProps;
const Checkbox: React.FC<CheckboxProps> = ({
  className,
  ...rest
}) => <SUICheckbox
  className={cx(
    common.nuclear,
    styles.checkbox,
    className
  )}
  {...rest}
/>;

export default Checkbox;
