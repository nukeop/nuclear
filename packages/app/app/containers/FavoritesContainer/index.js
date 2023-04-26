import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as SearchActions from '../../actions/search';
import * as FavoritesActions from '../../actions/favorites';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';

import FavoriteAlbumsView from '../../components/FavoriteAlbumsView';
import FavoriteTracksView from '../../components/FavoriteTracksView';
import FavoriteArtistsView from '../../components/FavoriteArtistsView';

const ALBUMS_PATH = 'albums';
const TRACKS_PATH = 'tracks';
const ARTISTS_PATH = 'artists';

class FavoritesContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.favoritesActions.readFavorites();
  }

  playRandomFavoriteTrack(favoriteTracks, playTrack) {
    const randomTrack = favoriteTracks?.[Math.floor(Math.random() * favoriteTracks.length)];
    playTrack(null, randomTrack);
  }

  render() {
    const {
      favorites,
      favoritesActions,
      searchActions,
      match,
      queueActions,
      streamProviders,
      playerActions
    } = this.props;

    if (match.path.endsWith(ALBUMS_PATH)) {
      return <FavoriteAlbumsView
        albums={_.get(favorites, 'albums')}
        removeFavoriteAlbum={favoritesActions.removeFavoriteAlbum}
        albumInfoSearch={searchActions.albumInfoSearch}
      />;
    }

    if (match.path.endsWith(TRACKS_PATH)) {
      return <FavoriteTracksView
        addToQueue={queueActions.addToQueue}
        streamProviders={streamProviders}
        tracks={favorites?.tracks || []}
        clearQueue={queueActions.clearQueue}
        selectSong={queueActions.selectSong}
        startPlayback={playerActions.startPlayback}
        removeFavoriteTrack={favoritesActions.removeFavoriteTrack}
        playRandomFavoriteTrack={this.playRandomFavoriteTrack.bind(this, favorites?.tracks, queueActions.playTrack)}
      />;
    }

    if (match.path.endsWith(ARTISTS_PATH)) {
      return <FavoriteArtistsView
        artists={_.get(favorites, 'artists')}
        removeFavoriteArtist={favoritesActions.removeFavoriteArtist}
        artistInfoSearch={searchActions.artistInfoSearch}
      />;
    }

    return null;
  }
}

FavoritesContainer.propTypes = {
  favorites: PropTypes.shape({
    tracks: PropTypes.array,
    albums: PropTypes.array,
    artists: PropTypes.array
  }),
  favoritesActions: PropTypes.shape({
    readFavorites: PropTypes.func,
    removeFavoriteTrack: PropTypes.func,
    removeFavoriteArtist: PropTypes.func
  }),
  searchActions: PropTypes.shape({
    albumInfoSearch: PropTypes.func,
    artistInfoSearch: PropTypes.func
  })
};

FavoritesContainer.defaultProps = {
  favorites: { tracks: [], albums: [], artists: [] },
  favoritesActions: {},
  searchActions: {}
};

function mapStateToProps(state) {
  return {
    favorites: state.favorites,
    streamProviders: state.plugin.plugins.streamProviders
  };
}

function mapDispatchToProps(dispatch) {
  return {
    favoritesActions: bindActionCreators(FavoritesActions, dispatch),
    searchActions: bindActionCreators(SearchActions, dispatch),
    queueActions: bindActionCreators(QueueActions, dispatch),
    playerActions: bindActionCreators(PlayerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoritesContainer);
