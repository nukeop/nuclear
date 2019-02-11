import React from 'react';
import PropTypes from 'prop-types';
import ui from 'nuclear-ui';

import styles from './styles.scss';

const ToastComponent = props => {
  return (
    <ui.ToastContainer
      toasts={props.toasts}
    />
  );
};

ToastComponent.propTypes = {
  toasts: PropTypes.array
};

ToastComponent.defaultProps = {
  toasts: []
};

export default ToastComponent;
