import { Check, Download } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';
import { Badge } from '../Badge';
import { Box } from '../Box';
import { Button } from '../Button';
import { Loader } from '../Loader';

type ThemeStoreItemProps = {
  name: string;
  description: string;
  author: string;
  palette: [string, string, string, string];
  tags?: string[];
  isInstalled?: boolean;
  isInstalling?: boolean;
  onInstall: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  labels?: {
    install?: string;
    installing?: string;
    installed?: string;
    by?: string;
  };
  className?: string;
};

export const ThemeStoreItem: FC<ThemeStoreItemProps> = ({
  name,
  description,
  author,
  palette,
  tags,
  isInstalled = false,
  isInstalling = false,
  onInstall,
  onMouseEnter,
  onMouseLeave,
  labels = {},
  className,
}) => {
  const {
    install = 'Install',
    installing = 'Installing',
    installed = 'Installed',
    by = 'by',
  } = labels;

  return (
    <Box
      data-testid="theme-store-item"
      variant="tertiary"
      className={cn('relative h-auto overflow-hidden p-2', className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute inset-0 flex">
        {palette.map((color, index) => (
          <div
            key={index}
            className="-mx-4 flex-1 scale-y-110 -skew-x-12 first:-ml-8 last:-mr-8"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <Box
        variant="tertiary"
        shadow="none"
        className="relative flex-1 flex-row items-center justify-between gap-4"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3
              data-testid="theme-store-item-name"
              className="text-foreground text-base font-bold"
            >
              {name}
            </h3>
            {tags?.map((tag) => (
              <Badge key={tag} variant="pill" color="cyan">
                {tag}
              </Badge>
            ))}
          </div>
          <p
            data-testid="theme-store-item-description"
            className="text-foreground-secondary line-clamp-2 text-sm"
          >
            {description}
          </p>
          <p
            data-testid="theme-store-item-author"
            className="text-foreground-secondary text-xs"
          >
            {by} {author}
          </p>
        </div>
        <div className="shrink-0">
          {isInstalling ? (
            <Button disabled className="w-28">
              <Loader size="sm" />
              <span className="ml-2">{installing}</span>
            </Button>
          ) : isInstalled ? (
            <Button disabled className="w-28">
              <Check size={16} />
              <span className="ml-2">{installed}</span>
            </Button>
          ) : (
            <Button onClick={onInstall} className="w-28">
              <Download size={16} />
              <span className="ml-2">{install}</span>
            </Button>
          )}
        </div>
      </Box>
    </Box>
  );
};
