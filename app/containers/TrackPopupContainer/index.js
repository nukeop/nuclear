import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Popup } from 'semantic-ui-react';

import * as FavoritesActions from '../../actions/favorites';
import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';

import ContextPopup from '../../components/ContextPopup';
import PopupButton from '../../components/ContextPopup/PopupButton';

const TrackPopupContainer = props => {
  const {
    trigger,
    artist,
    title,
    thumb,
    actions,
    musicSources,

    withAddToQueue,
    withPlayNow
  } = props;
  
  return (
    <ContextPopup
      trigger={ trigger }
      artist={ artist }
      title={ title }
      thumb={ thumb }
    >
      {
        withAddToQueue &&
          <PopupButton
            onClick={() => {
              actions.addToQueue(
                musicSources,
                {
                  artist: props.artist,
                  name: props.title,
                  thumbnail: props.thumb
                });
            }}
            ariaLabel='Add track to queue'
            icon='plus'
            label='Add to queue'
          />
      }

      {
        withPlayNow &&
        <PopupButton
          onClick={ () => {
            actions.clearQueue();
            actions.addToQueue(
              musicSources,
              {
                artist: props.artist,
                name: props.title,
                thumbnail: props.thumb
              });
            actions.selectSong(0);
            actions.startPlayback();
          }}
          ariaLabel='Play this track now'
          icon='play'
          label='Play now'
        />
      }
    </ContextPopup>
  );
};

TrackPopupContainer.propTypes = {
  trigger: PropTypes.node,
  artist: PropTypes.string,
  title: PropTypes.string,
  thumb: PropTypes.string,
  actions: PropTypes.shape({
    addToQueue: PropTypes.func,
    clearQueue: PropTypes.func,
    selectSong: PropTypes.func,
    startPlayback: PropTypes.func
  }),
  musicSources: PropTypes.array,

  withAddToQueue: PropTypes.bool,
  withPlayNow: PropTypes.bool,
  withAddToFavorites: PropTypes.bool,
  withAddToDownloads: PropTypes.bool
};

TrackPopupContainer.defaultProps = {
  trigger: null,
  artist: '',
  title: '',
  thumb: '',
  actions: {},
  musicSources: [],
  
  withAddToQueue: true,
  withPlayNow: true,
  withAddToFavorites: true,
  withAddToDownloads: true
};

function mapStateToProps (state) {
  return {
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
        PlayerActions
      ),
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPopupContainer);

