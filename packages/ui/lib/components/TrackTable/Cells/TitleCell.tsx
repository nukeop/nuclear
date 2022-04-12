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
  onPlayNext,
  onAddToQueue,
  onAddToFavorites,
  onAddToPlaylist,
  onAddToDownloads,
  playlists,
  popupActionStrings
}) => <td {...cell.getCellProps()} className={styles.title_cell}>
  <span className={styles.title_cell_content}>
    <span className={styles.title_cell_value}>
      {value}
    </span>
    <span className={styles.title_cell_buttons}>
      <Button
        className={styles.title_cell_button}
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
            className={styles.title_cell_button}
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
        onPlayNext={() => onPlayNext(row.original)}
        onAddToQueue={() => onAddToQueue(row.original)}
        onAddToFavorites={() => onAddToFavorites(row.original)}
        onAddToPlaylist={(playlist: {name: string}) => onAddToPlaylist(row.original, playlist)}
        onAddToDownloads={() => onAddToDownloads(row.original)}

        withPlayNow={Boolean(onPlay)}
        withPlayNext={Boolean(onPlayNext)}
        withAddToQueue={Boolean(onAddToQueue)}
        withAddToFavorites={Boolean(onAddToFavorites)}
        withAddToPlaylist={Boolean(onAddToFavorites)}
        withAddToDownloads={Boolean(onAddToDownloads)}

        strings={popupActionStrings}
      />
    </span>
  </span>
</td>;

export default TitleCell;
