import React from 'react';
import cx from 'classnames';

import Seekbar, { SeekbarProps } from '../Seekbar';
import PlayerControls, { PlayerControlsProps } from '../PlayerControls';
import TrackInfo, { TrackInfoProps } from '../TrackInfo';
import VolumeControls, { VolumeControlsProps } from '../VolumeControls';

import common from '../../common.scss';
import styles from './styles.scss';
import { formatDuration } from '../../utils';

export type PlayerBarProps = PlayerControlsProps &
  Omit<SeekbarProps, 'children'> &
  TrackInfoProps &
  VolumeControlsProps & {
    renderTrackDuration?: boolean;
    timePlayed?: number;
    timeToEnd?: number;
  };

const PlayerBar: React.FC<PlayerBarProps> = ({
  cover,
  track,
  artist,
  onTrackClick,
  onArtistClick,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  hasTracks,

  volume,
  updateVolume,
  toggleMute,
  isMuted,
  playOptions,

  goForward,
  goBack,
  togglePlay,
  goBackDisabled,
  goForwardDisabled,
  playDisabled,
  isPlaying = false,
  isLoading = false,

  queue,
  fill = 0,
  renderTrackDuration = false,
  timePlayed,
  timeToEnd,
  seek,
  skipSegments
}) => (
  <div className={cx(
    common.nuclear,
    styles.player_bar
  )}>
    <Seekbar
      fill={fill}
      seek={seek}
      queue={queue}
      timePlayed={timePlayed}
      skipSegments={skipSegments}
    >
      {
        hasTracks &&
          renderTrackDuration &&
          <div className={styles.track_duration}>
            <div>{formatDuration(timePlayed)}</div>
            <div>-{formatDuration(timeToEnd)}</div>
          </div>
      }
    </Seekbar>
    <div className={styles.player_bar_bottom}>
      <TrackInfo
        cover={cover}
        track={track}
        artist={artist}
        onTrackClick={onTrackClick}
        onArtistClick={onArtistClick}
        addToFavorites={addToFavorites}
        removeFromFavorites={removeFromFavorites}
        isFavorite={isFavorite}
        hasTracks={hasTracks}
      />
      <PlayerControls
        goForward={goForward}
        goBack={goBack}
        togglePlay={togglePlay}
        isPlaying={isPlaying}
        isLoading={isLoading}
        goBackDisabled={goBackDisabled}
        goForwardDisabled={goForwardDisabled}
        playDisabled={playDisabled}
      />
      <VolumeControls
        volume={volume}
        updateVolume={updateVolume}
        toggleMute={toggleMute}
        isMuted={isMuted}
        playOptions={playOptions}
      />
    </div>
  </div>
);

export default PlayerBar;
