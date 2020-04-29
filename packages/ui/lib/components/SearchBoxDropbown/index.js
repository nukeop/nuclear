import React from 'react';
import styles from './styles.scss';

const SearchBoxDropdown = props => {
  return props.display ? (
    <div className={styles.search_box_dropdown}>
      {props.children}
    </div>) : null;
};

export default SearchBoxDropdown;
