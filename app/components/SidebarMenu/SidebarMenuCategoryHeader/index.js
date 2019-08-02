import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const SidebarMenuCategoryHeader = ({ compact, headerText }) => {
  return (
    !compact && <div className={styles.sidebar_menu_category_header}>
      { headerText }
    </div>
  );
};

SidebarMenuCategoryHeader.propTypes = {
  headerText: PropTypes.string,
  compact: PropTypes.bool
};

export default SidebarMenuCategoryHeader;
