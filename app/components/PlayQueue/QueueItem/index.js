import React from 'react';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';
import { formatDuration, getSelectedStream } from '../../../utils';

import styles from './styles.scss';

class QueueItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      style: {}
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        style: { opacity: 1 }
      });
    }, 1);
  }

  renderTrackDuration(selectedStream) {
    return (
      <div className={styles.item_duration_container}>
        <div className={styles.item_duration}>
          {selectedStream ? formatDuration(selectedStream.duration) : null}
        </div>
      </div>
    );
  }

  renderRemoveFromQueueButton(track, removeFromQueue) {
    return (
      <div
        className={styles.thumbnail_overlay}
        onClick={() => removeFromQueue(track)}
      >
        <FontAwesome name='trash-o' size='2x' />
      </div>
    );
  }

  renderThumbnailContainer(track, removeFromQueue, loading) {
    return (
      <div className={styles.thumbnail_container}>
        {loading ? (
          <FontAwesome name='spinner' size='2x' pulse />
        ) : (
          <img src={this.props.track.thumbnail} />
        )}
        {this.renderRemoveFromQueueButton(track, removeFromQueue)}
      </div>
    );
  }

  renderClassName(current) {
    return classNames(styles.queue_item_container, {
      [`${styles.current_song}`]: current
    });
  }

  renderItemInfoContainer(track) {
    return (
      <div className={styles.item_info_container}>
        <div className={styles.name_container}>{track.name}</div>
        <div className={styles.artist_container}>{track.artist}</div>
      </div>
    );
  }
  render() {
    let {
      current,
      loading,
      track,
      index,
      defaultMusicSource,
      selectSong,
      removeFromQueue
    } = this.props;

    let selectedStream = getSelectedStream(track.streams, defaultMusicSource);

    return (
      <div
        className={this.renderClassName(current)}
        style={this.state.style}
        onDoubleClick={() => selectSong(index)}
      >
        {this.renderThumbnailContainer(track, removeFromQueue, loading)}
        {this.renderItemInfoContainer(track)}
        {this.renderTrackDuration(selectedStream)}
      </div>
    );
  }
}

export default QueueItem;
