import React from 'react';
import { ToastContainer } from '@nuclear/ui';
import './styles.scss';
import { Notification } from '@nuclear/ui/lib/types';

type ToastComponentProps = {
  toasts: Notification[]
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toasts }) => <ToastContainer toasts={toasts} />;


ToastComponent.defaultProps = {
  toasts: []
};

export default ToastComponent;
