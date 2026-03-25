import { FilterIcon, PlayIcon, PlusIcon } from 'lucide-react';

import { cn } from '../../utils';
import { Button } from '../Button';
import { Input } from '../Input';
import { Tooltip } from '../Tooltip';
import { useTrackTableContext } from './TrackTableContext';

type ToolbarProps = {
  filterValue: string;
  onFilterChange: (value: string) => void;
  className?: string;
};

export function Toolbar({
  filterValue,
  onFilterChange,
  className,
}: ToolbarProps) {
  const { features, actions, labels } = useTrackTableContext();

  if (!features.playAll && !features.addAllToQueue && !features.filterable) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {features.playAll && (
        <Tooltip content={labels.playAll} side="bottom">
          <Button
            size="icon"
            onClick={actions.onPlayAll}
            data-testid="play-all-button"
          >
            <PlayIcon size={16} strokeWidth={3} />
          </Button>
        </Tooltip>
      )}
      {features.addAllToQueue && (
        <Tooltip content={labels.addAllToQueue} side="bottom">
          <Button
            variant="secondary"
            size="icon"
            onClick={actions.onAddAllToQueue}
            data-testid="add-all-to-queue-button"
          >
            <PlusIcon size={16} strokeWidth={3} />
          </Button>
        </Tooltip>
      )}
      {features.filterable && (
        <div className="ml-auto inline-flex w-full max-w-sm items-stretch">
          <Input
            size="sm"
            value={filterValue}
            onChange={(event) => onFilterChange(event.target.value)}
            placeholder="Filter tracks"
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
