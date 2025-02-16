import React from 'react';
import { CellProps } from 'react-table';
import cx from 'classnames';

import { TrackTableColumn, TrackTableExtraProps } from '../../TrackTable/types';
import { Track } from '../../../types';
import Button from '../../Button';
import TrackPopup from '../../TrackPopup';
import Tooltip from '../../Tooltip';
import styles from '../styles.scss';

export const TitleCell = <T extends Track>({
  cell,
  row,
  value,

  onPlay,
  onPlayNext,
  onAddToQueue,
  onAddToFavorites,
  onAddToPlaylist,
  onCreatePlaylist,
  onAddToDownloads,
  playlists,
  popupActionStrings
}: CellProps<T> & TrackTableExtraProps<T>) => {
  return (
    <div
      {...cell.getCellProps()}
      data-testid='title-cell'
      className={cx(
        styles.grid_track_table_cell,
        styles.text_cell,
        styles.title_cell
      )}
    >
      <span className={styles.title_cell_content}>
        <Tooltip
          on='hover'
          content={value}
          trigger={<span className={styles.title_cell_value}>{value}</span>} />
        <span className={styles.title_cell_buttons}>
          <Button
            className={styles.title_cell_button}
            basic
            borderless
            circular
            size='tiny'
            icon='plus'
            onClick={() => onAddToQueue(row.original)}
            data-testid='add-to-queue' />

          <TrackPopup
            trigger={<Button
              className={styles.title_cell_button}
              basic
              borderless
              circular
              size='tiny'
              icon='ellipsis horizontal'
              data-testid='track-popup-trigger' />}
            thumb={row.values[TrackTableColumn.Thumbnail]}
            title={row.values[TrackTableColumn.Title]}
            artist={row.values[TrackTableColumn.Artist]}
            playlists={playlists}
            onPlayNow={() => onPlay(row.original)}
            onPlayNext={() => onPlayNext(row.original)}
            onAddToQueue={() => onAddToQueue(row.original)}
            onAddToFavorites={() => onAddToFavorites(row.original)}
            onAddToPlaylist={(playlist: { name: string; }) => onAddToPlaylist(row.original, playlist)}
            onCreatePlaylist={(options: { name: string; }) => onCreatePlaylist(row.original, options)}
            onAddToDownloads={() => onAddToDownloads(row.original)}
            withPlayNow={Boolean(onPlay)}
            withPlayNext={Boolean(onPlayNext)}
            withAddToQueue={Boolean(onAddToQueue)}
            withAddToFavorites={Boolean(onAddToFavorites)}
            withAddToPlaylist={Boolean(onAddToFavorites)}
            withAddToDownloads={Boolean(onAddToDownloads) && !row.original.local}
            strings={popupActionStrings} />
        </span>
      </span>
    </div>
  );
};
