import React, { FC } from 'react';
import { take } from 'lodash';
import { useTranslation } from 'react-i18next';

import { SearchResultsTrack } from '@nuclear/core/src/plugins/plugins.types';
import {
  HEADER_HEIGHT,
  ITEM_HEIGHT
} from '@nuclear/ui/lib/components/GridTrackTable';
import TrackTableContainer from '../../../containers/TrackTableContainer';
import styles from './styles.scss';

type TracksResultsProps = {
  tracks: SearchResultsTrack[];
  limit?: number;
};

export const TracksResults: FC<TracksResultsProps> = ({ tracks, limit }) => {
  const { t } = useTranslation('search');
  const collection = tracks || [];

  const height = `${HEADER_HEIGHT + ITEM_HEIGHT * Math.min(collection.length, 5)}px`;

  if (collection.length === 0) {
    return <div>{t('empty')}</div>;
  } else {
    return (
      <div className={styles.tracks_results_container} style={{ height }}>
        <TrackTableContainer
          tracks={take(collection, limit)}
          displayDeleteButton={false}
          displayAlbum={false}
          displayPosition={false}
        />
      </div>
    );
  }
};
