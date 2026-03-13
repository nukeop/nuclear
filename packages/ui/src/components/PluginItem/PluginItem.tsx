import {
  RotateCw as RotateCwIcon,
  Settings as SettingsIcon,
  Trash as TrashIcon,
  TriangleAlert as TriangleAlertIcon,
} from 'lucide-react';
import { FC, ReactNode } from 'react';

import '../../styles.css';

import { cn } from '../../utils';
import { Box } from '../Box';
import { Button } from '../Button';
import { Popover } from '../Popover';

type PluginItemProps = {
  name: string;
  author: string;
  description: string;
  icon?: ReactNode;
  onViewDetails?: () => void;
  className?: string;
  disabled?: boolean;
  warning?: boolean;
  warningText?: string;
  rightAccessory?: ReactNode;
  loadTimeMs?: number;
  onReload?: () => void;
  onRemove?: () => void;
  reloadDisabled?: boolean;
  removeDisabled?: boolean;
  isLoading?: boolean;
};

export const PluginItem: FC<PluginItemProps> = ({
  name,
  author,
  description,
  icon,
  onViewDetails,
  className,
  disabled = false,
  warning = false,
  warningText,
  rightAccessory,
  loadTimeMs,
  onReload,
  onRemove,
  reloadDisabled = false,
  removeDisabled = false,
  isLoading = false,
}) => (
  <div className="flex flex-row gap-2">
    <Box
      data-testid="plugin-item"
      variant="tertiary"
      className={cn(
        {
          'ring-accent-orange cursor-default ring-2 select-none ring-inset':
            warning,
          'opacity-30': disabled && !isLoading,
        },
        'relative cursor-default overflow-hidden transition-opacity duration-250',
        className,
      )}
      aria-busy={isLoading}
    >
      <div className={'flex w-full flex-wrap items-start gap-4'}>
        {icon && (
          <Box
            variant="tertiary"
            shadow="none"
            className="h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden p-0"
          >
            {icon}
          </Box>
        )}

        <div className="min-w-0 flex-1">
          <h3
            data-testid="plugin-name"
            className="text-foreground inline-flex items-center gap-4 text-lg leading-tight font-bold select-none"
          >
            {name}
          </h3>
          <p
            data-testid="plugin-author"
            className="text-foreground-secondary mt-1 text-sm select-none"
          >
            by {author}
          </p>
          <p
            data-testid="plugin-description"
            className="text-foreground-secondary mt-2 text-sm leading-relaxed select-none"
          >
            {description}
          </p>
        </div>

        {(warning || warningText) && !isLoading && (
          <Popover
            className="-top-4 -left-2"
            anchor="right"
            trigger={
              <div className="relative flex h-12 w-12 items-center">
                {warning && (
                  <span className="bg-accent-orange border-border inline-flex items-center justify-center rounded-md border-(length:--border-width) p-1 text-xs font-semibold text-black">
                    <TriangleAlertIcon className="fill-accent-yellow" />
                  </span>
                )}
              </div>
            }
          >
            {warningText}
          </Popover>
        )}

        <div className="flex h-full shrink-0 flex-col items-start justify-center sm:w-auto sm:items-end">
          {rightAccessory && (
            <div className={cn({ 'pointer-events-none': isLoading })}>
              {rightAccessory}
            </div>
          )}
        </div>
        <span className="text-foreground-secondary absolute right-4 bottom-2 mt-2 text-sm">
          Loaded in {loadTimeMs}ms
        </span>
      </div>
      {isLoading && (
        <div className="bg-stripes-diagonal absolute right-0 bottom-0 left-0 h-1" />
      )}
    </Box>
    <div className="flex flex-col justify-between gap-2">
      {onViewDetails && (
        <Button
          data-testid="plugin-action-view-details"
          size="icon-sm"
          onClick={onViewDetails}
          disabled={disabled || isLoading}
        >
          <SettingsIcon size={20} />
        </Button>
      )}
      {onReload && !isLoading && (
        <Button
          data-testid="plugin-action-reload"
          size="icon-sm"
          onClick={onReload}
          disabled={reloadDisabled || disabled}
        >
          <RotateCwIcon size={20} />
        </Button>
      )}
      {onRemove && !isLoading && (
        <Button
          data-testid="plugin-action-remove"
          size="icon-sm"
          intent="danger"
          onClick={onRemove}
          disabled={removeDisabled}
        >
          <TrashIcon size={20} />
        </Button>
      )}
    </div>
  </div>
);
