import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PluginsView from '../../components/PluginsView';

class PluginsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      plugin
    } = this.props;

    return (
      <PluginsView
        plugins={plugin.plugins}
      />
    );
  }
}

function mapStateToProps(state) {
	return {
    plugin: state.plugin
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(Object.assign({}), dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PluginsContainer);
