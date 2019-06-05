import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

const MainLayout = ({ className, children }) => (
  <div className={cx(styles.main_layout_container, className)}>
    {children}
  </div>
);

export default MainLayout;
