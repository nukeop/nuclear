import React from 'react';
import { groupBy, map } from 'lodash';

import { HistoryTableTrack } from '@nuclear/ui/lib/components/TrackTable/HistoryTable';

import { ListeningHistorySection } from './ListeningHistorySection';
import styles from './styles.scss';
import Header from '../Header';
import { useTranslation } from 'react-i18next';
import { Button, ConfirmationModal } from '@nuclear/ui';

export type ListeningHistoryView = {
  tracks: HistoryTableTrack[];
  refreshHistory: React.MouseEventHandler;
  clearHistory: () => void;
  nextPage: () => void;
  previousPage: () => void;
  isNextPageAvailable: boolean;
  isPreviousPageAvailable: boolean;
}

export const ListeningHistoryView: React.FC<ListeningHistoryView> = ({
  tracks,
  refreshHistory,
  clearHistory,
  nextPage,
  previousPage,
  isNextPageAvailable,
  isPreviousPageAvailable
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
            onClick={refreshHistory}
            basic
            icon='refresh'
          />
          <ConfirmationModal
            header={t('clear-history-confirm')}
            acceptLabel={t('clear-history-confirm-yes')}
            cancelLabel={t('clear-history-confirm-no')}
            onAccept={clearHistory}
            trigger={
              <Button
                data-testid='clear-history'
                onClick={() => { }}
                basic
              >
                {t('clear-history')}
              </Button>
            }
          />
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
    <div className={styles.listening_history_pagination}>
      <Button
        data-testid='previous-page'
        onClick={previousPage}
        basic
        icon='chevron left'
        disabled={!isPreviousPageAvailable}
      />

      <Button
        data-testid='next-page'
        onClick={nextPage}
        basic
        icon='chevron right'
        disabled={!isNextPageAvailable}
      />
    </div>
  </div>;
};
