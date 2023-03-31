import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withProps } from 'recompose';
import logger from 'electron-timber';
import { head } from 'lodash';
import { IpcEvents, rest } from '@nuclear/core';
import { post as mastodonPost } from '@nuclear/core/src/rest/Mastodon';
import * as SearchActions from '../../actions/search';
import * as PlayerActions from '../../actions/player';
import * as EqualizerActions from '../../actions/equalizer';
import * as QueueActions from '../../actions/queue';
import * as ScrobblingActions from '../../actions/scrobbling';
import * as LyricsActions from '../../actions/lyrics';
import * as Autoradio from './autoradio';
import globals from '../../globals';
import { ipcRenderer } from 'electron';
import StreamStrategy from './StreamStrategy';

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

  handlePlaying(update) {
    const seek = update.position;
    const progress = (update.position / update.duration) * 100;
    this.props.actions.updatePlaybackProgress(progress, seek);
    this.props.actions.updateStreamLoading(false);
  }

  handleLoading() {
    this.props.actions.updateStreamLoading(true);
  }

  handleLoaded() {
    this.handleLoadLyrics();
    this.handleAutoRadio();
    this.props.actions.updateStreamLoading(false);
  }

  handleLoadLyrics() {
    const currentSong = this.props.queue.queueItems[
      this.props.queue.currentSong
    ];

    if (typeof currentSong.lyrics === 'undefined') {
      this.props.actions.lyricsSearch(currentSong);
    }
  }

  handleAutoRadio() {
    if (
      this.props.settings.autoradio &&
      this.props.queue.currentSong === this.props.queue.queueItems.length - 1
    ) {
      Autoradio.addAutoradioTrackToQueue(this.props);
    }
  }

  handleFinishedPlaying() {
    const currentSong = this.props.queue.queueItems[
      this.props.queue.currentSong
    ];
    if (
      this.props.scrobbling.lastFmScrobblingEnabled &&
      this.props.scrobbling.lastFmSessionKey
    ) {
      this.props.actions.scrobbleAction(
        currentSong.artist,
        currentSong.title ?? currentSong.name,
        this.props.scrobbling.lastFmSessionKey
      );
    }

    if (this.props.settings.listeningHistory) {
      ipcRenderer.send(IpcEvents.POST_LISTENING_HISTORY_ENTRY, {
        artist: currentSong.artist,
        title: currentSong.title ?? currentSong.name
      });
    }

    if (
      this.props.settings.shuffleQueue ||
      this.props.queue.currentSong < this.props.queue.queueItems.length - 1 ||
      this.props.settings.loopAfterQueueEnd
    ) {
      this.props.actions.nextSong();
    } else {
      this.props.actions.pausePlayback(false);
    }

    if (this.props.settings.mastodonAccessToken &&
      this.props.settings.mastodonInstance) {
      const selectedStreamUrl = this.props.currentStream?.originalUrl || '';
      let content = this.props.settings.mastodonPostFormat + '';
      content = content.replaceAll('{{artist}}', currentSong.artist);
      content = content.replaceAll('{{title}}', currentSong.name);
      content = content.replaceAll('{{url}}', selectedStreamUrl);
      mastodonPost(
        this.props.settings.mastodonInstance,
        this.props.settings.mastodonAccessToken,
        content
      );
    }
  }

  async addAutoradioTrackToQueue() {
    const currentSong = this.props.queue.queueItems[this.props.queue.currentSong];
    const artist_1 = await lastfm
      .getArtistInfo(currentSong.artist);
    const artistJson = await artist_1.json();
    const similarArtists = await this.getSimilarArtists(artistJson.artist);
    const selectedArtist = await this.getRandomElement(similarArtists);
    const topTracks = await this.getArtistTopTracks(selectedArtist);
    const track = await this.getRandomElement(topTracks.toptracks.track);
    return await this.addToQueue(track.artist, track);
  }

  getSimilarArtists(artistJson) {
    return new Promise((resolve) => {
      resolve(artistJson.similar.artist);
    });
  }

  getRandomElement(arr) {
    const devianceParameter = 0.2; // We will select one of the 20% most similar artists
    const randomElement =
      arr[Math.round(Math.random() * (devianceParameter * (arr.length - 1)))];
    return new Promise((resolve) => resolve(randomElement));
  }

  getArtistTopTracks(artist) {
    return lastfm
      .getArtistTopTracks(artist.name)
      .then(topTracks => topTracks.json());
  }

  addToQueue(artist, track) {
    return new Promise((resolve) => {
      this.props.actions.addToQueue({
        artist: artist.name,
        name: track.name,
        thumbnail: track.thumbnail || track.image[0]['#text']
      });
      resolve(true);
    });
  }

  handleError(err) {
    logger.error(err.message);
    const { queue } = this.props;
    const currentTrack = queue.queueItems[queue.currentSong];
    this.props.actions.rerollTrack(currentTrack);
  }

  shouldComponentUpdate(nextProps) {
    const currentSong = nextProps.queue.queueItems[nextProps.queue.currentSong];

    return (
      this.props.equalizer !== nextProps.equalizer ||
      this.props.queue.currentSong !== nextProps.queue.currentSong ||
      this.props.player.playbackStatus !== nextProps.player.playbackStatus ||
      this.props.player.seek !== nextProps.player.seek ||
      (Boolean(currentSong) && Boolean(currentSong.streams))
    );
  }

  render() {
    const { queue, player, equalizer, actions, enableSpectrum, currentStream, location, defaultEqualizer } = this.props;
    const currentTrack = queue.queueItems[queue.currentSong];
    const usedEqualizer = enableSpectrum ? equalizer : defaultEqualizer;
    return (
      <StreamStrategy
        streamType={currentStream?.streamFormat}
        player={player}
        usedEqualizer={usedEqualizer}
        currentTrack={currentTrack}
        actions={actions}
        location={location}
        currentStream={currentStream}
        settings={this.props.settings}
        methods={{
          handleError: this.handleError,
          handlePlaying: this.handlePlaying,
          handleFinishedPlaying: this.handleFinishedPlaying,
          handleLoaded: this.handleLoaded,
          handleLoading: this.handleLoading
        }}
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
    equalizer: state.equalizer.presets[state.equalizer.selected],
    defaultEqualizer: state.equalizer.presets.default,
    enableSpectrum: state.equalizer.enableSpectrum
  };
}

function mapDispatchToProps(dispatch) {
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
  withProps(({ currentTrack }) => ({
    currentStream: head(currentTrack?.streams)
  }))
)(SoundContainer);
