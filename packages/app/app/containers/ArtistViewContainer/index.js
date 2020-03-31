import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, lifecycle, withProps } from 'recompose';
import * as SearchActions from '../../actions/search';
import * as QueueActions from '../../actions/queue';

import ArtistView from '../../components/ArtistView';

const mapStateToProps = state => ({
  artistDetails: state.search.artistDetails,
  streamProviders: state.plugin.plugins.streamProviders
});

const mapDispatchToProps = dispatch => bindActionCreators({
  albumInfoSearch: SearchActions.albumInfoSearch,
  artistInfoSearchByName: SearchActions.artistInfoSearchByName,
  artistReleasesSearch: SearchActions.artistReleasesSearch,
  addToQueue: QueueActions.addToQueue
}, dispatch);

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withProps(({ artistDetails, match }) => ({
    artist: artistDetails[match.params.artistId]
  })),
  lifecycle({
    componentDidMount() {
      this.props.artistReleasesSearch(this.props.match.params.artistId);
    }
  })
)(ArtistView);
