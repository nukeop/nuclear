import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

export default ({ className, style }) => (<div
  style={style}
  className={
    cx(
      className,
      styles.spacer
    )
  }
/>);
