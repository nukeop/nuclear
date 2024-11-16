import React, { useState } from 'react';
import { CellProps } from 'react-table';
import { Track } from '@nuclear/ui/lib/types';
import { TextCell } from './TextCell';

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

  return isEditing ? (
    <input
      value={editValue}
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
      autoFocus
    />
  ) : (
    <div
      className='grid_track_table_cell text_cell'
      onDoubleClick={() => setIsEditing(true)}
    >
      {editValue}
    </div>
  );
};
