import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const SidebarMenuCategoryHeader = ({ compact, children }) => {
  return (
    !compact && <div className={styles.sidebar_menu_category_header}>
      { children }
    </div>
  );
};

SidebarMenuCategoryHeader.propTypes = {
  children: PropTypes.node,
  compact: PropTypes.bool
};

export default SidebarMenuCategoryHeader;
