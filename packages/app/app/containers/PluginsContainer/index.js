import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PluginsView from '../../components/PluginsView';
import * as PluginsActions from '../../actions/plugins';

const PluginsContainer = ({ actions, plugin }) => (
  <PluginsView
    actions={actions}
    plugins={plugin.plugins}
    userPlugins={plugin.userPlugins}
    selectedMusicSource={plugin.selected.streamProviders}
    selectedLyricsProvider={plugin.selected.lyricsProviders}
    selectedMetaProvider={plugin.selected.metaProviders}
  />
);

function mapStateToProps(state) {
  return {
    plugin: state.plugin
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, PluginsActions), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PluginsContainer);
