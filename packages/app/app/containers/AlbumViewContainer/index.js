import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SearchActions from '../../actions/search';
import * as DownloadsActions from '../../actions/downloads';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as FavoritesActions from '../../actions/favorites';
import * as ToastActions from '../../actions/toasts';

import AlbumView from '../../components/AlbumView';

const isFavorite = (albumId, favoriteAlbums) => {
  const album = _.find(favoriteAlbums, { id: albumId });
  return !_.isNil(album);
};

class AlbumViewContainer extends React.Component {
  componentDidMount() {
    this.props.favoritesActions.readFavorites();
  }

  render() {
    const {
      searchActions,
      queueActions,
      playerActions,
      favoritesActions,
      downloadsActions,
      toastActions,
      match,
      history,
      albumDetails,
      streamProviders,
      favoriteAlbums,
      settings
    } = this.props;

    return (
      <AlbumView
        album={albumDetails[match.params.albumId]}
        artistInfoSearchByName={searchActions.artistInfoSearchByName}
        addToQueue={queueActions.addToQueue}
        streamProviders={streamProviders}
        selectSong={queueActions.selectSong}
        startPlayback={playerActions.startPlayback}
        clearQueue={queueActions.clearQueue}
        addFavoriteAlbum={favoritesActions.addFavoriteAlbum}
        removeFavoriteAlbum={favoritesActions.removeFavoriteAlbum}
        isFavorite={() => isFavorite(match.params.albumId, favoriteAlbums)}
        addToDownloads={downloadsActions.addToDownloads}
        info={toastActions.info}
        settings={settings}
        history={history}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    albumDetails: state.search.albumDetails,
    streamProviders: state.plugin.plugins.streamProviders,
    favoriteAlbums: state.favorites.albums,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchActions: bindActionCreators(SearchActions, dispatch),
    queueActions: bindActionCreators(QueueActions, dispatch),
    playerActions: bindActionCreators(PlayerActions, dispatch),
    favoritesActions: bindActionCreators(FavoritesActions, dispatch),
    downloadsActions: bindActionCreators(DownloadsActions, dispatch),
    toastActions: bindActionCreators(ToastActions, dispatch)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AlbumViewContainer)
);
