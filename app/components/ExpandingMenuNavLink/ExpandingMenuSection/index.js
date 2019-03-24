import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const ExpandingMenuSection = props => {
  return (
    <div className={styles.expanding_menu_section}>
      { props.children }
    </div>
  );
}

ExpandingMenuSection.propTypes = {
  children: PropTypes.node
};

export default ExpandingMenuSection;
