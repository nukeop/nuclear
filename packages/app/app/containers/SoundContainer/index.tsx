import React, { ComponentProps, createRef, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sound, { AnalyserByFrequency, Equalizer, Volume } from 'react-hifi';
import { ipcRenderer } from 'electron';
import logger from 'electron-timber';
import { head } from 'lodash';
import { IpcEvents, rest } from '@nuclear/core';
import { post as mastodonPost } from '@nuclear/core/src/rest/Mastodon';

import * as Autoradio from './autoradio';
import VisualizerContainer from '../VisualizerContainer';
import * as PlayerActions from '../../actions/player';
import * as EqualizerActions from '../../actions/equalizer';
import * as QueueActions from '../../actions/queue';
import * as ScrobblingActions from '../../actions/scrobbling';
import * as LyricsActions from '../../actions/lyrics';
import * as VisualizerActions from '../../actions/visualizer';
import { filterFrequencies } from '../../components/Equalizer/chart';
import Normalizer from '../../components/Normalizer';
import HlsPlayer from '../../components/HLSPlayer';
import globals from '../../globals';
import { QueueItem } from '../../reducers/queue';
import { queue as queueSelector } from '../../selectors/queue';
import { playerStateSelector } from '../../selectors/player';
import { scrobblingSelector } from '../../selectors/scrobbling';
import { settingsSelector } from '../../selectors/settings';
import { equalizerSelector } from '../../selectors/equalizer';

export const SoundContainer: FC = () => {
  const soundRef = createRef<Sound>();
  const dispatch = useDispatch();
  const queue = useSelector(queueSelector);
  const player = useSelector(playerStateSelector);
  const scrobbling = useSelector(scrobblingSelector);
  const settings = useSelector(settingsSelector);
  const equalizer = useSelector(equalizerSelector);

  const currentTrack = queue.queueItems[queue.currentSong];
  const currentStream = head(currentTrack?.streams);
  const usedEqualizer = equalizer.enableSpectrum ? equalizer.presets[equalizer.selected] : equalizer.presets.default;

  const handlePlaying = ({position, duration}: {position: number; duration: number;}) => {
    const seek = position;
    const progress = (position / duration) * 100;
    const rate = (player.playbackRate + 2) / 4;
    dispatch(PlayerActions.updatePlaybackProgress(progress, seek));
    dispatch(PlayerActions.updateStreamLoading(false));

    // Needed because this bug was present in the JS code I'm porting to TS. Can be resolved if we fix it in react-hifi
    // @ts-expect-error Property 'audio' is private and only accessible within class 'Sound'.
    const audio = soundRef?.current?.audio;

    if (audio) {
      audio.setAttribute('playbackRate', '');
      audio.playbackRate = rate;
    }
  };

  const handleFinishedPlaying = () => {
    if (settings['visualizer.shuffle']) {
      dispatch(VisualizerActions.randomizePreset());
    }

    // Needed for legacy reasons. Should be removed when the queue item types are straightened out
    // @ts-expect-error Property 'title' does not exist on type 'QueueItem'.ts(2339)
    const currentTrackTitle = currentTrack.title ?? currentTrack.name;

    if (
      scrobbling.lastFmScrobblingEnabled &&
      scrobbling.lastFmSessionKey
    ) {
      dispatch(ScrobblingActions.scrobbleAction(
        currentTrack.artists[0],
        currentTrackTitle,
        scrobbling.lastFmSessionKey
      ));
    }
    
    if (settings.listeningHistory) {
      ipcRenderer.send(IpcEvents.POST_LISTENING_HISTORY_ENTRY, {
        artist: currentTrack.artists?.[0],
        title: currentTrackTitle
      });
    }

    if (
      settings.shuffleQueue ||
      queue.currentSong < queue.queueItems.length - 1 ||
      settings.loopAfterQueueEnd
    ) {
      dispatch(QueueActions.nextSong());
    } else {
      dispatch(PlayerActions.pausePlayback(false));
    }

    if (settings.mastodonAccessToken &&
      settings.mastodonInstance) {
      const selectedStreamUrl = currentStream?.originalUrl || '';
      let content = settings.mastodonPostFormat + '';
      content = content.replaceAll('{{artist}}', currentTrack.artists[0]);
      content = content.replaceAll('{{title}}', currentTrack.name);
      content = content.replaceAll('{{url}}', selectedStreamUrl);
      mastodonPost(
        settings.mastodonInstance,
        settings.mastodonAccessToken,
        content
      );
    }
  };

  const handleLoading = () => {
    dispatch(PlayerActions.updateStreamLoading(true));
  };

  const handleLoaded = () => {
    handleLoadLyrics();
    handleAutoRadio();
    dispatch(PlayerActions.updateStreamLoading(false));
  };

  const handleLoadLyrics = () => {
    dispatch(LyricsActions.lyricsSearch(currentTrack));
  };

  const handleAutoRadio = () => {
    if (
      settings.autoradio &&
      queue.currentSong === queue.queueItems.length - 1
    ) {
      Autoradio.addAutoradioTrackToQueue({ queue, settings, addToQueue: (item: QueueItem) => dispatch(QueueActions.addToQueue(item)) });
    }
  };

  const handleError = (err: Error) => {
    logger.error(err.message);
    dispatch(QueueActions.removeFromQueue(queue.currentSong));
  };
  const isHlsStream = (url: string) => {
    return /http.*?\.m3u8/g.test(url);
  };

  return (
    Boolean(currentStream) && (isHlsStream(currentStream.stream) ? (
      <HlsPlayer
        source={currentStream.stream}
        onError={handleError}
        playStatus={player.playbackStatus as ComponentProps<typeof Sound>['playStatus']}
        onFinishedPlaying={handleFinishedPlaying}
        muted={player.muted}
        volume={player.volume}
      /> 
    ) : (
      <Sound
        url={currentStream.stream}
        playStatus={player.playbackStatus as ComponentProps<typeof Sound>['playStatus']}
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
        < Equalizer
          data={
            filterFrequencies.reduce((acc, freq, idx) => ({
              ...acc,
              [freq]: usedEqualizer.values[idx] || 0
            }), {})
          }
          preAmp={usedEqualizer.preAmp}
        />
        <AnalyserByFrequency
          frequencies={filterFrequencies}
          onVisualisationData={equalizer.enableSpectrum && ((data) => EqualizerActions.setSpectrum(data))
          }
        />
        <VisualizerContainer
          trackName={currentTrack? `${currentTrack.artists?.[0]} - ${currentTrack.name}` : undefined}
        />
      </Sound>
    ))
  );
};


