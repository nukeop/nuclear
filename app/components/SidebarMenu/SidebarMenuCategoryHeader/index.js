import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const SidebarMenuCategoryHeader = props => {
  return (
    !props.compact && <div className={styles.sidebar_menu_category_header}>
      { props.children }
    </div>
  );
};

SidebarMenuCategoryHeader.propTypes = {
  children: PropTypes.node,
  compact: PropTypes.bool
};

export default SidebarMenuCategoryHeader;
