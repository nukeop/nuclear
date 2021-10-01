import React from 'react';
import styles from './styles.scss';

const Navbar = ({ children }: {children: React.ReactNode }) => <div className={styles.navbar}>{children}</div>;

export default Navbar;
