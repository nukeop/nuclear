import React from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { RouteTransition } from 'react-router-transition';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as Actions from '../../actions';
import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';
import * as ScrobblingActions from '../../actions/scrobbling';
import Sound from 'react-sound';
import { getSelectedStream } from '../../utils';
import globals from '../../globals';
import core from 'nuclear-core';
import { consolidateStreamedStyles } from 'styled-components';

var lastfm = new core.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

class SoundContainer extends React.Component {
  handlePlaying(update) {
    let seek = update.position;
    let progress = (update.position / update.duration) * 100;
    this.props.actions.updatePlaybackProgress(progress, seek);
    this.props.actions.updateStreamLoading(false);
  }

  handleLoading() {
    this.props.actions.updateStreamLoading(true);
  }

  handleLoaded() {
    this.handleAutoRadio();
    this.props.actions.updateStreamLoading(false);
  }

  handleAutoRadio() {
    if (
      this.props.settings.autoradio &&
      this.props.queue.currentSong === this.props.queue.queueItems.length - 1
    ) {
      this.addAutoradioTrackToQueue();
    }
  }

  nextSong() {
    if (this.props.settings.shuffleQueue) {
      let index = _.random(0, this.props.queue.queueItems.length - 1);
      this.props.actions.selectSong(index);
    } else {
      this.props.actions.nextSong();
    }
  }

  handleFinishedPlaying() {
    if (
      this.props.scrobbling.lastFmScrobblingEnabled &&
      this.props.scrobbling.lastFmSessionKey
    ) {
      let currentSong = this.props.queue.queueItems[
        this.props.queue.currentSong
      ];
      this.props.actions.scrobbleAction(
        currentSong.artist,
        currentSong.name,
        this.props.scrobbling.lastFmSessionKey
      );
    }
    if (
      this.props.queue.currentSong <= this.props.queue.queueItems.length - 1 ||
      this.props.settings.loopAfterQueueEnd
    ) {
      this.nextSong();
    } else {
      this.props.actions.pausePlayback();
    }
  }

  addAutoradioTrackToQueue() {
    let currentSong = this.props.queue.queueItems[this.props.queue.currentSong];
    return lastfm
      .getArtistInfo(currentSong.artist)
      .then(artist => artist.json())
      .then(artistJson => this.getSimilarArtists(artistJson.artist))
      .then(similarArtists => this.getRandomElement(similarArtists))
      .then(selectedArtist => this.getArtistTopTracks(selectedArtist))
      .then(topTracks => this.getRandomElement(topTracks.toptracks.track))
      .then(track => {
        return this.addToQueue(track.artist, track);
      });
  }

  getSimilarArtists(artistJson) {
    return new Promise((resolve, reject) => {
      resolve(artistJson.similar.artist);
    });
  }

  getRandomElement(arr) {
    let randomElement = arr[Math.round(Math.random() * (arr.length - 1))];
    return new Promise((resolve, reject) => resolve(randomElement));
  }

  getArtistTopTracks(artist) {
    return lastfm
      .getArtistTopTracks(artist.name)
      .then(topTracks => topTracks.json());
  }

  addToQueue(artist, track) {
    return new Promise((resolve, reject) => {
      let musicSources = this.props.plugins.plugins.musicSources;
      this.props.actions.addToQueue(musicSources, {
        artist: artist.name,
        name: track.name,
        thumbnail: track.image[0]['#text'],
      });
      resolve(true);
    });
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.queue.currentSong !== nextProps.queue.currentSong ||
      this.props.player.playbackStatus !== nextProps.player.playbackStatus ||
      this.props.player.seek !== nextProps.player.seek
    );
  }

  render() {
    let { player, queue, plugins } = this.props;

    let streamUrl = '';

    if (queue.queueItems.length > 0) {
      let currentSong = queue.queueItems[queue.currentSong];
      streamUrl = (getSelectedStream(
        currentSong.streams,
        plugins.defaultMusicSource
      ) || {}).stream;
    }

    return (
      <Sound
        url={streamUrl}
        playStatus={player.playbackStatus}
        onPlaying={this.handlePlaying.bind(this)}
        onFinishedPlaying={this.handleFinishedPlaying.bind(this)}
        onLoading={this.handleLoading.bind(this)}
        onLoad={this.handleLoaded.bind(this)}
        position={player.seek}
        volume={player.volume}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    queue: state.queue,
    plugins: state.plugin,
    player: state.player,
    scrobbling: state.scrobbling,
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        Actions,
        PlayerActions,
        QueueActions,
        ScrobblingActions
        //AutoradioActions
      ),
      dispatch
    ),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SoundContainer)
);
