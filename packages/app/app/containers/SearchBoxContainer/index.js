import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import { SearchBox } from '@nuclear/ui';

import * as Actions from '../../actions';

const SearchBoxContainer = ({
  handleSearch,
  unifiedSearchStarted,
  isConnected
}) => (
  <SearchBox
    loading={unifiedSearchStarted}
    disabled={!isConnected}
    onChange={handleSearch}
  />
);

function mapStateToProps(state) {
  return {
    unifiedSearchStarted: state.search.unifiedSearchStarted,
    isConnected: state.connectivity
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
    handleSearch: ({actions, history}) => (event, data) => console.log(data)
  })
)(SearchBoxContainer);
