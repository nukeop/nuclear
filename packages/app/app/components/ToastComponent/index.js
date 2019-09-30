import React from 'react';
import PropTypes from 'prop-types';
import ui from '@nuclear/ui';

import './styles.scss';

const ToastComponent = ({ toasts }) => <ui.ToastContainer toasts={toasts} />;

ToastComponent.propTypes = {
  toasts: PropTypes.array
};

ToastComponent.defaultProps = {
  toasts: []
};

export default ToastComponent;
