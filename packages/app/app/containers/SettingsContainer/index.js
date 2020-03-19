import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as GithubActions from '../../actions/github';
import * as ScrobblingActions from '../../actions/scrobbling';
import * as ImportFavActions from '../../actions/importfavs';
import * as SettingsActions from '../../actions/settings';
import options from '../../constants/settings';
import Settings from '../../components/Settings';

const SettingsContainer = ({
  actions,
  scrobbling,
  importfavs,
  settings,
  github
}) => (
  <Settings
    actions={actions}
    github={github}
    scrobbling={scrobbling}
    importfavs={importfavs}
    settings={settings}
    options={options}
  />
);

function mapStateToProps(state) {
  return {
    github: state.github,
    scrobbling: state.scrobbling,
    importfavs: state.importfavs,
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
        ImportFavActions,
        SettingsActions
      ),
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
