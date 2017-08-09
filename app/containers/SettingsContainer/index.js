import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ScrobblingActions from '../../actions/scrobbling';

import Settings from '../../components/Settings';

class SettingsContainer extends React.Component {
  render() {
    return (
      <Settings
        lastFmConnect={this.props.actions.lastFmConnectAction}
        lastFmLogin={this.props.actions.lastFmLoginAction}
        lastFmAuthToken={this.props.scrobbling.lastFmAuthToken}
        lastFmName={this.props.scrobbling.lastFmName}
        lastFmSessionKey={this.props.scrobbling.lastFmSessionKey}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    scrobbling: state.scrobbling
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ScrobblingActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
