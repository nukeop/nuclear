import React from 'react';
import { useTable, Column } from 'react-table';

import { Track } from '../../types';

export type TrackTableProps = {
  tracks: Track[];

  positionHeader: string;
  thumbnailHeader: string;
  artistHeader: string;
  titleHeader: string;
}


const TrackTable: React.FC<TrackTableProps> = ({
  tracks,

  positionHeader,
  thumbnailHeader,
  artistHeader,
  titleHeader
}) => {
  const columns =  [
    { Header: positionHeader, accessor: 'position' },
    { Header: thumbnailHeader, accessor: 'thumbnail' },
    { Header: artistHeader, accessor: 'artist' },
    { Header: titleHeader, accessor: 'title' }
  ] as Column<Track>[];

  const table = useTable({columns, data: tracks});

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = table;

  return <table {...getTableProps()}>
    <thead>
      {
        headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {
              headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))
            }
          </tr>
        ))
      }
    </thead>
    <tbody {...getTableBodyProps()}>
      {
        rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {
                row.cells.map(cell => (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))
              }
            </tr>
          );
        })
      }
    </tbody>
  </table>;
};

export default TrackTable;
