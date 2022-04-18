import React from 'react';

import styles from './styles.module.scss';

export const Navbar: React.FC = ({children}) => {
  return <nav className={styles.navbar}>
    {children}
  </nav>;
};
