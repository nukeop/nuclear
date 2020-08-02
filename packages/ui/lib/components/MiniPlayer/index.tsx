import React from 'react';


import styles from './styles.scss';
import Seekbar, { SeekbarProps } from '../Seekbar';
import MiniTrackInfo from './MiniTrackInfo';
import MiniPlayerControls from './MiniPlayerControls';
import MiniPlayOptions from './MiniPlayOptions';
import { PlayerControlsProps } from '../PlayerControls';
import { TrackInfoProps } from '../TrackInfo';
import { VolumeControlsProps } from '../VolumeControls';

export type MiniPlayerProps = Omit<SeekbarProps, 'children'> &
  PlayerControlsProps &
  Pick<TrackInfoProps, 'cover' | 'track' | 'artist' | 'isFavorite' | 'addToFavorites' | 'removeFromFavorites'> &
  Pick<VolumeControlsProps, 'playOptions'> & {
    timePlayed?: string;
    timeToEnd?: string;
  };

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  cover,
  track,
  artist,

  addToFavorites,
  removeFromFavorites,
  isFavorite,

  playOptions,

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
    <MiniPlayOptions
      playOptions={playOptions}
    />
    <MiniTrackInfo
      cover={cover}
      track={track}
      artist={artist}
      isFavorite={isFavorite}
      addToFavorites={addToFavorites}
      removeFromFavorites={removeFromFavorites}
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