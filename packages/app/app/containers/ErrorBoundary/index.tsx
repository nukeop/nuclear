import { logger } from '@nuclear/core';
import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ToastActions from '../../actions/toasts';

type ErrorBoundaryProps = {
  onError: typeof ToastActions.error;
  settings: { [key: string]: unknown };
  history: {
    goBack: () => void;
  };
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  componentDidCatch(error) {
    logger.error(error.message ? error.message : error);
    this.props.onError(
      'Uncaught error',
      error.message,
      undefined,
      this.props.settings
    );
    this.props.history.goBack();
  }

  render() {
    return this.props.children;
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onError: bindActionCreators(ToastActions.error, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary));
