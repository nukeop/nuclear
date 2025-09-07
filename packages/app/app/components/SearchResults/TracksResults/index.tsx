import React, { FC } from 'react';
import { take } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Tab } from 'semantic-ui-react';

import { SearchResultsTrack } from '@nuclear/core/src/plugins/plugins.types';
import {
  HEADER_HEIGHT,
  ITEM_HEIGHT
} from '@nuclear/ui/lib/components/GridTrackTable';
import TrackTableContainer from '../../../containers/TrackTableContainer';
import styles from './styles.scss';
import parentStyles from '../styles.scss';

type TracksResultsProps = {
  tracks: SearchResultsTrack[];
  limit?: number;
  loading?: boolean;
  attached?: boolean;
  asPane?: boolean;
};

export const TracksResults: FC<TracksResultsProps> = ({ 
  tracks, 
  limit,
  loading = false,
  attached = false,
  asPane = false
}) => {
  const { t } = useTranslation('search');
  const collection = tracks || [];

  const height = `${HEADER_HEIGHT + ITEM_HEIGHT * Math.min(collection.length, 5)}px`;

  const content = () => {
    if (collection.length === 0) {
      return <div>{t('empty')}</div>;
    }

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
  };

  if (asPane) {
    return (
      <Tab.Pane loading={loading} attached={attached}>
        <div className={parentStyles.pane_container}>
          {content()}
        </div>
      </Tab.Pane>
    );
  }

  return content();
};
