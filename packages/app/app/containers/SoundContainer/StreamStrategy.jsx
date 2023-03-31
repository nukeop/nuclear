import { filterFrequencies } from '../../components/Equalizer/chart';
import { StreamFormats } from '@nuclear/core/src/plugins/plugins.types';
import HlsPlayer from '../../components/HLSPlayer';
import Sound, { Volume, Equalizer, AnalyserByFrequency } from 'react-hifi';
import Normalizer from '../../components/Normalizer';
import VisualizerContainer from '../VisualizerContainer';
import React from 'react';

const StreamStrategy = ({
  currentStream,
  player,
  settings,
  currentTrack,
  methods,
  streamType,
  actions,
  enableSpectrum,
  location,
  usedEqualizer
}) => {
  const {
    handleError,
    handleFinishedPlaying,
    handlePlaying,
    handleLoaded,
    handleLoading
  } = methods;

  const { HLS, NONHLS } = StreamFormats;

  const HLSPlayer = (
    <HlsPlayer
      source={currentStream?.stream}
      onError={handleError}
      playStatus={player.playbackStatus}
      onFinishedPlaying={handleFinishedPlaying}
      muted={player.muted}
      volume={player.volume}
    />
  );

  const NonHLSPlayer = (
    <Sound
      url={currentStream?.stream}
      playStatus={player.playbackStatus}
      onPlaying={handlePlaying}
      onFinishedPlaying={handleFinishedPlaying}
      onLoading={handleLoading}
      onLoad={handleLoaded}
      position={player.seek}
      onError={handleError}
    >
      <Normalizer url={currentStream?.stream} normalize={settings.normalize} />
      <Volume value={player.muted ? 0 : player.volume} />
      <Equalizer
        data={filterFrequencies.reduce(
          (acc, freq, idx) => ({
            ...acc,
            [freq]: usedEqualizer.values[idx] || 0
          }),
          {}
        )}
        preAmp={usedEqualizer.preAmp}
      />
      <AnalyserByFrequency
        frequencies={filterFrequencies}
        onVisualisationData={enableSpectrum && actions.setSpectrum}
      />
      <VisualizerContainer
        location={location}
        trackName={
          currentTrack
            ? `${currentTrack.artist} - ${currentTrack.name}`
            : undefined
        }
      />
    </Sound>
  );

  switch (streamType) {
  case HLS:
    return HLSPlayer;
  case NONHLS:
    return NonHLSPlayer;
  default:
    return NonHLSPlayer;
  }
};

export default StreamStrategy;
