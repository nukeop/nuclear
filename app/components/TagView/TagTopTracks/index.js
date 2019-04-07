import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';
import TrackRow from '../../TrackRow';

class TagTopTracks extends React.Component {
  constructor(props) {
    super(props);
  }

  renderAddAllButton () {
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

  render () {
    let { tracks } = this.props;
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
            {tracks.map((track, index) => {
              return < TrackRow
                key={'tag-track-row-' + index}
                track={track}
                index={'popular-track-' + index}
                artist={track.artist}
                displayCover
                displayArtist
                displayDuration
              />;
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TagTopTracks;
