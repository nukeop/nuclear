import React from 'react';
import classNames from 'classnames';
import { Icon } from 'semantic-ui-react';

import { formatDuration, getSelectedStream } from '../../../utils';
import styles from './styles.scss';

class QueueItem extends React.Component {
  
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
        <Icon name='trash outline' size='big' />
      </div>
    );
  }

  renderThumbnailContainer(track, removeFromQueue) {
    return (
      <div className={styles.thumbnail_container}>
        <img src={this.props.track.thumbnail} />
        {this.renderRemoveFromQueueButton(track, removeFromQueue)}
      </div>
    );
  }

  renderClassName(current, loading) {
    return classNames(styles.queue_item_container, {
      [`${styles.current_song}`]: current,
      [styles.queue_item_container_loading]: loading
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
    const {
      current,
      loading,
      track,
      index,
      defaultMusicSource,
      selectSong,
      removeFromQueue
    } = this.props;

    const selectedStream = getSelectedStream(track.streams, defaultMusicSource);

    return (
      <div
        className={this.renderClassName(current, loading)}
        onDoubleClick={() => !loading && selectSong(index)}
      >
        {this.renderThumbnailContainer(track, removeFromQueue)}
        {this.renderItemInfoContainer(track)}
        {this.renderTrackDuration(selectedStream)}
      </div>
    );
  }
}

export default QueueItem;
