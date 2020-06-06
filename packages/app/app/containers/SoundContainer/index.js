import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withProps } from 'recompose';
import Sound, { Volume, Equalizer, AnalyserByFrequency } from 'react-hifi';
import logger from 'electron-timber';

import * as SearchActions from '../../actions/search';
import * as PlayerActions from '../../actions/player';
import * as EqualizerActions from '../../actions/equalizer';
import * as QueueActions from '../../actions/queue';
import * as ScrobblingActions from '../../actions/scrobbling';
import * as LyricsActions from '../../actions/lyrics';
import { filterFrequencies } from '../../components/Equalizer/chart';
import * as Autoradio from './autoradio';
import globals from '../../globals';
import { rest } from '@nuclear/core';

const lastfm = new rest.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

class SoundContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handlePlaying = this.handlePlaying.bind(this);
    this.handleFinishedPlaying = this.handleFinishedPlaying.bind(this);
    this.handleLoading = this.handleLoading.bind(this);
    this.handleLoaded = this.handleLoaded.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handlePlaying (update) {
    const seek = update.position;
    const progress = (update.position / update.duration) * 100;
    this.props.actions.updatePlaybackProgress(progress, seek);
    this.props.actions.updateStreamLoading(false);
  }

  handleLoading () {
    this.props.actions.updateStreamLoading(true);
  }

  handleLoaded () {
    this.handleLoadLyrics();
    this.handleAutoRadio();
    this.props.actions.updateStreamLoading(false);
  }

  handleLoadLyrics () {
    const currentSong = this.props.queue.queueItems[
      this.props.queue.currentSong
    ];

    if (typeof currentSong.lyrics === 'undefined') {
      this.props.actions.lyricsSearch(currentSong);
    }
  }

  handleAutoRadio () {
    if (
      this.props.settings.autoradio &&
      this.props.queue.currentSong === this.props.queue.queueItems.length - 1
    ) {
      Autoradio.addAutoradioTrackToQueue(this.props);
    }
  }

  handleFinishedPlaying () {
    if (
      this.props.scrobbling.lastFmScrobblingEnabled &&
      this.props.scrobbling.lastFmSessionKey
    ) {
      const currentSong = this.props.queue.queueItems[
        this.props.queue.currentSong
      ];
      this.props.actions.scrobbleAction(
        currentSong.artist,
        currentSong.name,
        this.props.scrobbling.lastFmSessionKey
      );
    }

    if (
      this.props.settings.shuffleQueue ||
      this.props.queue.currentSong < this.props.queue.queueItems.length - 1 ||
      this.props.settings.loopAfterQueueEnd
    ) {
      this.props.actions.nextSong();
    } else {
      this.props.actions.pausePlayback();
    }
  }

  addAutoradioTrackToQueue () {
    const currentSong = this.props.queue.queueItems[this.props.queue.currentSong];
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

  getSimilarArtists (artistJson) {
    return new Promise((resolve) => {
      resolve(artistJson.similar.artist);
    });
  }

  getRandomElement (arr) {
    const devianceParameter = 0.2; // We will select one of the 20% most similar artists
    const randomElement =
      arr[Math.round(Math.random() * (devianceParameter * (arr.length - 1)))];
    return new Promise((resolve) => resolve(randomElement));
  }

  getArtistTopTracks (artist) {
    return lastfm
      .getArtistTopTracks(artist.name)
      .then(topTracks => topTracks.json());
  }

  addToQueue (artist, track) {
    return new Promise((resolve) => {
      const streamProviders = this.props.plugins.plugins.streamProviders;
      this.props.actions.addToQueue(streamProviders, {
        artist: artist.name,
        name: track.name,
        thumbnail: track.thumbnail || track.image[0]['#text']
      });
      resolve(true);
    });
  }

  handleError(err) {
    logger.error(err.message);
    this.props.actions.streamFailed();
  }

  shouldComponentUpdate (nextProps) {
    const currentSong = nextProps.queue.queueItems[nextProps.queue.currentSong];

    return (
      this.props.equalizer !== nextProps.equalizer ||
      this.props.queue.currentSong !== nextProps.queue.currentSong ||
      this.props.player.playbackStatus !== nextProps.player.playbackStatus ||
      this.props.player.seek !== nextProps.player.seek ||
      (!!currentSong && !!currentSong.streams && currentSong.streams.length > 0)
    );
  }

  render () {
    const { player, equalizer, actions, enableSpectrum, currentStream } = this.props;

    return Boolean(currentStream) && (
      <Sound
        url={currentStream.stream}
        playStatus={player.playbackStatus}
        onPlaying={this.handlePlaying}
        onFinishedPlaying={this.handleFinishedPlaying}
        onLoading={this.handleLoading}
        onLoad={this.handleLoaded}
        position={player.seek}
        onError={this.handleError}
      >
        <Volume value={player.muted ? 0 : player.volume} />
        <Equalizer
          data={filterFrequencies.reduce((acc, freq, idx) => ({
            ...acc,
            [freq]: equalizer.values[idx] || 0
          }), {})}
          preAmp={equalizer.preAmp}
        />
        <AnalyserByFrequency
          frequencies={filterFrequencies}
          onVisualisationData={enableSpectrum && actions.setSpectrum}
        />
      </Sound>
    );
  }
}

function mapStateToProps (state) {
  return {
    queue: state.queue,
    plugins: state.plugin,
    player: state.player,
    scrobbling: state.scrobbling,
    settings: state.settings,
    equalizer: state.equalizer.presets[state.equalizer.selected],
    enableSpectrum: state.equalizer.enableSpectrum
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        SearchActions,
        PlayerActions,
        QueueActions,
        ScrobblingActions,
        LyricsActions,
        EqualizerActions
      ),
      dispatch
    )
  };
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withProps(({ queue }) => ({
    currentTrack: queue.queueItems[queue.currentSong]
  })),
  withProps(({ currentTrack, plugins }) => ({
    currentStream: Boolean(currentTrack) && (_.find(currentTrack.streams, { source: plugins.selected.streamProviders }) || _.head(currentTrack.streams))
  }))
)(SoundContainer);
