import React from 'react';
import { connect } from 'react-redux';
import { ActionCreator, ActionCreatorsMapObject, bindActionCreators } from 'redux';
import * as FavoritesActions from '../../actions/favorites';
import * as ToastActions from '../../actions/toasts';
import { getFavoriteTrack } from '../../selectors/favorites';
import BestNewMusicCard from '../../components/Dashboard/BestNewMusicTab/BestNewMusicMenu/BestNewMusicCard';

const BestNewMusicCardContainer = props => <BestNewMusicCard {...props} />;

function mapStateToProps(state, ownProps) {
  return {
    favoriteTrack: ownProps.item
      ? getFavoriteTrack(state, ownProps.item.artist, ownProps.item.title)
      : null,
    settings: state.settings
  };
}

export interface BestNewMusicCardContainerProps extends ActionCreatorsMapObject {
  FavoritesActions: ActionCreator<typeof FavoritesActions>;
  TostActions: ActionCreator<typeof ToastActions>;
}

const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators<BestNewMusicCardContainerProps, any>(
  {
    ...FavoritesActions,
    ...ToastActions
  },
  dispatch
) });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BestNewMusicCardContainer);
