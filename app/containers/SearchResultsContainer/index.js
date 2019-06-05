import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';

import SearchResults from '../../components/SearchResults';

const SearchResultsContainer = ({
  artistSearchResults,
  albumSearchResults,
  trackSearchResults,
  playlistSearchResults,
  unifiedSearchStarted,
  playlistSearchStarted,
  actions,
  musicSources
}) => (
  <SearchResults
    artistSearchResults={artistSearchResults}
    albumSearchResults={albumSearchResults}
    trackSearchResults={trackSearchResults}
    playlistSearchResults={playlistSearchResults}
    unifiedSearchStarted={unifiedSearchStarted}
    playlistSearchStarted={playlistSearchStarted}
    albumInfoSearch={actions.albumInfoSearch}
    artistInfoSearch={actions.artistInfoSearch}
    history={history}
    addToQueue={actions.addToQueue}
    clearQueue={actions.clearQueue}
    startPlayback={actions.startPlayback}
    selectSong={actions.selectSong}
    musicSources={musicSources}
  />
);

function mapStateToProps(state) {
  return {
    artistSearchResults: state.search.artistSearchResults,
    albumSearchResults: state.search.albumSearchResults,
    trackSearchResults: state.search.trackSearchResults,
    playlistSearchResults: state.search.playlistSearchResults,
    unifiedSearchStarted: state.search.unifiedSearchStarted,
    playlistSearchStarted: state.search.playlistSearchStarted,
    musicSources: state.plugin.plugins.musicSources
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultsContainer);
