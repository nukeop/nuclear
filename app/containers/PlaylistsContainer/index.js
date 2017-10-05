import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PlaylistsActions from '../../actions/playlists';

import Playlists from '../../components/Playlists';

class PlaylistsContainer extends React.Component {
  componentDidMount() {
    this.props.actions.loadPlaylists();
  }

  render() {
    return (
      <Playlists 
      	playlists={this.props.playlists}
        history={this.props.history}
      />
    );
  }
}

function mapStateToProps(state) {
	return {
		playlists: state.playlists.playlists
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(Object.assign({}, PlaylistsActions), dispatch)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlaylistsContainer));
