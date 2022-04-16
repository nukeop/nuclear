import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ToastActions from '../../actions/toasts';

import ToastComponent from '../../components/ToastComponent';
import { RootState } from '../../reducers';

const ToastContainer = ({ toasts }) => <ToastComponent toasts={toasts.notifications} />;

function mapStateToProps(state: RootState) {
  return {
    toasts: state.toasts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, ToastActions), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToastContainer);
