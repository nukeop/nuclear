import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Tooltip } from '@nuclear/ui';
import * as ActionToast from '../../../../app/app/actions/toasts'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next';

import Cover from '../Cover';
import styles from './styles.scss';

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
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('track-popup');

  const CopyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(track);
      dispatch(ActionToast.
        success(t('track-toast-clipboard-success-title'),
          t('track-toast-clipboard-success-subtitle'),
          null,
          {}
        )
      );
    } catch (err) {
      dispatch(ActionToast.
        error(t('track-toast-clipboard-error-title'),
          t('track-toast-clipboard-error-subtitle'),
          null,
          {}
        )
      );
    }
  };

  return (
    <div className={styles.track_info}>
      <Cover cover={cover} />
      {
        hasTracks &&
        <>
          <div className={styles.artist_part}>
            <Tooltip
              content='Click to copy'
              trigger={
                <div data-testid='track_name' id='track_name' className={styles.track_name} onClick={() => CopyTextToClipboard()}>
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
}

export default TrackInfo;
