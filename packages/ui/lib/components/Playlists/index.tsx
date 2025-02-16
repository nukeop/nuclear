import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { DragDropContext, DragDropContextProps, Draggable, Droppable } from 'react-beautiful-dnd';
import cx from 'classnames';

import { Playlist } from '@nuclear/core';

import ThumbnailCell from '../TrackTable/Cells/ThumbnailCell';
import TitleCell from './Cells/TitleCell';
import { PlaylistsColumn } from './types';
import TracksCell from './Cells/TracksCell';
import ModificationDateCell from './Cells/ModificationDateCell';
import SyncCell from './Cells/SyncCell';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import styles from './styles.scss';
import { TableHTMLAttributes } from 'react';

export type PlaylistsStrings = {
  tracksSingular: string;
  tracksPlural: string;

  modifiedAt: string;
  neverModified: string;
  serverModifiedAt: string;

  uploadToServer: string;
  downloadFromServer: string;

  locale: string;
}

export type PlaylistsCallbacks = {
  onPlaylistClick: (id: string) => void;
  onPlaylistUpload: (playlist: Playlist) => void;
  onPlaylistDownload: (id: string) => void;
}

export type PlaylistWithLoadingState = Playlist & {
  isLoading?: boolean;
};

export type PlaylistsProps = PlaylistsStrings & 
PlaylistsCallbacks & {
  playlists: PlaylistWithLoadingState[];
  onDragEnd?: DragDropContextProps['onDragEnd'];
  displayModificationDates?: boolean;
};

const Playlists: React.FC<PlaylistsProps> = ({
  playlists,
  onDragEnd,
  displayModificationDates=false,
  ...extra
}) => {
  const columns = useMemo((): Column<Playlist>[] => [
    {
      id: PlaylistsColumn.Thumbnail,
      accessor: (playlist: PlaylistWithLoadingState) => playlist.tracks?.[0]?.thumbnail || artPlaceholder,
      Cell: (props) => {
        const CellComponent = ThumbnailCell(styles);
        return <CellComponent {...props} styles={styles} />;
      }
    },
    {
      id: PlaylistsColumn.Title,
      accessor: (playlist: PlaylistWithLoadingState) => playlist?.name,
      Cell: (props) => <TitleCell {...props} />
    },
    {
      id: PlaylistsColumn.Tracks,
      accessor: (playlist: PlaylistWithLoadingState) => playlist?.tracks?.length ?? 0,
      Cell: (props) => <TracksCell {...props} />
    },
    displayModificationDates && {
      id: PlaylistsColumn.LastModified,
      accessor: (playlist: PlaylistWithLoadingState) => ({
        lastModified: playlist?.lastModified,
        serverModified: playlist?.serverModified
      }),
      Cell: (props) => <ModificationDateCell {...props} />
    },
    displayModificationDates && {
      id: PlaylistsColumn.Sync,
      accessor: null,
      Cell: (props) => <SyncCell {...props} />
    }
  ].filter(Boolean), [displayModificationDates]);
  const data = useMemo(() => playlists, [playlists]);
  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow
  } = useTable<PlaylistWithLoadingState>({ columns, data });

  return <table
    {...getTableProps() as TableHTMLAttributes<HTMLTableElement>}
    className={styles.playlists_table}
  >
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='playlists'>
        {(provided) => (
          <tbody
            ref={provided.innerRef}
            {...getTableBodyProps() as TableHTMLAttributes<HTMLTableSectionElement>}
            {...provided.droppableProps}
          >
            {
              rows.map(row => {
                prepareRow(row);
                return (
                  <Draggable
                    key={`${row.values[PlaylistsColumn.Title]}  ${row.index}`}
                    draggableId={`${row.values[PlaylistsColumn.Title]}  ${row.index}`}
                    index={row.index}
                    isDragDisabled={!onDragEnd}
                  >
                    {(provided, snapshot) => (
                      <tr
                        ref={provided.innerRef}
                        onClick={() => extra.onPlaylistClick(row.original.id)}
                        {...row.getRowProps() as TableHTMLAttributes<HTMLTableRowElement>}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {row.cells.map((cell, i) => (cell.render('Cell', { 
                          ...extra, 
                          key: i 
                        })))}
                      </tr>
                    )}
                  </Draggable>
                );
              })
            }
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
    </DragDropContext>
  </table>;
};

export default Playlists;
