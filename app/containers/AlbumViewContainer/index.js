import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';

import AlbumView from '../../components/AlbumView';

var _ = require('lodash');

class AlbumViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      actions,
      match,
      history,
      albumDetails,
      musicSources
    } = this.props;
    return (
      <AlbumView
        album={albumDetails[match.params.albumId]}
        artistInfoSearch={actions.artistInfoSearch}
        addToQueue={actions.addToQueue}
        musicSources={musicSources}
        history={history}
        selectSong={actions.selectSong}
        startPlayback={actions.startPlayback}
        clearQueue={actions.clearQueue}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    albumDetails: state.search.albumDetails,
    musicSources: state.plugin.plugins.musicSources
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, Actions, QueueActions, PlayerActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlbumViewContainer));
