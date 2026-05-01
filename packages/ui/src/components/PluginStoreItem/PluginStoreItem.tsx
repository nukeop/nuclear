import { Check, Download } from 'lucide-react';
import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';
import { Badge } from '../Badge';
import { Box } from '../Box';
import { Button } from '../Button';
import { Loader } from '../Loader';

type PluginStoreItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  name: string;
  description: string;
  author: string;
  // TODO: Remove category after registry migration to categories
  category?: string;
  categories?: string[];
  isInstalled?: boolean;
  isInstalling?: boolean;
  onInstall: () => void;
  labels?: {
    install?: string;
    installing?: string;
    installed?: string;
    by?: string;
  };
};

export const PluginStoreItem: FC<PluginStoreItemProps> = ({
  name,
  description,
  author,
  category,
  categories,
  isInstalled = false,
  isInstalling = false,
  onInstall,
  labels = {},
  className,
  ...props
}) => {
  const {
    install = 'Install',
    installing = 'Installing',
    installed = 'Installed',
    by = 'by',
  } = labels;

  return (
    <Box
      data-testid="plugin-store-item"
      variant="tertiary"
      className={cn('flex-row items-center justify-between gap-4', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3
            data-testid="plugin-store-item-name"
            className="text-foreground truncate text-base font-bold"
          >
            {name}
          </h3>
          {(categories ?? (category ? [category] : [])).map((cat) => (
            <Badge key={cat} variant="pill" color="cyan">
              {cat}
            </Badge>
          ))}
        </div>
        <p
          data-testid="plugin-store-item-description"
          className="text-foreground-secondary line-clamp-2 text-sm"
        >
          {description}
        </p>
        <p
          data-testid="plugin-store-item-author"
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
  );
};
