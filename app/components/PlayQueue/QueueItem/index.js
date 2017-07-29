import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

class QueueItem extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      this.props.loading
      ? (
          <div className={styles.queue_item_container}>
            <FontAwesome name="spinner" size='2x' pulse/>
          </div>
        )
      : (
          <div className={styles.queue_item_container}>
            <div className={styles.thumbnail_container}>
              <img src={this.props.track.thumbnail} />
            </div>
            <div className={styles.item_info_container}>
              <div className={styles.name_container}>
                {this.props.track.name}
              </div>
              <div className={styles.artist_container}>
                {this.props.track.artist}
              </div>
            </div>
          </div>
        )
    );
  }
}

export default QueueItem;
