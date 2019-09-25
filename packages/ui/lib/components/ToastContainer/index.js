import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import Toast from './Toast';

import common from '../../common.scss';
import styles from './styles.scss';

const ToastContainer = props => {
  return (
    <div
      className={cx(
        common.nuclear,
        styles.toast_container
      )}
    >
      { props.toasts.map((toast, i) => {
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
            offset={[0, i]}
          />
        );
      })}
    </div>
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      details: PropTypes.string,
      error: PropTypes.bool,
      warning: PropTypes.bool,
      info: PropTypes.bool
    })
  )
};

ToastContainer.defaultProps = {
  toasts: []
};

export default ToastContainer;
