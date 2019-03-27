import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as FavoritesActions from '../../actions/favorites';
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
        tracks={ _.get(this.props.favorites, 'tracks')}
      />;
    }
    
    return null;
  }
}

FavoritesContainer.propTypes = {
  actions: PropTypes.object,
  favorites: PropTypes.shape({
    tracks: PropTypes.array,
    albums: PropTypes.array,
    artists: PropTypes.array
  })
};

FavoritesContainer.defaultProps = {
  actions: {},
  favorites: { tracks: [], albums: [], artists: [] }
};

function mapStateToProps (state) {
  return {
    favorites: state.favorites
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(FavoritesActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoritesContainer);
