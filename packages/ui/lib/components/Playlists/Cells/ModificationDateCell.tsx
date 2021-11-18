import React from 'react';
import { CellProps } from 'react-table';

import { Playlist } from '@nuclear/core';

import styles from '../styles.scss';
import { PlaylistsCallbacks, PlaylistsStrings } from '..';
import Button from '../../Button';
import { Icon } from 'semantic-ui-react';
import Tooltip from '../../Tooltip';

const timestampToString = (timestamp: number, locale: string) => new Date(timestamp).toLocaleDateString(
  locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
);

const ModificationDateCell: React.FC<CellProps<Playlist> & PlaylistsStrings & PlaylistsCallbacks> = ({
  cell,
  row,
  value,

  locale = 'en-GB',
  modifiedAt,
  neverModified,
  serverModifiedAt,
  uploadToServer,
  downloadFromServer,

  onPlaylistDownload,
  onPlaylistUpload
}) => <td
  {...cell.getCellProps()}
  className={styles.modification_date_cell}
>
  <div className={styles.modification_date_cell_content}>
    <div className={styles.modified_dates}>
      <div className={styles.modified_at_row}>
        {modifiedAt}
        {
          value?.lastModified
            ? timestampToString(value.lastModified, locale)
            : neverModified
        }
      </div>
      <div className={styles.modified_at_row}>
        {serverModifiedAt}
        {
          value?.serverModified
            ? timestampToString(value.serverModified, locale)
            : neverModified
        }
      </div>
    </div>

    <div className={styles.sync_buttons}>
      <Tooltip
        content={uploadToServer}
        position='top center'
        trigger={
          <Button 
            onClick={() => onPlaylistUpload(row.original)}
            basic 
            icon 
            borderless
          >
            <Icon name='upload' />
          </Button>
        }
      />

      <Tooltip
        content={downloadFromServer}
        position='top center'
        trigger={
          <Button 
            onClick={() => onPlaylistDownload(row.original.id)}
            basic 
            icon 
            borderless
          >
            <Icon name='download' />
          </Button>
        }
      />
    </div>
  </div>
</td>;

export default ModificationDateCell;
