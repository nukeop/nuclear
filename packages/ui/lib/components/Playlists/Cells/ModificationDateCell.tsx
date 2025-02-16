import React, { TdHTMLAttributes } from 'react';
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
  {...cell.getCellProps() as TdHTMLAttributes<HTMLTableCellElement>}
>
  <div className={styles.modification_date_cell_content}>
    <div className={styles.modified_dates}>
      <div>
        {modifiedAt}
        {
          value?.lastModified
            ? timestampToDateString(value.lastModified, locale)
            : neverModified
        }
      </div>
      <div>
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
