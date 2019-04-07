import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as FavoritesActions from '../../actions/favorites';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as ToastActions from '../../actions/toasts';

import FavoriteTracksView from '../../components/FavoriteTracksView';

const TRACKS_PATH = 'tracks';
const ARTISTS_PATH = 'artists';
const ALBUMS_PATH = 'albums';

class FavoritesContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.readFavorites();
  }

  render() {
    if (this.props.match.path.endsWith(TRACKS_PATH)) {
      return <FavoriteTracksView
        tracks={_.get(this.props.favorites, 'tracks')}
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
  actions: PropTypes.shape({
    readFavorites: PropTypes.func
  })
};

FavoritesContainer.defaultProps = {
  favorites: { tracks: [], albums: [], artists: [] },
  actions: {}
};

function mapStateToProps (state) {
  return {
    favorites: state.favorites
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        FavoritesActions
      ),
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoritesContainer);
