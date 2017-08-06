import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

var classNames = require('classnames');

class QueueItem extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
          <div
            className={classNames({
              [`${styles.queue_item_container}`]: true,
              [`${styles.current_song}`]: this.props.current})
            }
            onDoubleClick={() => this.props.selectSong(this.props.index)}
          >
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
