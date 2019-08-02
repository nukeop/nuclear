import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getIsTrackFavorite } from '../../selectors/favorites';
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
    // todo normalize track name
    isFavorite: ownProps.item ? getIsTrackFavorite(state, ownProps.item.artist, ownProps.item.title.replace('“', '').replace('”', '')) : false
  };
}

export default connect(
  mapStateToProps
)(BestNewMusicCardContainer);
