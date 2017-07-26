import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import AlbumView from '../../components/AlbumView';

class AlbumViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AlbumView
        album={this.props.albumDetails[this.props.match.params.albumId]}
        artistInfoSearch={this.props.actions.artistInfoSearch}
        history={this.props.history}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    albumDetails: state.search.albumDetails
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlbumViewContainer));
