import React, { Component } from 'react';

import styles from './SearchSidebar.css';

export default class SearchSidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.search_sidebar_container}>
        <div className={styles.search_sidebar}>

        </div>
      </div>
    );
  }
}
