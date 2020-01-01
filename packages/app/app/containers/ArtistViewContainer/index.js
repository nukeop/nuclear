import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';

import ArtistView from '../../components/ArtistView';

class ArtistViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.artistReleasesSearch(this.props.match.params.artistId);
  }

  render() {
    let { actions, match, history, artistDetails, streamProviders } = this.props;
    return (
      <ArtistView
        artist={artistDetails[match.params.artistId]}
        albumInfoSearch={actions.albumInfoSearch}
        artistInfoSearchByName={actions.artistInfoSearchByName}
        addToQueue={actions.addToQueue}
        streamProviders={streamProviders}
        history={history}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    artistDetails: state.search.artistDetails,
    streamProviders: state.plugin.plugins.streamProviders
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign({}, Actions, QueueActions, PlayerActions),
      dispatch
    )
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ArtistViewContainer)
);
