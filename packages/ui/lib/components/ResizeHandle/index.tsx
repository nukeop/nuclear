import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

type ResizeHandleProps = {
  vertical?: boolean;
};

const ResizeHandle: React.FC<ResizeHandleProps> = ({ vertical }) => <div className={cx(
  styles.resize_handle, {
    [styles.vertical]: vertical
  })
} />;

export default ResizeHandle;
