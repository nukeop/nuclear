import React from 'react';
import { Tooltip } from '@nuclear/ui';

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
    <Tooltip
      on='hover'
      content={name}
      trigger={<div className={styles.sidebar_menu_item_container}>{children}</div>}
      position='right center'
    />
  );

export default SidebarMenuItem;
