import React from 'react';

import TrackTable, { TrackTableProps } from '.';
import { Track } from '../../types';
import DateCell from './Cells/DateCell';
import { TrackTableColumn } from './types';

export type HistoryTableTrack = Track & {
    createdAt: string;
}

type HistoryTableProps = TrackTableProps<HistoryTableTrack>;

const HistoryTable: React.FC<HistoryTableProps> = ({ tracks, ...props }) => {
  return <TrackTable
    tracks={tracks}
    customColumns={[{
      id: TrackTableColumn.Date,
      Header: 'Date',
      accessor: (track: HistoryTableTrack) => track.createdAt.toLocaleString(),
      Cell: DateCell
    }]}
    {...props}
  />;
};

export default HistoryTable;
