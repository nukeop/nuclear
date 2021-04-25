import React from 'react';
import { Popup } from 'semantic-ui-react';

import styles from './styles.scss';

type SidebarMenuItemProps = {
  name: string;
  compact?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  children,
  name,
  compact = false
}) => !compact
  ? <div className={styles.sidebar_menu_item_container}>{children}</div>
  : (
    <Popup
      className={styles.sidebar_menu_item_popup}
      on='hover'
      content={name}
      trigger={<div className={styles.sidebar_menu_item_container}>{children}</div>}
      position='right center'
    />
  );

export default SidebarMenuItem;
