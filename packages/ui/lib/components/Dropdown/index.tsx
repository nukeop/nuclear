import React from 'react';
import cx from 'classnames';
import { Dropdown as SemanticDropdown, DropdownProps as SUIDropdownProps } from 'semantic-ui-react';

import common from '../../common.scss';
import styles from './styles.scss';

export type DropdownProps = SUIDropdownProps & {
  noCaret?: boolean;
  noBorder?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  className,
  noCaret = false,
  noBorder = false,
  ...props
}) => <SemanticDropdown
  {...props}
  className={cx(
    common.nuclear,
    styles.dropdown,
    { 
      [styles.no_caret]: noCaret, 
      [styles.no_border]: noBorder
    },
    className
  )}
/>;
Dropdown.displayName = 'Dropdown';

export default Dropdown;
