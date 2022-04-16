import React from 'react';
import { useSelector } from 'react-redux';
import ToastComponent from '../../components/ToastComponent';
import { RootState } from '../../reducers';

const ToastContainer: React.FC = () => {
  const notifications = useSelector((state: RootState) => state.toasts.notifications); 
  return  <ToastComponent toasts={notifications} />;
};

export default ToastContainer;
