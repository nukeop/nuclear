import React from 'react';
import { HistoryTableDate } from '@nuclear/ui';
import { HistoryTableTrack } from '@nuclear/ui/lib/components/TrackTable/HistoryTable';

import styles from './styles.scss';
import TrackTableContainer from '../../containers/TrackTableContainer';
import { HistoryTable } from '@nuclear/ui';

export type ListeningHistorySection = {
    tracks: HistoryTableTrack[];
}

export const ListeningHistorySection: React.FC<ListeningHistorySection> = ({tracks}) => {
  const date = tracks?.[0].createdAt.toLocaleDateString();

  return <section className={styles.listening_history_section}>
    <HistoryTableDate>
      {date}
    </HistoryTableDate>
    <TrackTableContainer 
      tracks={tracks}
      displayDeleteButton={false}
      displayThumbnail={false}
      displayAlbum={false}
      TrackTableComponent={HistoryTable}
    />
  </section>;
};
