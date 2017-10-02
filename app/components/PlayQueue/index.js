import React from 'react';
import classnames from 'classnames';

import styles from './styles.scss';

import QueueItem from './QueueItem';
import QueueMenu from './QueueMenu';

class PlayQueue extends React.Component {
  constructor(props){
    super(props);
  }

  renderQueueItems() {
    if (!this.props.items) {
      return null;
    }

    return this.props.items.map((el, i) => {
      return (
        <QueueItem
          key={i}
          index={i}
          track={el}
          loading={el.loading}
          current={this.props.currentSong==i}
          selectSong={this.props.selectSong}
        />
      );
    });
  }

  render() {
    return (
      <div className={styles.play_queue_container}>
        <QueueMenu clearQueue={this.props.clearQueue} />

          <div className={classnames(styles.play_queue_items, styles.fade_in)}>
            {this.renderQueueItems()}
          </div>
        
      </div>
    );
  }
}

export default PlayQueue;
