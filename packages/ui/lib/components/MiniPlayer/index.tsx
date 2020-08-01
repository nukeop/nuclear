import React from 'react';

import NeumorphicBox from '../NeumorphicBox';
import Seekbar, { SeekbarProps } from '../Seekbar';

import styles from './styles.scss';
import MiniTrackInfo, { MiniTrackInfoProps } from './MiniTrackInfo';
import { Icon } from 'semantic-ui-react';

export type MiniPlayerProps = MiniTrackInfoProps &
  Omit<SeekbarProps, 'children'> & {
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
      />
    </div>
    <NeumorphicBox>
      <Icon name='play' />
    </NeumorphicBox>
  </div>;

export default MiniPlayer;