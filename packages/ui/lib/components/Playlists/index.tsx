import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import { DragDropContext, DragDropContextProps, Draggable, Droppable } from 'react-beautiful-dnd';
import cx from 'classnames';

import { Playlist } from '@nuclear/core';

import ThumbnailCell from '../TrackTable/Cells/ThumbnailCell';
import TitleCell from './Cells/TitleCell';
import { PlaylistsColumn } from './types';
import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import TracksCell from './Cells/TracksCell';

export type PlaylistsStrings = {
  tracksSingular: string;
  tracksPlural: string;
}

export type PlaylistsProps = PlaylistsStrings & {
  playlists: Playlist[];
  onDragEnd?: DragDropContextProps['onDragEnd'];
};

const Playlists: React.FC<PlaylistsProps> = ({
  playlists,
  onDragEnd,
  ...strings
}) => {
  const columns = useMemo(() => [
    {
      id: PlaylistsColumn.Thumbnail,
      accessor: playlist => playlist.tracks?.[0]?.thumbnail || artPlaceholder,
      Cell: ThumbnailCell(styles)
    },
    {
      id: PlaylistsColumn.Title,
      accessor: playlist => playlist?.name,
      Cell: TitleCell
    },
    {
      id: PlaylistsColumn.Tracks,
      accessor: playlist => playlist?.tracks?.length ?? 0,
      Cell: TracksCell
    }
  ], []);
  const data = useMemo(() => playlists, [playlists]);
  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow
  } = useTable<Playlist>({ columns, data });
  return <table
    {...getTableProps()}
    className={styles.playlists_table}
  >
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='playlists'>
        {(provided) => (
          <tbody
            ref={provided.innerRef}
            {...getTableBodyProps()}
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
                        className={cx({ [styles.is_dragging]: snapshot.isDragging })}
                        {...row.getRowProps()}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {row.cells.map((cell, i) => (cell.render('Cell', { ...strings, key: i })))}
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
