import React from 'react';

import styles from './styles.scss';

const SidebarMenu = ({ children }) => (
  <div className={styles.sidebar_menu_container}>{children}</div>
);

export default SidebarMenu;
