import React, { useState } from 'react';
import { CellProps } from 'react-table';
import { Track } from '@nuclear/ui/lib/types';
import { TitleCell } from './TitleCell';

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

  return isEditing ? (
    <input
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={() => {
        setIsEditing(false);
        if (editValue !== cell.value) {
          const updatedTrack = { ...row.original };
          updatedTrack.title = editValue;
          onTrackUpdate(row.index, updatedTrack);
        }
      }}
      autoFocus
    />
  ) : (
    <div onDoubleClick={() => setIsEditing(true)}>
      <TitleCell {...props} />
    </div>
  );
};
