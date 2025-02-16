import React from 'react';
import { Icon } from 'semantic-ui-react';

import styles from './styles.scss';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import Img from 'react-image';

import { TrackInfoProps } from '../../TrackInfo';

export type MiniTrackInfoProps = Omit<TrackInfoProps, 'onTrackClick' | 'onArtistClick'>;

const MiniTrackInfo: React.FC<MiniTrackInfoProps> = ({
  cover = artPlaceholder as unknown as string,
  track,
  artist,
  addToFavorites,
  removeFromFavorites,
  isFavorite = false,
  hasTracks = false
}) => (
  <div className={styles.mini_track_info}>
    <div className={styles.mini_cover}>
      <Img
        src={cover}
        unloader={<img src={artPlaceholder} />}
      />
    </div>
    {
      hasTracks &&
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
    }
  </div>
);

export default MiniTrackInfo;
