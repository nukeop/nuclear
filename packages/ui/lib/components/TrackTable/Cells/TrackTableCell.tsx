import React from 'react';
import { CellProps } from 'react-table';

import { Track } from '../../../types';

const TrackTableCell: React.FC<CellProps<Track>> = ({
  cell,
  value
}) => <td {...cell.getCellProps()}>
  {value}
</td>;

export default TrackTableCell;
