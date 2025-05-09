import React, { useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Sound, { Volume, Equalizer, AnalyserByFrequency } from 'react-hifi';
import { logger } from '@nuclear/core';
import { head } from 'lodash';
import { IpcEvents, rest } from '@nuclear/core';
import { post as mastodonPost } from '@nuclear/core/src/rest/Mastodon';

import * as SearchActions from '../../actions/search';
import * as PlayerActions from '../../actions/player';
import * as EqualizerActions from '../../actions/equalizer';
import * as QueueActions from '../../actions/queue';
import * as ScrobblingActions from '../../actions/scrobbling';
import * as LyricsActions from '../../actions/lyrics';
import * as VisualizerActions from '../../actions/visualizer';
import { filterFrequencies } from '../../components/Equalizer/chart';
import * as Autoradio from './autoradio';
import VisualizerContainer from '../../containers/VisualizerContainer';
import Normalizer from '../../components/Normalizer';
import globals from '../../globals';
import HlsPlayer from '../../components/HLSPlayer';
import { ipcRenderer } from 'electron';

const lastfm = new rest.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

const SoundContainer = (props) => {
  const soundRef = useRef(null);
  const location = useLocation();

  const { actions, queue, player, settings, scrobbling, equalizer, defaultEqualizer, enableSpectrum } = props;

  const currentTrack = useMemo(() => {
    return queue.queueItems[queue.currentTrack];
  }, [queue.queueItems, queue.currentTrack]);

  const currentStream = useMemo(() => {
    return head(currentTrack?.streams);
  }, [currentTrack]);

  const handleLoadLyrics = useCallback(() => {
    if (currentTrack && typeof currentTrack.lyrics === 'undefined') {
      actions.lyricsSearch(currentTrack);
    }
  }, [actions, currentTrack]);

  const handleAutoRadio = useCallback(() => {
    if (
      settings.autoradio &&
      queue.currentTrack === queue.queueItems.length - 1
    ) {
      Autoradio.addAutoradioTrackToQueue(props);
    }
  }, [settings.autoradio, queue.currentTrack, queue.queueItems.length, props]);

  const handlePlaying = useCallback((update) => {
    const seek = update.position;
    const progress = (update.position / update.duration) * 100;
    const rate = (player.playbackRate + 2) / 4;
    actions.updatePlaybackProgress(progress, seek);
    actions.updateStreamLoading(false);

    if (soundRef.current?.audio) {
      soundRef.current.audio.setAttribute('playbackRate', '');
      soundRef.current.audio.playbackRate = rate;
    }
  }, [actions, player.playbackRate]);

  const handleLoading = useCallback(() => {
    actions.updateStreamLoading(true);
  }, [actions]);

  const handleLoaded = useCallback(() => {
    handleLoadLyrics();
    handleAutoRadio();
    actions.updateStreamLoading(false);
  }, [actions, handleLoadLyrics, handleAutoRadio]);

  const handleFinishedPlaying = useCallback(() => {
    if (settings['visualizer.shuffle']) {
      actions.randomizePreset();
    }

    if (
      scrobbling.lastFmScrobblingEnabled &&
      scrobbling.lastFmSessionKey &&
      currentTrack
    ) {
      actions.scrobbleAction(
        currentTrack.artist,
        currentTrack.title ?? currentTrack.name,
        scrobbling.lastFmSessionKey
      );
    }

    if (settings.listeningHistory && currentTrack) {
      ipcRenderer.send(IpcEvents.POST_LISTENING_HISTORY_ENTRY, {
        artist: currentTrack.artist,
        title: currentTrack.title ?? currentTrack.name
      });
    }

    if (
      settings.shuffleQueue ||
      queue.currentTrack < queue.queueItems.length - 1 ||
      settings.loopAfterQueueEnd
    ) {
      actions.nextSong();
    } else {
      actions.pausePlayback(false);
    }

    if (settings.mastodonAccessToken &&
      settings.mastodonInstance &&
      currentTrack) {
      const selectedStreamUrl = currentStream?.originalUrl || '';
      let content = settings.mastodonPostFormat + '';
      content = content.replaceAll('{{artist}}', currentTrack.artist);
      content = content.replaceAll('{{title}}', currentTrack.name);
      content = content.replaceAll('{{url}}', selectedStreamUrl);
      mastodonPost(
        settings.mastodonInstance,
        settings.mastodonAccessToken,
        content
      );
    }
  }, [actions, settings, scrobbling, queue, currentTrack, currentStream]);

  const getSimilarArtists = useCallback((artistJson) => {
    return Promise.resolve(artistJson.similar.artist);
  }, []);

  const getRandomElement = useCallback((arr) => {
    const devianceParameter = 0.2;
    const randomElement =
      arr[Math.round(Math.random() * (devianceParameter * (arr.length - 1)))];
    return Promise.resolve(randomElement);
  }, []);

  const getArtistTopTracks = useCallback((artist) => {
    return lastfm
      .getArtistTopTracks(artist.name)
      .then(topTracks => topTracks.json());
  }, []);

  const addToQueue = useCallback((artist, track) => {
    return new Promise((resolve) => {
      actions.addToQueue({
        artist: artist.name,
        name: track.name,
        thumbnail: track.thumbnail ?? track.image?.[0]?.['#text'] ?? track.thumb
      });
      resolve(true);
    });
  }, [actions]);

  const addAutoradioTrackToQueue = useCallback(() => {
    if (!currentTrack) {
      return Promise.resolve(false);
    }
    return lastfm
      .getArtistInfo(currentTrack.artist)
      .then(artist => artist.json())
      .then(artistJson => getSimilarArtists(artistJson.artist))
      .then(similarArtists => getRandomElement(similarArtists))
      .then(selectedArtist => getArtistTopTracks(selectedArtist))
      .then(topTracks => getRandomElement(topTracks.toptracks.track))
      .then(track => {
        return addToQueue(track.artist, track);
      });
  }, [currentTrack, getSimilarArtists, getRandomElement, getArtistTopTracks, addToQueue, actions]);

  const handleError = useCallback((err) => {
    logger.error(err.message);
    if (currentTrack) {
      actions.removeFirstStream(currentTrack, queue.currentTrack);
    }
  }, [actions, currentTrack, queue.currentTrack]);

  const isHlsStream = useCallback((url) => {
    return /http.*?\.m3u8/g.test(url);
  }, []);

  const usedEqualizer = enableSpectrum ? equalizer : defaultEqualizer;

  return Boolean(currentStream) && (isHlsStream(currentStream.stream) ? (
    <HlsPlayer
      source={currentStream.stream}
      onError={handleError}
      playStatus={player.playbackStatus}
      onFinishedPlaying={handleFinishedPlaying}
      muted={player.muted}
      volume={player.volume}
    />
  ) : (
    <Sound
      url={currentStream.stream}
      playStatus={player.playbackStatus}
      onPlaying={handlePlaying}
      onFinishedPlaying={handleFinishedPlaying}
      onLoading={handleLoading}
      onLoad={handleLoaded}
      position={player.seek}
      onError={handleError}
      ref={soundRef}
    >
      <Normalizer
        url={currentStream.stream}
        normalize={settings.normalize}
      />
      <Volume value={player.muted ? 0 : player.volume} />
      <Equalizer
        data={filterFrequencies.reduce((acc, freq, idx) => ({
          ...acc,
          [freq]: usedEqualizer.values[idx] || 0
        }), {})}
        preAmp={usedEqualizer.preAmp}
      />
      <AnalyserByFrequency
        frequencies={filterFrequencies}
        onVisualisationData={enableSpectrum && actions.setSpectrum}
      />
      <VisualizerContainer
        location={location}
        trackName={currentTrack ? `${currentTrack.artist} - ${currentTrack.name}` : undefined}
      />
    </Sound>
  ));
};

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
        EqualizerActions,
        VisualizerActions
      ),
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SoundContainer);
