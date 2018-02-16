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
          });
    }, 1);
  }

  render() {
    let {
      current,
      loading,
      track,
      index,
      selectSong,
      removeFromQueue
    } = this.props;
    return (
          <div
            className={
              classNames(
                styles.queue_item_container,
                {
                  [`${styles.current_song}`]: current
                }
              )
            }
            style={this.state.style}
            onDoubleClick={() => selectSong(index)}
          >
            <div className={styles.thumbnail_container}>
              {
                loading
                ? <FontAwesome name="spinner" size='2x' pulse/>
                : <img src={this.props.track.thumbnail} />
              }

              <div className={styles.thumbnail_overlay} onClick={() => removeFromQueue(track)}>
		<FontAwesome name="trash-o" size='2x' />
	      </div>

            </div>
            <div className={styles.item_info_container}>

                <div className={styles.name_container}>
                  {track.name}
                </div>
                <div className={styles.artist_container}>
                  {track.artist}
                </div>

            </div>

            <div className={styles.item_duration_container}>
              <div className={styles.item_duration}>
                {
                  track.streams
                  ? formatDuration(track.streams[0].duration)
                  : null
                }
              </div>
            </div>
          </div>
    );
  }
}

export default QueueItem;
