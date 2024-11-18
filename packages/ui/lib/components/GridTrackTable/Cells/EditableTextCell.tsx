import React, { useState } from 'react';
import { CellProps } from 'react-table';
import { Track } from '@nuclear/ui/lib/types';
import { TextCell } from './TextCell';
import cx from 'classnames';
import styles from '../styles.scss';

export const EditableArtistCell: React.FC<
  CellProps<Track> & {
    onTrackUpdate?: (index: number, updatedTrack: Track) => void;
  }
> = (props) => {
  const { cell, row, onTrackUpdate } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    typeof cell.value === 'string' ? cell.value : cell.value.name
  );

  if (!onTrackUpdate) {
    return <TextCell {...(props as any)} />;
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (editValue !== cell.value) {
        const updatedTrack = { ...row.original, artist: editValue };
        onTrackUpdate(row.index, updatedTrack);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(
        typeof cell.value === 'string' ? cell.value : cell.value.name
      );
    }
  };

  return isEditing ? (
    <input
      value={editValue}
      className={cx(styles.grid_track_table_cell, styles.text_cell)}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={() => {
        setIsEditing(false);
        if (editValue !== cell.value) {
          const updatedTrack = { ...row.original };
          if (typeof updatedTrack.artist === 'string') {
            updatedTrack.artist = editValue;
          } else {
            updatedTrack.artist = { name: editValue };
          }
          onTrackUpdate(row.index, updatedTrack);
        }
      }}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <div
      className={cx(styles.grid_track_table_cell, styles.text_cell)}
      onDoubleClick={() => setIsEditing(true)}
    >
      {editValue}
    </div>
  );
};
