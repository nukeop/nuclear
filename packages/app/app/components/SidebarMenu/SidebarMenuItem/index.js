import React from 'react';

import styles from './styles.scss';

const SidebarMenuItem = ({ children }) => (
  <div className={styles.sidebar_menu_item_container}>
    {children}
  </div>
);

export default SidebarMenuItem;
