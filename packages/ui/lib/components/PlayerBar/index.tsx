import React from 'react';
import cx from 'classnames';

import Seekbar, { SeekbarProps } from '../Seekbar';
import PlayerControls, { PlayerControlsProps } from '../PlayerControls';
import TrackInfo, { TrackInfoProps } from '../TrackInfo';
import VolumeControls, { VolumeControlsProps } from '../VolumeControls';
import VolumePopUp, { VolumePopUpProps } from './VolumePopUp';

import common from '../../common.scss';
import styles from './styles.scss';
import { formatDuration } from '../../utils';
import useWindowSize from '../../hooks/useWindowSize';

export type PlayerBarProps = PlayerControlsProps &
  Omit<SeekbarProps, 'children'> &
  TrackInfoProps &
  VolumeControlsProps &
  VolumePopUpProps & {
    renderTrackDuration?: boolean;
    timePlayed?: number;
    timeToEnd?: number;
  };

const VOLUME_POPUP_BREAKPOINT = 570;

let livestream = false;

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
  skipSegments,
  allowSkipSegment,
  segmentPopupMessage
}) => {
  const { width: windowWidth } = useWindowSize();
  const livestreamCheck = timeToEnd;
  // fixes small bug where seekbar will progress before song is fully loaded
  if (isNaN(livestreamCheck)) {
    livestream = true;
  }
  if (typeof timeToEnd === 'string') {
    livestream = true;
    fill = 100;
  } else {
    livestream = false;
  }
  return (
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
        allowSkipSegment={allowSkipSegment}
        segmentPopupMessage={segmentPopupMessage}
      >
        {hasTracks &&
          renderTrackDuration &&
          <div className={styles.track_duration}>
            <div>{livestream ? timePlayed : formatDuration(timePlayed)}</div>
            <div>{livestream ? timeToEnd : '-'+formatDuration(timeToEnd)}</div>
          </div>}
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
          hasTracks={hasTracks} />
        <PlayerControls
          goForward={goForward}
          goBack={goBack}
          togglePlay={togglePlay}
          isPlaying={isPlaying}
          isLoading={isLoading}
          goBackDisabled={goBackDisabled}
          goForwardDisabled={goForwardDisabled}
          playDisabled={playDisabled} />
        {windowWidth < VOLUME_POPUP_BREAKPOINT &&
          <VolumePopUp
            volume={volume}
            updateVolume={updateVolume}
            toggleMute={toggleMute}
            isMuted={isMuted}
            playOptions={playOptions} />}
        {windowWidth > VOLUME_POPUP_BREAKPOINT &&
          <VolumeControls
            volume={volume}
            updateVolume={updateVolume}
            toggleMute={toggleMute}
            isMuted={isMuted}
            playOptions={playOptions} />}
      </div>
    </div>
  );
};

export default PlayerBar;
