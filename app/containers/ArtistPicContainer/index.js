import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import AlbumCover from '../../components/AlbumCover';

class ArtistPicContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.artistInfoSearch(this.props.artist.id);
  }

  render() {
    return(
      this.props.unifiedSearchResults[0].results[this.props.artistIndex].images != undefined
      ? <AlbumCover
        nameOnly
        artist={this.props.unifiedSearchResults[0].results[this.props.artistIndex].name}
        cover={this.props.unifiedSearchResults[0].results[this.props.artistIndex].images[0].uri}
      />
      : <AlbumCover
        nameOnly
        artist={this.props.unifiedSearchResults[0].results[this.props.artistIndex].title}
        cover={this.props.unifiedSearchResults[0].results[this.props.artistIndex].thumb}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    unifiedSearchResults: state.search.unifiedSearchResults
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistPicContainer);
