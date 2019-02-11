import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ToastActions from '../../actions/toasts';

import ToastComponent from '../../components/ToastComponent';

class ToastContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      actions,
      toasts
    } = this.props;

    return (
      <ToastComponent
        toasts={toasts.notifications}
      />
    );
  }
}
function mapStateToProps(state) {
  return {
    toasts: state.toasts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign({}, ToastActions),
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToastContainer);
