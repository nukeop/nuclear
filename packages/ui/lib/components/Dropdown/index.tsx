import React from 'react';
import cx from 'classnames';
import { Dropdown as SemanticDropdown, DropdownProps as SUIDropdownProps } from 'semantic-ui-react';

import common from '../../common.scss';
import styles from './styles.scss';

export type DropdownProps = SUIDropdownProps & {
  noCaret?: boolean;
  noBorder?: boolean;
  noBackground?: boolean;
  variant?: 'lighter' | 'darker';
}

const Dropdown: React.FC<DropdownProps> = ({
  className,
  noCaret = false,
  noBorder = false,
  noBackground = false,
  variant = 'darker',
  ...props
}) => <SemanticDropdown
  {...props}
  className={cx(
    common.nuclear,
    styles.dropdown,
    { 
      [styles.no_caret]: noCaret, 
      [styles.no_border]: noBorder,
      [styles.no_background]: noBackground,
      [styles.lighter]: variant === 'lighter'
    },
    className
  )}
/>;
Dropdown.displayName = 'Dropdown';

export default Dropdown;
