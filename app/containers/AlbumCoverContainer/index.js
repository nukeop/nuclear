import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import AlbumCover from '../../components/AlbumCover';

class AlbumCoverContainer extends React.Component {

  componentWillMount() {
    this.props.actions.albumInfoSearch(this.props.album.id);
  }

  render() {
    return(
        this.props.unifiedSearchResults[1].results[this.props.albumIndex].images != undefined
        ? <AlbumCover
            artist={this.props.unifiedSearchResults[1].results[this.props.albumIndex].artists[0].name}
            title={this.props.unifiedSearchResults[1].results[this.props.albumIndex].title}
            cover={this.props.unifiedSearchResults[1].results[this.props.albumIndex].images[0].uri}
          />
        : <AlbumCover
            artist={this.props.unifiedSearchResults[1].results[this.props.albumIndex].title.split('-')[0]}
            title={this.props.unifiedSearchResults[1].results[this.props.albumIndex].title.split('-')[1]}
            cover={this.props.unifiedSearchResults[1].results[this.props.albumIndex].thumb}
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

export default connect(mapStateToProps, mapDispatchToProps)(AlbumCoverContainer);
