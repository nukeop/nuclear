/* eslint-disable react/jsx-key */
import React, { useMemo } from 'react';
import { useTable, Column, useRowSelect } from 'react-table';
import _ from 'lodash';

import { Track } from '../../types';
import { getTrackThumbnail } from '../TrackRow';
import TrackTableCell from './Cells/TrackTableCell';
import PositionCell from './Cells/PositionCell';
import ThumbnailCell from './Cells/ThumbnailCell';
import TitleCell from './Cells/TitleCell';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import FavoriteCell from './Cells/FavoriteCell';
import SelectionHeader from './Headers/SelectionHeader';
import SelectionCell from './Cells/SelectionCell';
import { TrackTableColumn } from './types';

export type TrackTableProps = {
  tracks: Track[];
  isTrackFavorite: (track: Track) => boolean;

  positionHeader: string;
  thumbnailHeader: React.ReactNode;
  artistHeader: string;
  titleHeader: string;
  albumHeader: string;
  durationHeader: string;

  displayPosition?: boolean;
  displayThumbnail?: boolean;
  displayFavorite?: boolean;
  displayArtist?: boolean;
  displayAlbum?: boolean;
  displayDuration?: boolean;
  selectable?: boolean;
  
}

const TrackTable: React.FC<TrackTableProps> = ({
  tracks,
  isTrackFavorite,

  positionHeader,
  thumbnailHeader,
  artistHeader,
  titleHeader,
  albumHeader,
  durationHeader,

  displayPosition=true,
  displayThumbnail=true,
  displayFavorite=true,
  displayArtist=true,
  displayAlbum=true,
  displayDuration=true,
  selectable=true
}) => {
  const columns = useMemo(() => [
    displayPosition && {
      id: TrackTableColumn.Position,
      Header: () => <span className={styles.center_aligned}>{positionHeader}</span>,
      accessor: 'position',
      Cell: PositionCell
    },
    displayThumbnail && {
      id: TrackTableColumn.Thumbnail,
      Header: () => <span className={styles.center_aligned}>{thumbnailHeader}</span>,
      accessor: (track) => getTrackThumbnail(track) || artPlaceholder,
      Cell: ThumbnailCell
    },
    displayFavorite && {
      id: TrackTableColumn.Favorite,
      Header: '',
      accessor: isTrackFavorite,
      Cell: FavoriteCell
    },
    {
      id: TrackTableColumn.Title,
      Header: titleHeader,
      accessor: (track) => track.title ?? track.name,
      Cell: TitleCell
    },
    displayArtist && {
      id: TrackTableColumn.Artist,
      Header: artistHeader,
      accessor: (track) => _.isString(track.artist)
        ? track.artist
        : track.artist.name,
      Cell: TrackTableCell
    },
    displayAlbum && {
      id: TrackTableColumn.Album,
      Header: albumHeader,
      accessor: 'album',
      Cell: TrackTableCell
    },
    displayDuration && {
      id: TrackTableColumn.Duration,
      Header: durationHeader,
      accessor: 'duration',
      Cell: TrackTableCell
    },
    selectable && {
      id: TrackTableColumn.Selection,
      Header: SelectionHeader,
      Cell: SelectionCell
    }
  ].filter(Boolean) as Column<Track>[], [displayPosition, displayThumbnail, displayFavorite, isTrackFavorite, titleHeader, displayArtist, artistHeader, displayAlbum, albumHeader, displayDuration, durationHeader, selectable, positionHeader, thumbnailHeader]);

  const data = useMemo(() => tracks, [tracks]);

  const table = useTable<Track>({ columns, data }, useRowSelect);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = table;

  return <table {...getTableProps()} className={styles.track_table}>
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
              {row.cells.map(cell => (cell.render('Cell')))}
            </tr>
          );
        })
      }
    </tbody>
  </table>;
};

export default TrackTable;
