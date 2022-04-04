import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as FavoritesActions from '../../actions/favorites';
import * as ToastActions from '../../actions/toasts';
import { getFavoriteTrack } from '../../selectors/favorites';
import BestNewMusicCard, { bestNewItemShape } from '../../components/Dashboard/BestNewMusicTab/BestNewMusicMenu/BestNewMusicCard';

const BestNewMusicCardContainer = props => <BestNewMusicCard {...props} />;

BestNewMusicCardContainer.propTypes = {
  item: bestNewItemShape,
  onClick: PropTypes.func
};

BestNewMusicCardContainer.defaultProps = {
  item: null,
  onClick: () => { }
};

function mapStateToProps(state, ownProps) {
  return {
    favoriteTrack: ownProps.item
      ? getFavoriteTrack(state, ownProps.item.artist, ownProps.item.title)
      : null,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        FavoritesActions,
        ToastActions
      ),
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BestNewMusicCardContainer);
