import React from 'react';
import { CellProps } from 'react-table';

import { Button, ContextPopup } from '../../..';
import { Track } from '../../../types';
import styles from '../styles.scss';
import { TrackTableColumn } from '../types';

const TitleCell: React.FC<CellProps<Track>> = ({
  row,
  value
}) => <td className={styles.title_cell}>
  <span className={styles.title_cell_content}>
    <span className={styles.title_cell_value}>
      {value}
    </span>
    <span className={styles.title_cell_buttons}>
      <Button basic borderless circular size='mini' icon='plus' />

      <ContextPopup
        trigger={
          <Button basic borderless circular size='mini' icon='ellipsis horizontal' />
        }
        thumb={row.values[TrackTableColumn.Thumbnail]}
        title={row.values[TrackTableColumn.Title]}
        artist={row.values[TrackTableColumn.Artist]}
      />
    </span>
  </span>
</td>;

export default TitleCell;
