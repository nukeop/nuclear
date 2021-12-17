import React from 'react';
import { CellProps } from 'react-table';

import { Playlist } from '@nuclear/core';

import { PlaylistsStrings } from '..';

const TracksCell: React.FC<CellProps<Playlist> & PlaylistsStrings> = ({
  cell,
  value,
  tracksSingular,
  tracksPlural
}) => <td
  {...cell.getCellProps()}
>
  {value}
  {' '}
  {value < 2 && value > 0 ? tracksSingular : tracksPlural}
</td>;

export default TracksCell;
