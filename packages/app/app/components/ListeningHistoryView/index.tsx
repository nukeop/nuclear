import React from 'react';
import { groupBy, map } from 'lodash';

import { HistoryTableTrack } from '@nuclear/ui/lib/components/TrackTable/HistoryTable';

import { ListeningHistorySection } from './ListeningHistorySection';
import styles from './styles.scss';
import Header from '../Header';
import { useTranslation } from 'react-i18next';
import { Button } from '@nuclear/ui';
import { Icon } from 'semantic-ui-react';

export type ListeningHistoryView = {
  tracks: HistoryTableTrack[];
}

export const ListeningHistoryView: React.FC<ListeningHistoryView> = ({
  tracks
}) => {
  const { t } = useTranslation('listening-history');
  const tracksGroupedByDays = groupBy(tracks, track => track.createdAt.toLocaleDateString());

  return <div className={styles.listening_history_view}>
    <Header>
      <div className={styles.listening_history_header}>
        {t('title')}

        <div className={styles.listening_history_header_actions}>
          <Button
            data-testid='refresh-history'
            onClick={() => {}}
            basic
            icon='refresh'
          />
          <Button
            data-testid='clear-history'
            onClick={() => {}}
            basic
          >
            {t('clear-history')}
          </Button>
        </div>
      </div>
    </Header>
    {
      map(tracksGroupedByDays, (tracksSubset, date) => <ListeningHistorySection 
        key={date}
        tracks={tracksSubset} 
      />
      )
    }
  </div>;
};
