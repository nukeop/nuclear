import React from 'react';
import cx from 'classnames';
import { Dropdown as SemanticDropdown, DropdownProps } from 'semantic-ui-react';

import Dropdown from '../Dropdown';
import popupButtonStyles from '../PopupButton/styles.scss';
import './styles.scss';

export type PopupDropdownProps = {
  text: DropdownProps['text'];
  pointing?: DropdownProps['pointing'];
  direction?: DropdownProps['direction'];
};

const PopupDropdown: React.FC<PopupDropdownProps> = ({
  text,
  pointing,
  direction,
  children,
  ...rest
}) => {
  return (
    <Dropdown
      text={text}
      className={cx(
        popupButtonStyles.popup_button,
        'left'
      )}
      pointing={pointing}
      direction={direction}
      {...rest}
    >
      <SemanticDropdown.Menu>
        {children}
      </SemanticDropdown.Menu>
    </Dropdown>
  );
};

export default PopupDropdown;
