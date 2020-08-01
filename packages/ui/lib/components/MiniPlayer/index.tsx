import React from 'react';

import NeumorphicBox from '../NeumorphicBox';
import Seekbar, { SeekbarProps } from '../Seekbar';

import styles from './styles.scss';
import MiniTrackInfo, { MiniTrackInfoProps } from './MiniTrackInfo';
import { PlayerButton } from '../..';
import { PlayerControlsProps } from '../PlayerControls';
import MiniPlayerControls from './MiniPlayerControls';

export type MiniPlayerProps = MiniTrackInfoProps &
  Omit<SeekbarProps, 'children'> &
  PlayerControlsProps & {
    timePlayed?: string;
    timeToEnd?: string;
  };

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  cover,
  track,
  artist,
  isFavorite,

  fill,
  seek,
  queue,

  timePlayed,
  timeToEnd,

  goForward,
  goBack,
  togglePlay,
  goBackDisabled,
  goForwardDisabled,
  playDisabled,
  isPlaying = false,
  isLoading = false
}) => <div className={styles.mini_player}>
    <MiniTrackInfo
      cover={cover}
      track={track}
      artist={artist}
      isFavorite={isFavorite}
    />
    <div className={styles.seekbar_wrapper}>
      <div className={styles.row}>
        <span>{timePlayed}</span>
        <span>{timeToEnd}</span>
      </div>
      <Seekbar
        fill={fill}
        seek={seek}
        queue={queue}
        height='0.5em'
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