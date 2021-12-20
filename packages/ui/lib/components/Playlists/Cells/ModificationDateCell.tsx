import React from 'react';
import { CellProps } from 'react-table';

import { Playlist } from '@nuclear/core';

import styles from '../styles.scss';
import { PlaylistsCallbacks, PlaylistsStrings } from '..';
import { timestampToDateString } from '../../../utils';

const ModificationDateCell: React.FC<CellProps<Playlist> & PlaylistsStrings & PlaylistsCallbacks> = ({
  cell,
  value,

  locale = 'en-GB',
  modifiedAt,
  neverModified,
  serverModifiedAt  
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
            ? timestampToDateString(value.lastModified, locale)
            : neverModified
        }
      </div>
      <div className={styles.modified_at_row}>
        {serverModifiedAt}
        {
          value?.serverModified
            ? timestampToDateString(value.serverModified, locale)
            : neverModified
        }
      </div>
    </div>
  </div>
</td>;

export default ModificationDateCell;
