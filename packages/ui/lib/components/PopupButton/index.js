import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { withHandlers } from 'recompose';

import styles from './styles.scss';

const PopupButton = ({
  onClick,
  ariaLabel,
  icon,
  label,
  ...other
}) => (
  <a
    href='#'
    className={styles.popup_button}
    onClick={onClick}
    aria-label={ariaLabel}
    {...other}
  >
    <Icon name={icon} /> {label}
  </a>
);

PopupButton.propTypes = {
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string
};

PopupButton.defaultProps = {
  onClick: () => {},
  ariaLabel: '',
  icon: '',
  label: ''
};

export default withHandlers({
  onClick: ({ onClick }) => e => {
    onClick();
    e.preventDefault();
  }
})(PopupButton);
