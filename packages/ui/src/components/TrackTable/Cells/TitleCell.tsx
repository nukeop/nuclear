import { CellContext } from '@tanstack/react-table';
import { EllipsisVertical, Play, Plus } from 'lucide-react';
import { FC, forwardRef } from 'react';

import { Track } from '@nuclearplayer/model';

import { Button } from '../../Button';
import { ContextMenuWrapperProps } from '../types';

type TitleCellMeta = {
  displayQueueControls?: boolean;
  onAddToQueue?: (track: Track) => void;
  onPlayNow?: (track: Track) => void;
  ContextMenuWrapper?: FC<ContextMenuWrapperProps>;
};

type TrackActionButtonProps = {
  onClick: () => void;
};

const PlayNowButton: FC<TrackActionButtonProps> = ({ onClick }) => (
  <Button
    data-testid="play-now-button"
    size="icon-sm"
    variant="text"
    className="opacity-0 transition-none group-hover:opacity-100"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    aria-label="Play now"
  >
    <Play size={14} />
  </Button>
);

const AddToQueueButton: FC<TrackActionButtonProps> = ({ onClick }) => (
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
  const showControls = meta?.displayQueueControls;
  const ContextMenuWrapper = meta?.ContextMenuWrapper;
  const track = row.original;
  const hasPlayNow = Boolean(meta?.onPlayNow);
  const hasAddToQueue = Boolean(meta?.onAddToQueue);
  const hasContextMenu = Boolean(ContextMenuWrapper);
  const hasActions = hasPlayNow || hasAddToQueue || hasContextMenu;

  return (
    <td className="cursor-default truncate px-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 truncate">{getValue()}</div>
        {showControls && hasActions && (
          <div className="flex items-center gap-1">
            {hasPlayNow && (
              <PlayNowButton onClick={() => meta?.onPlayNow?.(track)} />
            )}
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
