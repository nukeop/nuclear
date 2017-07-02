import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import SearchBox from '../../components/SearchBox';

class SearchBoxContainer extends React.Component {

  handleSearch(event) {
    this.props.actions.unifiedSearch(event.target.value);
  }

  render() {
    return(
      <SearchBox
        handleSearch={this.handleSearch.bind(this)}
        loading={this.props.unifiedSearchStarted}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    searchPlugins: state.search.searchPlugins,
    unifiedSearchStarted: state.search.unifiedSearchStarted
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBoxContainer);
