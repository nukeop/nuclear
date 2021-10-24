import React from 'react';


import styles from './styles.scss';
import Seekbar, { SeekbarProps } from '../Seekbar';
import MiniTrackInfo, { MiniTrackInfoProps } from './MiniTrackInfo';
import MiniPlayerControls from './MiniPlayerControls';
import MiniPlayOptions, { MiniPlayOptionsProps } from './MiniPlayOptions';
import { PlayerControlsProps } from '../PlayerControls';
import { formatDuration } from '../../utils';

export type MiniPlayerProps = Omit<SeekbarProps, 'children'> &
  PlayerControlsProps &
  MiniTrackInfoProps &
  MiniPlayOptionsProps & {
    timePlayed?: any;
    timeToEnd?: any;
    style?: React.HTMLAttributes<HTMLDivElement>['style'];
  };

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  cover,
  track,
  artist,

  addToFavorites,
  removeFromFavorites,
  isFavorite,

  playOptions,
  onDisableMiniPlayer,

  fill,
  seek,
  queue,

  timePlayed,
  timeToEnd,
  skipSegments,
  allowSkipSegment,
  segmentPopupMessage,

  goForward,
  goBack,
  togglePlay,
  goBackDisabled,
  goForwardDisabled,
  playDisabled,
  isPlaying = false,
  isLoading = false,
  hasTracks = false,

  style
}) => <div className={styles.mini_player} style={style}>
  <MiniPlayOptions
    playOptions={playOptions}
    onDisableMiniPlayer={onDisableMiniPlayer}
  />
  <MiniTrackInfo
    cover={cover}
    track={track}
    artist={artist}
    isFavorite={isFavorite}
    addToFavorites={addToFavorites}
    removeFromFavorites={removeFromFavorites}
    hasTracks={hasTracks}
  />
  <div className={styles.seekbar_wrapper}>
    <div className={styles.row}>
      <span>{formatDuration(timePlayed)}</span>
      <span>-{formatDuration(timeToEnd)}</span>
    </div>
    <Seekbar
      fill={fill}
      seek={seek}
      queue={queue}
      height='0.5em'
      timePlayed={timePlayed}
      skipSegments={skipSegments}
      allowSkipSegment={allowSkipSegment}
      segmentPopupMessage={segmentPopupMessage}
    />
  </div>
  <MiniPlayerControls
    goForward={goForward}
    goBack={goBack}
    togglePlay={togglePlay}
    isPlaying={isPlaying}
    isLoading={isLoading}
    goBackDisabled={goBackDisabled}
    goForwardDisabled={goForwardDisabled}
    playDisabled={playDisabled}
  />
</div>;

export default MiniPlayer;
