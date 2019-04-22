import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as GithubActions from '../../actions/github';
import * as ScrobblingActions from '../../actions/scrobbling';
import * as SettingsActions from '../../actions/settings';

import options from '../../constants/settings';
import Settings from '../../components/Settings';

class SettingsContainer extends React.Component {
  render() {
    const {
      actions,
      github,
      scrobbling,
      settings
    } = this.props;
    
    return (
      <Settings
        actions={ actions }
        github={ github }
        scrobbling={ scrobbling }
        settings={ settings }
        options={ options }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    github: state.github,
    scrobbling: state.scrobbling,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        GithubActions,
        ScrobblingActions,
        SettingsActions
      ),
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
