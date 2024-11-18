import React, { useState } from 'react';
import { CellProps } from 'react-table';
import { Track } from '@nuclear/ui/lib/types';
import { TitleCell } from './TitleCell';
import cx from 'classnames';
import styles from '../styles.scss';

export const EditableTitleCell: React.FC<
  CellProps<Track> & {
    onTrackUpdate?: (index: number, updatedTrack: Track) => void;
  }
> = (props) => {
  const { cell, row, onTrackUpdate } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(cell.value);

  if (!onTrackUpdate) {
    return <TitleCell {...props} />;
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (editValue !== cell.value) {
        const updatedTrack = { ...row.original };
        updatedTrack.title = editValue;
        onTrackUpdate(row.index, updatedTrack);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(cell.value);
    }
  };

  return isEditing ? (
    <input
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      className={cx(
        styles.grid_track_table_cell,
        styles.text_cell,
        styles.title_cell
      )}
      onBlur={() => {
        setIsEditing(false);
        if (editValue !== cell.value) {
          const updatedTrack = { ...row.original };
          updatedTrack.title = editValue;
          onTrackUpdate(row.index, updatedTrack);
        }
      }}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className={cx(
        styles.grid_track_table_cell,
        styles.text_cell,
        styles.title_cell
      )}
    >
      <TitleCell {...props} />
    </div>
  );
};
