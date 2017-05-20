import React, { Component } from 'react';

import SearchSidebar from '../components/SearchSidebar';

export default class SearchSidebarContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <SearchSidebar
          searchResults={this.props.searchResults}
        />
      );
  }
}
