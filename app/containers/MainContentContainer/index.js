import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import MainLayout from '../../components/MainLayout';
import SearchResults from '../../components/SearchResults';

class MainContentContainer extends React.Component {

  render() {
    return(
      <Route render={() =>
        <MainLayout
          unifiedSearchResults={this.props.unifiedSearchResults}
        >
          <SearchResults />
        </MainLayout>
      }>

      </Route>
    );
  }
}

function mapStateToProps(state) {
  return {
    unifiedSearchResults: state.search.unifiedSearchResults
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContentContainer);
