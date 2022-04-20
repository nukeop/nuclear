import React from 'react';
import cx from 'classnames';
import Toast from './Toast';
import { Notification }  from '../../types';
import common from '../../common.scss';
import styles from './styles.scss';

type ToastContainerProps = {
  toasts: Notification[]
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts = []
}) => {
  return (
    <div
      className={cx(
        common.nuclear,
        styles.toast_container
      )}
    >
      { toasts.map((toast, i) => {
        return (
          <Toast
            key={`toast-${i}`}
            icon={toast.icon}
            title={toast.title}
            details={toast.details}
            error={toast.error}
            warning={toast.warning}
            info={toast.info}
            success={toast.success}
            onClick={toast.onClick}
          />
        );
      })}
    </div>
  );
};

export default ToastContainer;
