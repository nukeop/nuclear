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
      <span>
        {headerText}
      </span>
      <hr />
    </div>
  );
};

export default SidebarMenuCategoryHeader;
