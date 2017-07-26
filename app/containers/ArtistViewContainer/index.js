import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import ArtistView from '../../components/ArtistView';

class ArtistViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ArtistView
        artist={this.props.artistDetails[this.props.match.params.artistId]}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    artistDetails: state.search.artistDetails
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArtistViewContainer));
