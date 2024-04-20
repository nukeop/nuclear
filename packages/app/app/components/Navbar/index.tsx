import React from 'react';
import styles from './styles.module.scss';

const Navbar: React.FC = ({ children }) => <div className={styles.navbar}>{children}</div>;

export default Navbar;
