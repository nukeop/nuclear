import React from 'react';
import _ from 'lodash';

import TrackRow from '../../TrackRow';

class TracksResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    let collection = this.props.tracks || [];
    let limit = this.props.limit;
    if (collection.length === 0) {
      return 'No result';
    } else {
      return (
        <table>
          <tbody>
            {(collection || []).slice(0, limit).map((track, index) => {
              if (track && _.hasIn(track, 'name') & _.hasIn(track, 'image') && _.hasIn(track, 'artist')) {
                const newTrack = _.cloneDeep(track);
                if (!newTrack.artist.name) {
                  _.set(newTrack, 'artist.name', newTrack.artist);
                }
                return < TrackRow
                  key={'search-result-track-row-' + index}
                  track={newTrack}
                  index={'popular-track-' + index}
                  clearQueue={this.props.clearQueue}
                  addToQueue={this.props.addToQueue}
                  startPlayback={this.props.startPlayback}
                  selectSong={this.props.selectSong}
                  musicSources={this.props.musicSources}
                  displayArtist
                  displayCover
                />;
              }
            })}
          </tbody>
        </table>
      );
    }
  }
}

export default TracksResults;
