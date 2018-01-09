import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import * as QueueActions from '../../actions/queue';

import AlbumView from '../../components/AlbumView';

var _ = require('lodash');

class AlbumViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AlbumView
        album={this.props.albumDetails[this.props.match.params.albumId]}
        artistInfoSearch={this.props.actions.artistInfoSearch}
        addToQueue={this.props.actions.addToQueue}
        musicSources={this.props.musicSources}
        history={this.props.history}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    albumDetails: state.search.albumDetails,
    musicSources: state.plugin.plugins.musicSources
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, Actions, QueueActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlbumViewContainer));
