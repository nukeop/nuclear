import React from 'react';

import styles from './styles.css';

import QueueItem from './QueueItem';

class PlayQueue extends React.Component {
  constructor(props){
    super(props);
  }

  renderQueueItems() {
    return this.props.items.map((el, i) => {
      return <QueueItem track={el}/>;
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
