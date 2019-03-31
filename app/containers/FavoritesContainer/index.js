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
      settings={this.props.settings}
      actions={this.props.actions}
      musicSources={this.props.musicSources}
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
  }),
  settings: PropTypes.object,
  musicSources: PropTypes.array
};

FavoritesContainer.defaultProps = {
  actions: {},
  favorites: { tracks: [], albums: [], artists: [] },
  settings: {},
  musicSources: []
};

function mapStateToProps (state) {
  return {
    favorites: state.favorites,
    settings: state.settings,
    musicSources: state.plugin.plugins.musicSources
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        FavoritesActions,
        QueueActions,
        PlayerActions,
        ToastActions
      ),
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoritesContainer);
