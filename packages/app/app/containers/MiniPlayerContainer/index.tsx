import React from 'react';
import { MiniPlayer } from '@nuclear/ui';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import LyricsView from '../../components/LyricsView';
import { lyricsSelectors } from '../../selectors/lyrics';
import { queue as queueSelector } from '../../selectors/queue';

import {
  usePlayerControlsProps,
  useSeekbarProps,
  useTrackInfoProps,
  useVolumeControlsProps
} from '../PlayerBarContainer/hooks';
import { useMiniPlayerSettings } from './hooks';

const MiniPlayerContainer: React.FC = () => {

  const lyricsSearchResults = useSelector(lyricsSelectors.lyricsSearchResults);
  const queue = useSelector(queueSelector);
  const track = _.get(
    queue.queueItems,
    queue.currentSong
  );
  // eslint-disable-next-line no-console
  console.log(track?.name);

  const seekbarProps = useSeekbarProps();
  const playerControlsProps = usePlayerControlsProps();
  const trackInfoProps = useTrackInfoProps();
  const volumeControlsProps = useVolumeControlsProps();

  const {
    isMiniPlayerEnabled,
    toggleMiniPlayer
  } = useMiniPlayerSettings();

  return isMiniPlayerEnabled
    ? (
      <MiniPlayer
        {...seekbarProps}
        {...playerControlsProps}
        {...trackInfoProps}
        {...volumeControlsProps}
        onDisableMiniPlayer={toggleMiniPlayer}
        style={{
          zIndex: isMiniPlayerEnabled && 1000
        }}
        lyricsComponent={
          <LyricsView
            trackName={track?.name}
            trackArtist={track?.artist}
            lyricsSearchResults={lyricsSearchResults as { type: string }}
          />
        }
      />
    )
    : null;
};

export default MiniPlayerContainer;
