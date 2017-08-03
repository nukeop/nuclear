import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

class QueueItem extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
          <div className={styles.queue_item_container}>
            <div className={styles.thumbnail_container}>
              {
                this.props.loading
                ? <FontAwesome name="spinner" size='2x' pulse/>
                : <img src={this.props.track.thumbnail} />
                }

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
    );
  }
}

export default QueueItem;
