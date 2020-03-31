import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';

import * as Actions from '../../actions';
import SearchBox from '../../components/SearchBox';

const SearchBoxContainer = props => (
  <SearchBox
    handleSearch={props.handleSearch}
    loading={props.unifiedSearchStarted}
    isConnected={props.isConnected}
    isFocused={props.isFocused}
    handleFocus={props.handleFocus}
  />
);

function mapStateToProps(state) {
  return {
    unifiedSearchStarted: state.search.unifiedSearchStarted,
    isConnected: state.connectivity,
    isFocused: state.search.isFocused
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleSearch: props => event => {
      props.actions.unifiedSearch(event.target.value, props.history);
    },
    handleFocus: props => bool => {
      props.actions.setSearchDropdownVisibility(bool);
    }
  })
)(SearchBoxContainer);
