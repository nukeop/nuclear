import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import * as QueueActions from '../../actions/queue';

import ArtistView from '../../components/ArtistView';

class ArtistViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.artistReleasesSearch(this.props.match.params.artistId);
  }

  render() {
    return (
      <ArtistView
        artist={this.props.artistDetails[this.props.match.params.artistId]}
        albumInfoSearch={this.props.actions.albumInfoSearch}
        artistInfoSearchByName={this.props.actions.artistInfoSearchByName}
        addToQueue={this.props.actions.addToQueue}
        musicSources={this.props.musicSources}
        history={this.props.history}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    artistDetails: state.search.artistDetails,
    musicSources: state.plugin.plugins.musicSources
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, Actions, QueueActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArtistViewContainer));
