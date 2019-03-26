import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const SidebarMenuCategoryHeader = props => {
  return (
    <div className={styles.sidebar_menu_category_header}>
      { props.children }
    </div>
  );
};

SidebarMenuCategoryHeader.propTypes = {
  children: PropTypes.node
};

export default SidebarMenuCategoryHeader;
