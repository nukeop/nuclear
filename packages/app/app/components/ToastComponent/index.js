import React from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from '@nuclear/ui';

import styles from './styles.scss';

const ToastComponent = ({ toasts }) => <ToastContainer
  className={styles.toast_container_app}
  toasts={toasts}
/>;

ToastComponent.propTypes = {
  toasts: PropTypes.array
};

ToastComponent.defaultProps = {
  toasts: []
};

export default ToastComponent;
