import { CellContext } from '@tanstack/react-table';
import { EllipsisVertical, Plus } from 'lucide-react';
import { FC, forwardRef } from 'react';

import { Track } from '@nuclearplayer/model';

import { Button } from '../../Button';
import { useTrackTableContext } from '../TrackTableContext';
import { ContextMenuWrapperProps } from '../types';

type TitleCellMeta = {
  displayQueueControls?: boolean;
  onAddToQueue?: (track: Track) => void;
  ContextMenuWrapper?: FC<ContextMenuWrapperProps>;
};

type AddToQueueButtonProps = {
  onClick: () => void;
};

const AddToQueueButton: FC<AddToQueueButtonProps> = ({ onClick }) => (
  <Button
    data-testid="add-to-queue-button"
    size="icon-sm"
    variant="text"
    className="opacity-0 transition-none group-hover:opacity-100"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    aria-label="Add to queue"
  >
    <Plus size={16} />
  </Button>
);

const ContextMenuButton = forwardRef<HTMLElement>(
  function ContextMenuButton(props, ref) {
    return (
      <Button
        {...props}
        ref={ref}
        data-testid="track-context-menu-button"
        size="icon-sm"
        variant="text"
        className="opacity-0 transition-none group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
        aria-label="Track options"
      >
        <EllipsisVertical size={16} />
      </Button>
    );
  },
);

export const TitleCell = <T extends Track>({
  getValue,
  row,
  table,
}: CellContext<T, string | number | undefined>) => {
  const meta = table.options.meta as TitleCellMeta | undefined;
  const { actions } = useTrackTableContext<T>();
  const showControls = meta?.displayQueueControls;
  const ContextMenuWrapper = meta?.ContextMenuWrapper;
  const track = row.original;
  const hasAddToQueue = Boolean(meta?.onAddToQueue);
  const hasContextMenu = Boolean(ContextMenuWrapper);
  const hasActions = hasAddToQueue || hasContextMenu;

  return (
    <td className="truncate px-2">
      <div className="flex items-center justify-between gap-2">
        <button
          className="min-w-0 flex-1 cursor-pointer truncate text-left hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            actions.onPlayNow?.(track);
          }}
        >
          {getValue()}
        </button>
        {showControls && hasActions && (
          <div className="flex items-center gap-1">
            {hasAddToQueue && (
              <AddToQueueButton onClick={() => meta?.onAddToQueue?.(track)} />
            )}
            {ContextMenuWrapper && (
              <ContextMenuWrapper track={track}>
                <ContextMenuButton />
              </ContextMenuWrapper>
            )}
          </div>
        )}
      </div>
    </td>
  );
};
