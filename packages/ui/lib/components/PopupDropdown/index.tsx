import React from 'react';
import cx from 'classnames';
import { Dropdown as SemanticDropdown, DropdownProps } from 'semantic-ui-react';

import Dropdown from '../Dropdown';
import popupButtonStyles from '../PopupButton/styles.scss';
import './styles.scss';

export type PopupDropdownProps = {
  text: DropdownProps['text'];
pointing?: DropdownProps['pointing'];
};

const PopupDropdown: React.FC<PopupDropdownProps> = ({
  text,
  pointing,
  children
}) => {
  return (
    <Dropdown
      text={text}
      className={cx(
        popupButtonStyles.popup_button,
        'left'
      )}
      pointing={pointing}
    >
      <SemanticDropdown.Menu>
        {children}
      </SemanticDropdown.Menu>
    </Dropdown>
  );
};

export default PopupDropdown;
