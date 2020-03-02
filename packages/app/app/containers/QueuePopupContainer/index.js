import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as QueueActions from '../../actions/queue';

import QueuePopup from '../../components/PlayQueue/QueuePopup';

const QueuePopupContainer = props => {
  const { actions, plugins } = props;

  return <QueuePopup actions={actions} plugins={plugins} {...props} />;
};

const mapStateToProps = state => ({
  plugins: state.plugin
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({}, QueueActions), dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QueuePopupContainer);
