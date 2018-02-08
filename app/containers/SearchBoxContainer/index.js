import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import SearchBox from '../../components/SearchBox';

class SearchBoxContainer extends React.Component {

  handleSearch(history) {
    return event => {
      this.props.actions.unifiedSearch(event.target.value, history);
    };
  }

  render() {
    return(
      <SearchBox
        handleSearch={this.handleSearch.bind(this)(this.props.history)}
        loading={this.props.unifiedSearchStarted}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    unifiedSearchStarted: state.search.unifiedSearchStarted
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBoxContainer));
