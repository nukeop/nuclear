import { FilterIcon, PlayIcon, PlusIcon } from 'lucide-react';

import { cn } from '../../utils';
import { Button } from '../Button';
import { Input } from '../Input';
import { Tooltip } from '../Tooltip';

type ToolbarProps = {
  playAll?: boolean;
  addAllToQueue?: boolean;
  filterable?: boolean;
  onPlayAll?: () => void;
  onAddAllToQueue?: () => void;
  playAllLabel?: string;
  addAllToQueueLabel?: string;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterPlaceholder?: string;
  className?: string;
};

export function Toolbar({
  playAll,
  addAllToQueue,
  filterable,
  onPlayAll,
  onAddAllToQueue,
  playAllLabel,
  addAllToQueueLabel,
  filterValue,
  onFilterChange,
  filterPlaceholder,
  className,
}: ToolbarProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {playAll && (
        <Tooltip content={playAllLabel} side="bottom">
          <Button size="icon" onClick={onPlayAll} data-testid="play-all-button">
            <PlayIcon size={16} strokeWidth={3} />
          </Button>
        </Tooltip>
      )}
      {addAllToQueue && (
        <Tooltip content={addAllToQueueLabel} side="bottom">
          <Button
            variant="secondary"
            size="icon"
            onClick={onAddAllToQueue}
            data-testid="add-all-to-queue-button"
          >
            <PlusIcon size={16} strokeWidth={3} />
          </Button>
        </Tooltip>
      )}
      {filterable && (
        <div className="ml-auto inline-flex w-full max-w-sm items-stretch">
          <Input
            size="sm"
            value={filterValue}
            onChange={(event) => onFilterChange(event.target.value)}
            placeholder={filterPlaceholder ?? 'Filter tracks'}
            endAddon={
              <FilterIcon
                className="h-4 w-4"
                aria-hidden="true"
                strokeWidth={3}
              />
            }
          />
        </div>
      )}
    </div>
  );
}
