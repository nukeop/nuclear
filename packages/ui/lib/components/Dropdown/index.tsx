import React from 'react';
import cx from 'classnames';
import { Dropdown as SemanticDropdown, DropdownProps } from 'semantic-ui-react';

import common from '../../common.scss';
import styles from './styles.scss';

const Dropdown: React.FC<DropdownProps> = ({ className, ...props }) => <SemanticDropdown
  {...props}
  className={cx(
    common.nuclear,
    styles.dropdown,
    className
  )}
/>;
Dropdown.displayName = 'Dropdown';

export default Dropdown;
