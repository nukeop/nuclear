import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ScrobblingActions from '../../actions/scrobbling';
import * as SettingsActions from '../../actions/settings';
import options from '../../constants/settings';

import Settings from '../../components/Settings';

class SettingsContainer extends React.Component {
  render() {
    return (
      <Settings
        actions={this.props.actions}
        scrobbling={this.props.scrobbling}
        settings={this.props.settings}
        options={options}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    scrobbling: state.scrobbling,
    settings: state.settings
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, ScrobblingActions, SettingsActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
