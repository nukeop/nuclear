import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

class MainContentContainer extends React.Component {

  render() {
    return(
      null
    );
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(state => {return {};}, mapDispatchToProps)(MainContentContainer);
