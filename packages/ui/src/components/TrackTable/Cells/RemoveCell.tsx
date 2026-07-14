import { CellContext } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { Track } from '@nuclearplayer/model';

import { Button } from '../../Button';
import { useTrackTableContext } from '../TrackTableContext';

type RemoveCellMeta = {
  onRemove: (track: Track, index: number) => void;
};

export const RemoveCell = <T extends Track>({
  row,
  table,
}: CellContext<T, unknown>) => {
  const meta = table.options.meta as RemoveCellMeta;
  const { labels } = useTrackTableContext<T>();
  const track = row.original;

  return (
    <td className="w-10 text-center">
      <Button
        size="icon-sm"
        variant="text"
        onClick={(e) => {
          e.stopPropagation();
          meta.onRemove(track, row.index);
        }}
        aria-label={labels.remove}
      >
        <Trash2 size={16} className="text-foreground-secondary" />
      </Button>
    </td>
  );
};
