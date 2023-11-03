import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Tooltip } from '@nuclear/ui';

import Cover from '../Cover';
import styles from './styles.scss';

const CopyTextToClipboard = async (track) => {
  try {
    await navigator.clipboard.writeText(track);
  } catch (err) {
    // alert("Failed to copy"); // Will add notification toast here
  }
};

export type TrackInfoProps = {
  cover?: string;
  track: string;
  artist: string;
  onTrackClick: () => void;
  onArtistClick: () => void;
  addToFavorites: () => void;
  removeFromFavorites: () => void;
  isFavorite?: boolean;
  hasTracks?: boolean;
};

const TrackInfo: React.FC<TrackInfoProps> = ({
  cover,
  track,
  artist,
  onTrackClick,
  onArtistClick,
  addToFavorites,
  removeFromFavorites,
  isFavorite = false,
  hasTracks = false
}) => (
  <div className={styles.track_info}>
    <Cover cover={cover} />
    {
      hasTracks &&
        <>
          <div className={styles.artist_part}>
            <Tooltip
              content='Click to copy'
              trigger={
                <div id='track_name' className={styles.track_name} onClick={() => CopyTextToClipboard(track)}>
                  {track}
                </div>
              }
            />
            <div className={styles.artist_name} onClick={onArtistClick}>
              {artist}
            </div>
          </div>
          <div className={styles.favorite_part}>
            <Icon name={isFavorite ? 'heart' : 'heart outline'}
              size='large'
              onClick={
                isFavorite
                  ? removeFromFavorites
                  : addToFavorites
              }
            />
          </div>
        </>
    }
  </div>
);

export default TrackInfo;
