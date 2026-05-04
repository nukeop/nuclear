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
  version?: string;
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
  version,
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
          <h3 className="text-foreground inline-flex flex-row items-baseline gap-2 text-lg leading-tight font-bold select-none">
            <span data-testid="plugin-store-item-name">{name}</span>
            <p className="text-foreground-secondary text-sm font-normal select-none">
              <span className="mr-1 opacity-60">{by}</span>
              <span data-testid="plugin-store-item-author">{author}</span>
            </p>
          </h3>
          {version && (
            <Badge
              data-testid="plugin-store-item-version"
              color="inverted"
              variant="pill"
            >
              v{version}
            </Badge>
          )}
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
