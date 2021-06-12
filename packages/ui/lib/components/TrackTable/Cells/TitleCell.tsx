import React from 'react';
import { CellProps } from 'react-table';

import { Button, TrackPopup } from '../../..';
import { TrackTableColumn, TrackTableExtraProps } from '../types';
import { Track } from '../../../types';
import styles from '../styles.scss';

const TitleCell: React.FC<CellProps<Track> & TrackTableExtraProps> = ({
  cell,
  row,
  value,

  onPlay,
  onAddToQueue,
  onAddToFavorites,
  onAddToPlaylist,
  onAddToDownloads,
  playlists
}) => <td {...cell.getCellProps()} className={styles.title_cell}>
  <span className={styles.title_cell_content}>
    <span className={styles.title_cell_value}>
      {value}
    </span>
    <span className={styles.title_cell_buttons}>
      <Button 
        basic 
        borderless 
        circular 
        size='tiny' 
        icon='plus' 
        onClick={() => onAddToQueue(row.original)}
        data-testid='add-to-queue'
      />

      <TrackPopup
        trigger={
          <Button
            basic
            borderless
            circular
            size='tiny'
            icon='ellipsis horizontal'
            data-testid='track-popup-trigger'
          />
        }
        thumb={row.values[TrackTableColumn.Thumbnail]}
        title={row.values[TrackTableColumn.Title]}
        artist={row.values[TrackTableColumn.Artist]}
        playlists={playlists}

        onPlayNow={() => onPlay(row.original)}
        onAddToQueue={() => onAddToQueue(row.original)}
        onAddToFavorites={() => onAddToFavorites(row.original)}
        onAddToPlaylist={(playlist: {name: string}) => onAddToPlaylist(row.original, playlist)}
        onAddToDownloads={() => onAddToDownloads(row.original)}

        withPlayNow={Boolean(onPlay)}
        withAddToQueue={Boolean(onAddToQueue)}
        withAddToFavorites={Boolean(onAddToFavorites)}
        withAddToPlaylist={Boolean(onAddToFavorites)}
        withAddToDownloads={Boolean(onAddToDownloads)}
      />
    </span>
  </span>
</td>;

export default TitleCell;
