import React from 'react';
import FontAwesome from 'react-fontawesome';

import { formatDuration } from '../../../utils';
import ContextPopup from '../../ContextPopup';
import styles from './styles.scss';

class TagTopTracks extends React.Component {
  constructor(props) {
    super(props);
  }

  renderContextPopup(track, i) {
    let { addToQueue, musicSources } = this.props;
    return (
      <ContextPopup
        key={i}
        artist={track.artist.name}
        title={track.name}
        thumb={track.image[1]['#text']}
        trigger={
          <tr className={styles.track}>
            <td
              style={{
                backgroundImage: `url(${track.image[1]['#text']})`
              }}
              className={styles.track_thumbnail}
            />
            <td className={styles.track_artist}>{track.name}</td>
            <td className={styles.track_name}>{track.artist.name}</td>
            <td className={styles.track_duration}>
              {formatDuration(track.duration)}
            </td>
          </tr>
        }
      >
        <a
          href='#'
          className='add_button'
          onClick={() => {
            addToQueue(musicSources, {
              artist: track.artist.name,
              name: track.name,
              thumbnail: track.image[1]['#text']
            });
          }}
          aria-label='Add track to queue'
        >
          <FontAwesome name='plus' /> Add to queue
        </a>
        <a
          href='#'
          className='add_button'
          onClick={() => {
            this.props.clearQueue();
            addToQueue(musicSources, {
              artist: track.artist.name,
              name: track.name,
              thumbnail: track.image[1]['#text']
            });
            this.props.selectSong(0);
            this.props.startPlayback();
            this.props.startPlayback();

          }}
          aria-label='Play Song Right Now'
        >
          <FontAwesome name='play' /> Play now
        </a>
      </ContextPopup>
    );
  }

  renderAddAllButton() {
    let { tracks, addToQueue, musicSources } = this.props;
    return (
      <a
        href='#'
        key='add-all-tag-tracks-to-queue'
        className='add_all_button'
        onClick={() => {
          tracks.map((track, i) => {
            addToQueue(musicSources, {
              artist: track.artist.name,
              name: track.name,
              thumbnail: track.image[1]['#text']
            });
          });
        }}
        aria-label='Add all tracks to queue'
      >
        <FontAwesome name='plus' /> Add all to queue
      </a>
    );
  }

  render() {
    let { tracks, addToQueue, musicSources } = this.props;
    return (
      <div className={styles.tag_top_tracks}>
        {this.renderAddAllButton()}
        <table>
          <thead>
            <tr>
              <th>
                <FontAwesome name='photo' />
              </th>
              <th>Artist</th>
              <th>Title</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, i) => {
              return this.renderContextPopup(track, i);
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TagTopTracks;
