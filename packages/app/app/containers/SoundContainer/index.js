import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Sound, { Volume, Equalizer, AnalyserByFrequency } from 'react-hifi';
import logger from 'electron-timber';

import * as Actions from '../../actions';
import * as PlayerActions from '../../actions/player';
import * as EqualizerActions from '../../actions/equalizer';
import * as QueueActions from '../../actions/queue';
import * as ScrobblingActions from '../../actions/scrobbling';
import * as LyricsActions from '../../actions/lyrics';
import { filterFrequencies } from '../../components/Equalizer/chart';
import { getSelectedStream  } from '../../utils';
import * as Autoradio from './autoradio';
import globals from '../../globals';
import { LastFmApi } from '@nuclear/core';
import { sendPaused } from '../../mpris';

let lastfm = new LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

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
    let seek = update.position;
    let progress = (update.position / update.duration) * 100;
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
    let currentSong = this.props.queue.queueItems[
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
      this.props.queue.currentSong < this.props.queue.queueItems.length - 1 ||
      this.props.settings.loopAfterQueueEnd
    ) {
      this.props.actions.nextSong();
    } else {
      this.props.actions.pausePlayback(sendPaused);
    }
  }

  addAutoradioTrackToQueue () {
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

  getSimilarArtists (artistJson) {
    return new Promise((resolve) => {
      resolve(artistJson.similar.artist);
    });
  }

  getRandomElement (arr) {
    let devianceParameter = 0.2; // We will select one of the 20% most similar artists
    let randomElement =
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
      let streamProviders = this.props.plugins.plugins.streamProviders;
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
    let { player, queue, plugins, equalizer, actions, enableSpectrum } = this.props;
    let streamUrl = '';

    if (queue.queueItems.length > 0) {
      const currentSong = queue.queueItems[queue.currentSong];

      let fallbackStreamProvider;
      if (currentSong.failed) {
        const defaultStreamProvider = plugins.plugins.streamProviders.find(({ sourceName }) => {
          return sourceName === currentSong.selectedStream || plugins.selected.streamProviders;
        });
        fallbackStreamProvider = plugins.plugins.streamProviders.find(({ sourceName }) => {
          return sourceName === defaultStreamProvider.fallback;
        });
      }

      streamUrl = (
        getSelectedStream(
          currentSong.streams,
          currentSong.failed
            ? fallbackStreamProvider.sourceName
            : currentSong.selectedStream || plugins.selected.streamProviders
        ) || {}
      ).stream;
    }
    return !!streamUrl && (
      <Sound
        url={streamUrl}
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
        Actions,
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SoundContainer)
);
