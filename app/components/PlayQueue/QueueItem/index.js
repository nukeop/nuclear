import React from 'react';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';
import {formatDuration} from '../../../utils';

import styles from './styles.scss';

class QueueItem extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      style: {} 
    };
  }

  componentDidMount() {
    setTimeout(() => {
        this.setState(
          {
            style: {'opacity': 1}
          })}, 1);
  }

  render() {
    return (
          <div
            className={
              classNames(
                styles.queue_item_container,
                {
                  [`${styles.current_song}`]: this.props.current
                }
              )
            }
            style={this.state.style}
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

            <div className={styles.item_duration_container}>
              <div className={styles.item_duration}>
                {
                  this.props.track.streams
                  ? formatDuration(this.props.track.streams[0].duration)
                  : null
                }
              </div>
            </div>
          </div>
    );
  }
}

export default QueueItem;
