import React from 'react';
import FontAwesome from 'react-fontawesome';
import TrackRow from '../../TrackRow';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

class PopularTracks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  toggleExpand () {
    this.setState(prevState => {
      return { expanded: !prevState.expanded };
    });
  }

  renderAddAllButton (artist, tracks) {
    return (
      <a
        key='add-all-tracks-to-queue'
        href='#'
        onClick={() => {
          tracks.track
            .slice(0, this.state.expanded ? 15 : 5)
            .map((track, index) => {
              this.props.addToQueue(this.props.musicSources, {
                artist: artist.name,
                name: track.name,
                thumbnail: track.image[0]['#text'] || artPlaceholder
              });
            });
        }}
        className={styles.add_button}
        aria-label='Add all tracks to queue'
      >
        <FontAwesome name='plus' /> Add all
      </a>
    );
  }

  render () {
    let { artist, tracks } = this.props;

    return (
      <div className={styles.popular_tracks_container}>
        <div className={styles.header}>Popular tracks:</div>
        {this.renderAddAllButton(artist, tracks)}
        <table>
          <thead>
            <tr>
              <th>
                <FontAwesome name='photo' />
              </th>
              <th>Title</th>
              <th>Play Counts</th>
            </tr>
          </thead>
          <tbody>
            {tracks.track
              .slice(0, this.state.expanded ? 15 : 5)
              .map((track, index) => {
                return (
                  <TrackRow
                    key={'popular-track-row-' + index}
                    track={track}
                    index={'popular-track-' + index}
                    artist={artist}
                    clearQueue={this.props.clearQueue}
                    addToQueue={this.props.addToQueue}
                    startPlayback={this.props.startPlayback}
                    selectSong={this.props.selectSong}
                    musicSources={this.props.musicSources}
                    displayCover={true}
                    displayArtist={false}
                    displayDuration={false}
                    displayPlayCount={true}
                  />
                );
              })}
          </tbody>
        </table>
        <div className='expand_button' onClick={this.toggleExpand.bind(this)}>
          <FontAwesome
            name={this.state.expanded ? 'angle-double-up' : 'angle-double-down'}
          />
        </div>
      </div>
    );
  }
}

export default PopularTracks;
