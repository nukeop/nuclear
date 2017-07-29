import React from 'react';

import styles from './styles.scss';

import QueueItem from './QueueItem';

class PlayQueue extends React.Component {
  constructor(props){
    super(props);
  }

  renderQueueItems() {
    if (!this.props.items) {
      return null;
    }

    return this.props.items.map((el, i) => {
      return <QueueItem key={i} track={el}/>;
    });
  }

  render() {
    return (
      <div className={styles.play_queue_container}>
        {this.renderQueueItems()}
      </div>
    );
  }
}

export default PlayQueue;
