import React from 'react';

import styles from './styles.scss';

const Header = ({ children }) => (
  <div className={styles.header_container}>{children}</div>
);

export default Header;
