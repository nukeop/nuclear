import React from 'react';
import cx from 'classnames';
import Toast from './Toast';

import common from '../../common.module.scss';
import styles from './styles.scss';
import _ from 'lodash';

type Toast = {
  title?: string;
  details?: string;
  error?: boolean;
  warning?: boolean;
  info?: boolean;  
}

type ToastContainerProps = {
  toasts: Toast[]
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
            icon={_.get(toast, 'icon')}
            title={_.get(toast, 'title')}
            details={_.get(toast, 'details')}
            error={_.get(toast, 'error')}
            warning={_.get(toast, 'warning')}
            info={_.get(toast, 'info')}
            success={_.get(toast, 'success')}
            onClick={_.get(toast, 'onClick')}
          />
        );
      })}
    </div>
  );
};

export default ToastContainer;
