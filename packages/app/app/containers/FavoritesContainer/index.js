import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as SearchActions from '../../actions';
import * as FavoritesActions from '../../actions/favorites';

import FavoriteAlbumsView from '../../components/FavoriteAlbumsView';
import FavoriteTracksView from '../../components/FavoriteTracksView';

const ALBUMS_PATH = 'albums';
const TRACKS_PATH = 'tracks';

class FavoritesContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.favoritesActions.readFavorites();
  }

  render() {
    const {
      favorites,
      favoritesActions,
      searchActions,
      match
    } = this.props;

    if(match.path.endsWith(ALBUMS_PATH)) {
      return <FavoriteAlbumsView
               albums={_.get(favorites, 'albums')}
               removeFavoriteAlbum={favoritesActions.removeFavoriteAlbum}
               albumInfoSearch={searchActions.albumInfoSearch}
             />;
    }
    
    if (match.path.endsWith(TRACKS_PATH)) {
      return <FavoriteTracksView
        tracks={_.get(favorites, 'tracks')}
        removeFavoriteTrack={favoritesActions.removeFavoriteTrack}
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
    removeFavoriteTrack: PropTypes.func
  }),
  searchActions: PropTypes.shape({
    albumInfoSearch: PropTypes.func
  })
};

FavoritesContainer.defaultProps = {
  favorites: { tracks: [], albums: [], artists: [] },
  favoritesActions: {},
  searchActions: {},
};

function mapStateToProps (state) {
  return {
    favorites: state.favorites
  };
}

function mapDispatchToProps (dispatch) {
  return {
    favoritesActions: bindActionCreators(FavoritesActions, dispatch),
    searchActions: bindActionCreators(SearchActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoritesContainer);
