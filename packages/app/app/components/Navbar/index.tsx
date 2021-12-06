import React from 'react';
import styles from './styles.scss';

type NavbarProps = {
    children: React.ReactNode;
}
const Navbar: React.FC<NavbarProps> = ({ children }) => <div className={styles.navbar}>{children}</div>;

export default Navbar;
