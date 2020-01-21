import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import { SearchBox } from '@nuclear/ui';

import * as Actions from '../../actions';

const MIN_SEARCH_LENGTH = 3;
const SearchBoxContainer = ({
  handleSearch,
  unifiedSearchStarted,
  isConnected
}) => (
  <SearchBox
    loading={unifiedSearchStarted}
    disabled={!isConnected}
    onChange={_.debounce(handleSearch, 500)}
  />
);

const mapStateToProps = state => ({
  unifiedSearchStarted: state.search.unifiedSearchStarted,
  isConnected: state.connectivity,
  searchProviders: state.plugin.plugins,
  selectedSearchProvider: state.plugin.selected
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleSearch: 
    ({ actions, history }) => value => 
      value.length >= MIN_SEARCH_LENGTH ? actions.unifiedSearch(value, history) : null
  })
)(SearchBoxContainer);
