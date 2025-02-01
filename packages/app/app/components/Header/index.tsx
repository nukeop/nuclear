import React from 'react';

import styles from './styles.scss';

type HeaderProps={
  children: React.ReactNode;
};

const Header:React.FC<HeaderProps> = ({ children }) => (
  <div className={styles.header_container}>{children}</div>
);

export default Header;
