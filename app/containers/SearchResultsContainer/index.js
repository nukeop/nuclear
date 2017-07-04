import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import SearchResults from '../../components/SearchResults';

class SearchResultsContainer extends React.Component {
  render() {
    return (
      <SearchResults
        artistSearchResults={this.props.artistSearchResults}
        albumSearchResults={this.props.albumSearchResults}
        unifiedSearchStarted={this.props.unifiedSearchStarted}
        albumInfoSearch={this.props.actions.albumInfoSearch}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    artistSearchResults: state.search.artistSearchResults,
    albumSearchResults: state.search.albumSearchResults,
    unifiedSearchStarted: state.search.unifiedSearchStarted
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsContainer);
