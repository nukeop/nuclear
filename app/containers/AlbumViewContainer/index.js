import React from 'react';

import AlbumView from '../../components/AlbumView';
import wrapComponent from '../FunctionalityWrapper';

const AlbumViewContainer = ({
  actions,
  match,
  history,
  albumDetails,
  musicSources
}) => (
  <AlbumView
    album={albumDetails[match.params.albumId]}
    artistInfoSearch={actions.artistInfoSearch}
    addToQueue={actions.addToQueue}
    musicSources={musicSources}
    selectSong={actions.selectSong}
    startPlayback={actions.startPlayback}
    clearQueue={actions.clearQueue}
    history={history}
  />
);

function mapStateToProps(state) {
  return {
    albumDetails: state.search.albumDetails,
    musicSources: state.plugin.plugins.musicSources
  };
}

export default wrapComponent(AlbumViewContainer, mapStateToProps);
