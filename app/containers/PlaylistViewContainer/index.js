import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PlaylistView from '../../components/PlaylistView';

class PlaylistViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PlaylistView
        playlist={this.props.playlists.playlists[this.props.match.params.playlistId]}
  	/>
    );
  }
}

function mapStateToProps(state) {
  return {
    playlists: state.playlists
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlaylistViewContainer));
