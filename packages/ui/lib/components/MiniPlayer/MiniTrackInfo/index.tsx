import React from 'react';

import styles from './styles.scss';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

export type MiniTrackInfoProps = {
  cover?: string;
  track?: string;
  artist?: string;
  isFavorite?: boolean;
};

const MiniTrackInfo: React.FC<MiniTrackInfoProps> = ({
  cover = artPlaceholder as unknown as string,
  track,
  artist,
  isFavorite
}) => (
    <div className={styles.mini_track_info}>
      <div className={styles.mini_cover}>
        <img src={cover} />
      </div>
    </div>
  );

export default MiniTrackInfo;