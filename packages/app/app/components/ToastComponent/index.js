import React from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from '@nuclear/ui';

import './styles.scss';

const ToastComponent = ({ toasts }) => <ToastContainer toasts={toasts} />;

ToastComponent.propTypes = {
  toasts: PropTypes.array
};

ToastComponent.defaultProps = {
  toasts: []
};

export default ToastComponent;
