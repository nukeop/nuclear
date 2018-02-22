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

    } = this.props;

    return (
      <PluginsView />
    );
  }
}

function mapStateToProps(state) {
	return {
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(Object.assign({}), dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PluginsContainer);
