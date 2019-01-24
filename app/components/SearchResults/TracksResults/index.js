<<<<<<< HEAD
import React from 'react';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

class TracksResults extends React.Component {
    constructor(props) {
        super(props);
    }

    renderTrack (track, index = 0) {
        let addToQueue = this.props.addToQueue;
        return (
            <div key={'track-' + index} className={styles.track_row} onClick={() => {
                addToQueue(this.props.musicSources, {
                    artist: track.name,
                    name: track.name,
                    thumbnail: track.image[1]['#text']
                });
            }}>
                <img src={track.image[0]['#text'] || artPlaceholder} />
                <div className={styles.popular_track_name}>{track.artist} - {track.name}</div>

            </div>
        );
    }

    render () {
        let collection = this.props.tracks || []
        let limit = this.props.limit
        if (collection.length == 0) {
            return "No result"
        } else {
            return (
                <div className={styles.popular_tracks_container}>
                    {
                        (collection || []).slice(0, limit).map((track, i) => {
                            if (track) {
                                if (track.name && track.image && track.artist) {
                                    { return this.renderTrack(track, i) }
                                }
                            }
                        })
                    }
                </div>
            );
        }
    }
}

export default TracksResults;
=======
import React from 'react';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

class TracksResults extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTrack (track, index = 0) {
    let addToQueue = this.props.addToQueue;
    return (
      <div key={'track-' + index} className={styles.track_row} onClick={() => {
        addToQueue(this.props.musicSources, {
          artist: track.name,
          name: track.name,
          thumbnail: track.image[1]['#text']
        });
      }}>
        <img src={track.image[0]['#text'] || artPlaceholder} />
        <div className={styles.popular_track_name}>{track.artist} - {track.name}</div>

      </div>
    );
  }

  render () {
    let collection = this.props.tracks || [];
    let limit = this.props.limit;
    if (collection.length == 0) {
      return 'No result';
    } else {
      return (
        <div className={styles.popular_tracks_container}>
          {
            (collection || []).slice(0, limit).map((track, i) => {
              if (track) {
                if (track.name && track.image && track.artist) {
                  { return this.renderTrack(track, i); }
                }
              }
            })
          }
        </div>
      );
    }
  }
}

export default TracksResults;
>>>>>>> a1d756eddfc6d9de14ae4ebb575d9e4d43dab853
