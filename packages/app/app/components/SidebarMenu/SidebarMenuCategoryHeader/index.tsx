import React from 'react';

import styles from './styles.scss';

type SidebarMenuCategoryHeaderProps = {
  headerText: string;
  compact?: boolean;
}

const SidebarMenuCategoryHeader: React.FC<SidebarMenuCategoryHeaderProps> = ({
  compact = false,
  headerText
}) => {
  return (
    !compact && <div className={styles.sidebar_menu_category_header}>
      {headerText}
    </div>
  );
};

export default SidebarMenuCategoryHeader;
