import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.css';

class SearchBox extends React.Component {

  render() {
    return (
      <div className={styles.search_box_container}>
        <FontAwesome name="search"/>
        <form>
          <input type="text" placeholder="Search..." />
        </form>
      </div>
    );
  }
}

export default SearchBox;
