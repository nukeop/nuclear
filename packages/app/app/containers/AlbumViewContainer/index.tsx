import React, { useCallback } from 'react';
import _ from 'lodash';
import { useHistory, useRouteMatch, withRouter } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AlbumDetails } from '@nuclear/core/src/plugins/plugins.types';

import * as SearchActions from '../../actions/search';
import * as DownloadsActions from '../../actions/downloads';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as FavoritesActions from '../../actions/favorites';
import * as ToastActions from '../../actions/toasts';

import AlbumView from '../../components/AlbumView';
import { searchSelectors } from '../../selectors/search';
import { favoritesSelectors } from '../../selectors/favorites';
import { safeAddUuid } from '../../actions/helpers';
import { pluginsSelectors } from '../../selectors/plugins';

const getIsFavorite = (albumId, favoriteAlbums) => {
  const album = _.find(favoriteAlbums, { id: albumId });
  return !_.isNil(album);
};

const AlbumViewContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch<{ albumId: string }>();

  const albumDetails = useSelector(searchSelectors.albumDetails);
  // TODO replace this any with a proper type
  const plugins: any = useSelector(pluginsSelectors.plugins);
  const favoriteAlbums = useSelector(favoritesSelectors.albums);
  const album: AlbumDetails = albumDetails[match.params.albumId];
  const isFavorite = getIsFavorite(match.params.albumId, favoriteAlbums);

  const searchAlbumArtist = useCallback(() => dispatch(
    SearchActions.artistInfoSearchByName(
      album.artist,
      history
    )), [album.artist, dispatch, history]);

  const addAlbumToDownloads = useCallback(async () => {
    await album.tracklist.forEach(async track => {
      const clonedTrack = safeAddUuid(track);
      DownloadsActions.addToDownloads(plugins.streamProviders, clonedTrack);
    });
  }, [album.tracklist, plugins.streamProviders]);

  return <AlbumView
    album={album}
    isFavorite={isFavorite}
    searchAlbumArtist={searchAlbumArtist}
    addAlbumToDownloads={addAlbumToDownloads}
  />;
};

export default AlbumViewContainer;

// class AlbumViewContainer extends React.Component {
//   componentDidMount() {
//     this.props.favoritesActions.readFavorites();
//   }

//   render() {
//     const {
//       searchActions,
//       queueActions,
//       playerActions,
//       favoritesActions,
//       downloadsActions,
//       toastActions,
//       match,
//       history,
//       albumDetails,
//       streamProviders,
//       favoriteAlbums,
//       settings
//     } = this.props;

//     return (
//       <AlbumView
//         album={albumDetails[match.params.albumId]}
//         artistInfoSearchByName={searchActions.artistInfoSearchByName}
//         addToQueue={queueActions.addToQueue}
//         streamProviders={streamProviders}
//         selectSong={queueActions.selectSong}
//         startPlayback={playerActions.startPlayback}
//         clearQueue={queueActions.clearQueue}
//         addFavoriteAlbum={favoritesActions.addFavoriteAlbum}
//         removeFavoriteAlbum={favoritesActions.removeFavoriteAlbum}
//         isFavorite={() => isFavorite(match.params.albumId, favoriteAlbums)}
//         addToDownloads={downloadsActions.addToDownloads}
//         info={toastActions.info}
//         settings={settings}
//         history={history}
//       />
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     albumDetails: state.search.albumDetails,
//     streamProviders: state.plugin.plugins.streamProviders,
//     favoriteAlbums: state.favorites.albums,
//     settings: state.settings
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     searchActions: bindActionCreators(SearchActions, dispatch),
//     queueActions: bindActionCreators(QueueActions, dispatch),
//     playerActions: bindActionCreators(PlayerActions, dispatch),
//     favoritesActions: bindActionCreators(FavoritesActions, dispatch),
//     downloadsActions: bindActionCreators(DownloadsActions, dispatch),
//     toastActions: bindActionCreators(ToastActions, dispatch)
//   };
// }

// export default withRouter(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )(AlbumViewContainer)
// );
