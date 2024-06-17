import React from 'react';
import styles from './styles.scss';

const Navbar: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => <div className={styles.navbar}>{children}</div>;

export default Navbar;
