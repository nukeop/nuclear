import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { removeQuotes } from '../../utils';
import * as FavoritesActions from '../../actions/favorites';
import * as ToastActions from '../../actions/toasts';
import { getFavoriteTrack, getFavoriteAlbum } from '../../selectors/favorites';
import ItemType from '../../constants/itemType';
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
  const getFavorite = ownProps.type === ItemType.ALBUM ? getFavoriteAlbum : getFavoriteTrack;

  return {
    favoriteItem: ownProps.item
      ? getFavorite(state, ownProps.item.artist, removeQuotes(ownProps.item.title))
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
