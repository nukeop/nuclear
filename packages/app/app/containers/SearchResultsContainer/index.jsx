import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as SearchActions from '../../actions/search';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';

import SearchResults from '../../components/SearchResults';

function mapStateToProps(state) {
  return {
    artistSearchResults: state.search.artistSearchResults,
    albumSearchResults: state.search.albumSearchResults,
    podcastSearchResults: state.search.podcastSearchResults,
    trackSearchResults: state.search.trackSearchResults,
    playlistSearchResults: state.search.playlistSearchResults,
    liveStreamSearchResults: state.search.liveStreamSearchResults,
    unifiedSearchStarted: state.search.unifiedSearchStarted,
    playlistSearchStarted: state.search.playlistSearchStarted,
    liveStreamSearchStarted: state.search.liveStreamSearchStarted,
    streamProviders: state.plugin.plugins.streamProviders,
    metaProviders: state.plugin.plugins.metaProviders,
    selectedPlugins: state.plugin.selected
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  albumInfoSearch: SearchActions.albumInfoSearch,
  artistInfoSearch: SearchActions.artistInfoSearch,
  podcastInfoSearch: SearchActions.podcastSearch,
  addToQueue: QueueActions.addToQueue,
  clearQueue: QueueActions.clearQueue,
  startPlayback: PlayerActions.startPlayback,
  selectSong: QueueActions.selectSong
}, dispatch);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SearchResults);
