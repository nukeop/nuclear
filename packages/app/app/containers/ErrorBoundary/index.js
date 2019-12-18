import logger from 'electron-timber';
import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ToastActions from '../../actions/toasts';

const initialState = { hasError: false };

class ErrorBoundary extends React.Component {
  state = initialState;

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    logger.error(error.message ? error.message : error);
    this.props.actions.error('error', 'Something wrong happened');

    this.setState({ hasError: true }, () => {
      // this.props.history.goBack();
      // this.setState(initialState);
    });
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  actions: PropTypes.shape({
    error: PropTypes.func
  })
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ToastActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary));
