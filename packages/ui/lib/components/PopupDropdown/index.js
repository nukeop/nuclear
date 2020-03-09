import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import popupButtonStyles from '../PopupButton/styles.scss';
import './styles.scss';

const PopupDropdown = ({text, pointing, children, classNames}) => {
  return (
    <Dropdown text={text} className={`${popupButtonStyles.popup_button} left ${classNames}`} pointing={pointing}>
      <Dropdown.Menu>
        {children}
      </Dropdown.Menu>
    </Dropdown>
  );
};

PopupDropdown.propTypes = {
  text: PropTypes.string,
  pointing: PropTypes.string,
  children: PropTypes.node,
  classNames: PropTypes.string
};

export default PopupDropdown;
