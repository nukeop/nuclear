import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import common from '../../../common.scss';
import styles from './styles.scss';

const TOAST_HEIGHT_PADDED = '5.5em';

const Toast = props => {
  return (
    <div
      className={cx(
        common.nuclear,
        styles.toast,
        { error: props.error },
        { warning: props.warning },
        { info: props.info },
        { success: props.success }
      )}
      style={{
        bottom: `calc(1em + ${(props.offset[1])} * ${TOAST_HEIGHT_PADDED})`
      }}
      onClick={ props.onClick }
    >
      <div
        className={styles.toast_content}
      >
        {
          props.icon &&
          <div
            className={styles.toast_icon}
          >
            { props.icon }
          </div>
        }
        <div
          className={styles.toast_text}
        >
          <div className={ styles.title }>{ props.title }</div>
          <div className={styles.details }>{ props.details }</div>
        </div>
      </div>
    </div>
  );
};

Toast.propTypes = {
  error: PropTypes.bool,
  warning: PropTypes.bool,
  info: PropTypes.bool,
  success: PropTypes.bool,
  icon: PropTypes.node,
  title: PropTypes.string,
  details: PropTypes.string,
  onClick: PropTypes.func,
  offset: PropTypes.arrayOf(PropTypes.number)
};

Toast.defaultProps = {
  error: false,
  warning: false,
  info: false,
  success: null,
  icon: null,
  title: '',
  details: '',
  onClick: () => {},
  offset: [0, 0]
};

export default Toast;
