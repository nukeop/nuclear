import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import ContextPopup from '../ContextPopup';
import { formatDuration } from '../../utils';

import styles from './styles.scss';

class TrackRow extends React.Component {
  renderAddTrackToQueueButton (index, track, addToQueue, musicSources) {
    return (
      <a
        key={'add-track-' + index}
        href='#'
        onClick={() =>
          addToQueue(musicSources, {
            artist: track.artist.name,
            name: track.name,
            thumbnail: _.get(track, 'image[0][\'#text\']', artPlaceholder)
          })
        }
        className={styles.add_button}
        aria-label='Add track to queue'
      >
        <FontAwesome name='plus' /> Add to queue
      </a>
    );
  }

  renderPlayTrackButton (index) {
    return (
      <a
        key={'play-track-' + index}
        href='#'
        onClick={this.playTrack}
        className={styles.add_button}
        aria-label='Play this track now'
      >
        <FontAwesome name='play' /> Play now
      </a>
    );
  }

  renderAddToFavoritesButton(index, track, settings, addFavoriteTrack, notifyInfo) {
    return (
      <a
        href='#'
        onClick={() => {
          addFavoriteTrack(track);
          notifyInfo(
            'Favorite track added',
            `${track.artist.name} - ${track.name} has been added to favorites.`,
            <img src={_.get(track, 'image[0][\'#text\']', artPlaceholder)} />,
            settings
          );
        }}
        className={styles.add_button}
        aria-label='Add this track to favorites'
      >
        <FontAwesome name='star' /> Add to favorites
      </a>
    );
  }

  playTrack = () => {
    const {
      track,
      clearQueue,
      addToQueue,
      selectSong,
      startPlayback,
      musicSources
    } = this.props;

    clearQueue();
    addToQueue(musicSources, {
      artist: track.artist.name,
      name: track.name,
      thumbnail: _.get(track, 'image[0][\'#text\']', artPlaceholder)
    });
    selectSong(0);
    startPlayback();
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

  renderTrigger (track) {
    return (
      <tr className={styles.track} onDoubleClick={this.playTrack}>
        {this.props.displayCover &&
          <td
            style={{
              backgroundImage: `url(${_.get(track, 'image[0][#text]', artPlaceholder)})`,
              backgroundPosition: 'center'
            }}
            className={styles.track_thumbnail}
          />}
        {this.props.displayTrackNumber && <td className={styles.track_artist}>{track.position}</td>}
        {this.props.displayArtist && <td className={styles.track_artist}>{track.artist.name}</td>}
        <td className={styles.track_name}>{track.name}</td>
        {this.props.displayDuration && this.renderDuration(track)}
        {this.props.displayPlayCount && <td className={styles.playcount}>{numeral(track.playcount).format('0,0')}</td>}
      </tr>
    );
  }

  render () {
    let {
      index,
      track,
      addToQueue,
      addFavoriteTrack,
      notifyInfo,
      musicSources,
      withFavorites,
      settings
    } = this.props;

    let popupContents = [
      this.renderAddTrackToQueueButton(
        index,
        track,
        addToQueue,
        musicSources
      ),
      this.renderPlayTrackButton(index),
      withFavorites && this.renderAddToFavoritesButton(
        index,
        track,
        settings,
        addFavoriteTrack,
        notifyInfo
      )
    ];
    
    return (
      <ContextPopup
        key={'track-' + index}
        trigger={this.renderTrigger(track)}
        artist={track.artist.name}
        title={track.name}
        thumb={_.get(track, 'image[1][\'#text\']', _.get(track, 'image[0][\'#text\']', artPlaceholder))}
      >
        {popupContents}
      </ContextPopup>
    );
  }
}

TrackRow.propTypes = {
  index: PropTypes.number,
  track: PropTypes.object,
  addToQueue: PropTypes.func,
  clearQueue: PropTypes.func,
  selectSong: PropTypes.func,
  startPlayback: PropTypes.func,
  musicSources: PropTypes.array,
  settings: PropTypes.object,

  displayCover: PropTypes.bool,
  displayTrackNumber: PropTypes.bool,
  displayArtist: PropTypes.bool,
  displayDuration: PropTypes.bool,
  displayPlayCount: PropTypes.bool,
  withFavorites: PropTypes.bool
};

TrackRow.defaultProps = {
  withFavorites: false
};

export default TrackRow;
