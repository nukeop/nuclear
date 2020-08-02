import React from 'react';
import { Icon } from 'semantic-ui-react';

import styles from './styles.scss';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

import { TrackInfoProps } from '../../TrackInfo';

export type MiniTrackInfoProps = Pick<TrackInfoProps, 'cover' | 'track' | 'artist' | 'isFavorite' | 'addToFavorites' | 'removeFromFavorites'>;

const MiniTrackInfo: React.FC<MiniTrackInfoProps> = ({
  cover = artPlaceholder as unknown as string,
  track,
  artist,
  isFavorite,
  addToFavorites,
  removeFromFavorites
}) => (
    <div className={styles.mini_track_info}>
      <div className={styles.mini_cover}>
        <img src={cover} />
      </div>
      <div className={styles.mini_track_info_text}>
        <div className={styles.left}>
          <div className={styles.mini_track}>{track}</div>
          <div className={styles.mini_artist}>{artist}</div>
        </div>
        <div className={styles.right}>
          <Icon
            name={
              isFavorite ? 'heart' : 'heart outline'
            }
            size='large'
            onClick={
              isFavorite
                ? removeFromFavorites
                : addToFavorites
            }
          />
        </div>
      </div>
    </div>
  );

export default MiniTrackInfo;