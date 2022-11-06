import React, { useMemo } from 'react';

import styles from './styles.scss';
import TrackTable, { TrackTableProps } from '.';
import { Track } from '../../types';
import DateCell from './Cells/DateCell';
import { TrackTableColumn } from './types';

export type HistoryTableTrack = Track & {
    createdAt: Date;
}

type HistoryTableProps = TrackTableProps<HistoryTableTrack>;

const HistoryTable: React.FC<HistoryTableProps> = ({ tracks, ...props }) => {
  const customColumns = useMemo(() => [{
    id: TrackTableColumn.Date,
    Header: 'Date',
    accessor: (track: HistoryTableTrack) => track.createdAt.toLocaleString(),
    Cell: DateCell
  }], []);

  return <TrackTable
    className={styles.history_table}
    tracks={tracks}
    customColumns={customColumns}
    displayHeaders={false}
    displayPosition={false}
    displayThumbnail={false}
    selectable={false}
    {...props}
  />;
};

export default HistoryTable;
