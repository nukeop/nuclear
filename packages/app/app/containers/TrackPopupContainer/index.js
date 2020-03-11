import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ContextPopup, PopupButton } from '@nuclear/ui';

import * as DownloadsActions from '../../actions/downloads';
import * as FavoritesActions from '../../actions/favorites';
import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';
import * as ToastActions from '../../actions/toasts';
import { safeAddUuid } from '../../actions/helpers';

const TrackPopupContainer = props => {
  const {
    trigger,
    track,
    artist,
    title,
    thumb,
    actions,
    streamProviders,
    settings,

    withAddToQueue,
    withPlayNow,
    withAddToFavorites,
    withAddToDownloads
  } = props;

  const trackItem = {
    artist,
    name: title,
    thumbnail: props.thumb
  };

  return (
    <ContextPopup
      trigger={trigger}
      artist={artist}
      title={title}
      thumb={thumb}
    >
      {
        withAddToQueue &&
          <PopupButton
            onClick={() => actions.addToQueue(streamProviders, trackItem)}
            ariaLabel='Add track to queue'
            icon='plus'
            label='Add to queue'
          />
      }

      {
        withPlayNow &&
        <PopupButton
          onClick={() => actions.playTrack(streamProviders, trackItem)}
          ariaLabel='Play this track now'
          icon='play'
          label='Play now'
        />
      }

      {
        withAddToFavorites &&
        <PopupButton
          onClick={() => {
            actions.addFavoriteTrack(track);
            actions.info(
              'Favorite track added',
              `${artist} - ${title} has been added to favorites.`,
              <img src={thumb} />,
              settings
            );
          }}
          ariaLabel='Add this track to favorites'
          icon='star'
          label='Add to favorites'
        />
      }

      {
        withAddToDownloads &&
        <PopupButton
          onClick={() => {
            const clonedTrack = safeAddUuid(track);
            actions.addToDownloads(streamProviders, clonedTrack);
            actions.info(
              'Track added to downloads',
              `${artist} - ${title} has been added to downloads.`,
              <img src={thumb} />,
              settings
            );
          }}
          ariaLabel='Download this track'
          icon='download'
          label='Download'
        />
      }

    </ContextPopup>
  );
};

TrackPopupContainer.propTypes = {
  trigger: PropTypes.node,
  track: PropTypes.object,
  artist: PropTypes.string,
  title: PropTypes.string,
  thumb: PropTypes.string,
  actions: PropTypes.shape({
    addToQueue: PropTypes.func,
    clearQueue: PropTypes.func,
    selectSong: PropTypes.func,
    startPlayback: PropTypes.func,
    addToDownloads: PropTypes.func
  }),
  streamProviders: PropTypes.array,
  settings: PropTypes.object,

  withAddToQueue: PropTypes.bool,
  withPlayNow: PropTypes.bool,
  withAddToFavorites: PropTypes.bool,
  withAddToDownloads: PropTypes.bool
};

TrackPopupContainer.defaultProps = {
  trigger: null,
  track: {},
  artist: '',
  title: '',
  thumb: '',
  actions: {},
  streamProviders: [],
  settings: {},

  withAddToQueue: true,
  withPlayNow: true,
  withAddToFavorites: true,
  withAddToDownloads: true
};

function mapStateToProps (state, { track }) {
  return {
    streamProviders: track.local
      ? state.plugin.plugins.streamProviders.filter(({ sourceName }) => {
        return sourceName === 'Local';
      })
      : state.plugin.plugins.streamProviders,
    settings: state.settings
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        DownloadsActions,
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
)(TrackPopupContainer);
