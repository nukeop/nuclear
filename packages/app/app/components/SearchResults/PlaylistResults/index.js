import React from 'react';

import TracksResults from '../TracksResults';
import FontAwesome from 'react-fontawesome';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

@withTranslation('search')
class PlaylistResults extends React.Component {
  constructor(props) {
    super(props);
  }

  addTrack(track) {
    if (typeof track !== 'undefined') {
      this.props.addToQueue({
        artist: track.artist,
        name: track.name,
        thumbnail: track.thumbnail ?? _.get(track, 'image[1][\'#text\']', artPlaceholder)
      });
    }
  }
  renderAddAllButton(tracks) {
    return (tracks.length > 0 ? <a
      key='add-all-tracks-to-queue'
      href='#'
      onClick={() => {
        tracks
          .map(track => {
            this.addTrack(track);
          });
      }}
      aria-label={this.props.t('queue-add')}
    >
      <FontAwesome name='plus' /> Add all
    </a> : null
    );
  }

  renderLoading() {
    return (<div>Loading... <FontAwesome name='spinner' pulse /></div>);
  }

  renderResults = () =>
    <div>
      {this.renderAddAllButton(this.props.playlistSearchResults.info)}
      <TracksResults
        clearQueue={this.props.clearQueue}
        startPlayback={this.props.startPlayback}
        selectSong={this.props.selectSong}
        addToQueue={this.props.addToQueue}
        tracks={this.props.playlistSearchResults.info}
        limit='100'
        streamProviders={this.props.streamProviders}
      /></div>

  renderNoResult() {
    return (<div>{this.props.t('empty')}</div>);
  }
  render() {
    return (
      this.props.playlistSearchStarted ? ((this.props.playlistSearchStarted.length > 0 && typeof this.props.playlistSearchResults.info === 'undefined') ? this.renderLoading() : this.renderResults()) : this.renderNoResult()
    );
  }
}

export default PlaylistResults;
