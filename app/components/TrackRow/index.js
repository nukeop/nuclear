import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import { Icon } from 'semantic-ui-react';

import * as QueueActions from '../../actions/queue';

import TrackPopupContainer from '../../containers/TrackPopupContainer';
import { formatDuration } from '../../utils';

import styles from './styles.scss';


class TrackRow extends React.Component {  
  // this function should be moved onto interface for 'track'
  renderAlbum (track) {
    return (
      <td className={styles.track_album}>
        { track.album }
      </td>
    );
  }

  renderDuration (track) {
    if (track.duration === 0) {
      return <td className={styles.track_duration} />;
    }
    return (
      <td className={styles.track_duration}>
        {formatDuration(track.duration)}
      </td>
    );
  }

  playTrack () {
    this.props.actions.playTrack(this.props.musicSources, {
      artist: this.props.track.artist.name,
      name: this.props.track.name,
      thumbnail: this.getTrackThumbnail()
    });
  }

  getTrackThumbnail() {
    return _.get(
      this.props.track,
      'thumbnail',
      _.get(this.props.track, 'image[0][#text]')
    );
  }
  
  canAddToFavorites() {
    return _.findIndex(this.props.favoriteTracks, (currentTrack) => { 
      return _.isMatch(currentTrack, this.props.track);
    }) < 0;
  }

  renderTrigger (track) {
    const {
      displayCover,
      displayTrackNumber,
      displayArtist,
      displayAlbum,
      displayDuration,
      displayPlayCount,
      withDeleteButton,
      onDelete
    } = this.props;

    return (
      <tr className={styles.track} onDoubleClick={this.playTrack.bind(this)}>
        {
          withDeleteButton &&
            <td className={styles.track_row_buttons}>
              <a onClick={onDelete}>
                <Icon name='close' />
              </a>
            </td>
        }
        {
          displayCover &&
            <td className={styles.track_thumbnail}>
              <img src={this.getTrackThumbnail()}/>
            </td>
        }
        { displayTrackNumber && <td className={styles.track_number}>{track.position}</td> }
        { displayArtist && <td className={styles.track_artist}>{track.artist.name}</td> }
        <td className={styles.track_name}>{ track.name }</td>
        { displayAlbum && this.renderAlbum(track) }
        { displayDuration && this.renderDuration(track) }
        { displayPlayCount && <td className={styles.playcount}>{numeral(track.playcount).format('0,0')}</td> }
      </tr>
    );
  }

  render () {
    
    let {
      track,
      withAddToQueue,
      withPlayNow,
      withAddToFavorites,
      withAddToDownloads
    } = this.props;
    return (
      <TrackPopupContainer
        trigger={this.renderTrigger(track)}
        track={track}
        artist={track.artist.name}
        title={track.name}
        thumb={this.getTrackThumbnail()}

        withAddToQueue={withAddToQueue}
        withPlayNow={withPlayNow}
        withAddToFavorites={this.canAddToFavorites()}
        withAddToDownloads={withAddToDownloads}
      />
    );
  }
}

TrackRow.propTypes = {
  track: PropTypes.object,

  displayCover: PropTypes.bool,
  displayTrackNumber: PropTypes.bool,
  displayArtist: PropTypes.bool,
  displayAlbum: PropTypes.bool,
  displayDuration: PropTypes.bool,
  displayPlayCount: PropTypes.bool,

  withAddToQueue: PropTypes.bool,
  withPlayNow: PropTypes.bool,
  withAddToFavorites: PropTypes.bool,
  withAddToDownloads: PropTypes.bool,
  withDeleteButton: PropTypes.bool,

  onDelete: PropTypes.func
};

TrackRow.defaultProps = {
  withAddToQueue: true,
  withPlayNow: true,
  withAddToFavorites: true,
  withAddToDownloads: true,
  withDeleteButton: false
};

function mapStateToProps (state, { track }) {
  return {
    musicSources: track.local
      ? state.plugin.plugins.musicSources.filter(({ sourceName }) => {
        return sourceName === 'Local';
      })
      : state.plugin.plugins.musicSources,
    settings: state.settings,
    favoriteTracks: state.favorites.tracks
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign({}, QueueActions),
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackRow);
