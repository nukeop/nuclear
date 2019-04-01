import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as GithubActions from '../../actions/github';
import * as ScrobblingActions from '../../actions/scrobbling';
import * as SettingsActions from '../../actions/settings';
import * as LocalActions from '../../actions/local';
import options from '../../constants/settings';
import Settings from '../../components/Settings';

const SettingsContainer = ({
  actions,
  scrobbling,
  settings,
  github,
  local
}) => (
  <Settings
    actions={actions}
    github={github}
    scrobbling={scrobbling}
    settings={settings}
    options={options}
    localFolders={local.folders}
  />
);

function mapStateToProps(state) {
  return {
    github: state.github,
    scrobbling: state.scrobbling,
    local: state.local,
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
        SettingsActions,
        LocalActions
      ),
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
