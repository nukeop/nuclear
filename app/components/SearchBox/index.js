import React from 'react';
import FontAwesome from 'react-fontawesome';
import DebounceInput from 'react-debounce-input';

import styles from './styles.css';

class SearchBox extends React.Component {

  render() {
    return (
      <div className={styles.search_box_container}>
        <FontAwesome name="search"/>
        <form>
          <DebounceInput
            placeholder="Search..."
            minLength={2}
            debounceTimeout={500}
            onChange={(e) => {e.preventDefault(); this.props.handleSearch(e);}}
            autoFocus
          />
          {
            this.props.loading
            ? <FontAwesome name="spinner" pulse/>
            : null
          }
        </form>
      </div>
    );
  }
}

export default SearchBox;
