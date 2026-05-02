import {
  ArrowUpCircle,
  RotateCw as RotateCwIcon,
  Settings as SettingsIcon,
  Trash as TrashIcon,
  TriangleAlert as TriangleAlertIcon,
} from 'lucide-react';
import { FC, ReactNode } from 'react';

import '../../styles.css';

import { cn } from '../../utils';
import { Badge } from '../Badge';
import { Box } from '../Box';
import { Button } from '../Button';

type PluginItemProps = {
  name: string;
  author: string;
  description: string;
  version?: string;
  updateAvailable?: boolean;
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
  labels?: {
    by?: string;
    updateAvailable?: string;
  };
};

export const PluginItem: FC<PluginItemProps> = ({
  name,
  author,
  description,
  version,
  updateAvailable = false,
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
  labels = {},
}) => (
  <div className="flex flex-row gap-2">
    <Box
      data-testid="plugin-item"
      variant={warning ? 'warning' : 'tertiary'}
      className={cn(
        {
          'ring-accent-orange cursor-default ring-2 select-none ring-inset':
            warning,
          'opacity-30': disabled && !isLoading,
        },
        'relative flex cursor-default flex-col gap-2 overflow-hidden transition-opacity duration-250',
        className,
      )}
      aria-busy={isLoading}
    >
      <div className="flex w-full flex-row gap-2">
        <div className={'flex w-full flex-wrap items-start gap-4'}>
          {icon && (
            <Box
              variant="tertiary"
              className="h-12 w-12 shrink-0 items-center justify-center overflow-hidden p-0"
            >
              {icon}
            </Box>
          )}

          <div className="min-w-0 flex-1">
            <h3
              data-testid="plugin-name"
              className="text-foreground inline-flex flex-row items-baseline gap-2 text-lg leading-tight font-bold select-none"
            >
              {name}
              <p
                data-testid="plugin-author"
                className="text-foreground-secondary text-sm font-normal select-none"
              >
                <span className="mr-1 opacity-60">{labels.by ?? 'by'}</span>
                {author}
              </p>
            </h3>
            <p
              data-testid="plugin-description"
              className="text-foreground mt-2 text-sm leading-relaxed select-none"
            >
              {description}
            </p>
          </div>

          <div className="flex h-full shrink-0 flex-col items-end justify-between sm:w-auto sm:items-end">
            {rightAccessory && (
              <div className={cn({ 'pointer-events-none': isLoading })}>
                {rightAccessory}
              </div>
            )}
            <span
              data-testid="plugin-version"
              className="text-foreground-secondary flex flex-row items-baseline gap-2 text-sm font-normal"
            >
              {loadTimeMs && (
                <Badge color="purple" variant="pill">
                  {loadTimeMs}ms
                </Badge>
              )}
              {version && (
                <Badge color="inverted" variant="pill">
                  v{version}
                </Badge>
              )}
              {updateAvailable && (
                <Badge
                  data-testid="plugin-update-available"
                  variant="pill"
                  color="green"
                  className="flex flex-row gap-1"
                >
                  <ArrowUpCircle size={12} />
                  {labels.updateAvailable ?? 'Update available'}
                </Badge>
              )}
            </span>
          </div>
        </div>
        {isLoading && (
          <div className="bg-stripes-diagonal absolute right-0 bottom-0 left-0 h-1" />
        )}
      </div>
      {(warning || warningText) && !isLoading && (
        <Box
          shadow="none"
          variant="tertiary"
          className="flex-row items-center justify-start gap-1 px-2 py-1 text-xs"
        >
          <TriangleAlertIcon size={20} color="var(--accent-orange)" />
          {warningText}
        </Box>
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
