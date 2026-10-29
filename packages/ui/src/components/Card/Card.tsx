import { CassetteTape } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { Box } from '../Box';
import { Button } from '../Button';
import { ImageReveal } from '../ImageReveal';
import { CardActions, CardLabels } from './CardActions';
import { CardSkeleton } from './CardSkeleton';

type CardProps = {
  src?: string;
  image?: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  onPlay?: () => void;
  menuItems?: ReactNode;
  labels?: CardLabels;
  isLoading?: boolean;
  imageReveal?: boolean;
};

const CardBase: FC<CardProps> = ({
  src,
  image,
  title,
  subtitle,
  className,
  onClick,
  onPlay,
  menuItems,
  labels,
  isLoading,
  imageReveal = true,
}) => (
  <div
    data-testid="card-container"
    className={cn('group relative w-42', className)}
  >
    <Button
      data-testid="card"
      size="flexible"
      className="surface-card group-hover:translate-x-shadow-x group-hover:translate-y-shadow-y flex w-full flex-col items-stretch gap-2 p-2 text-left group-hover:shadow-none"
      onClick={onClick}
    >
      <Box
        variant="primary"
        shadow="none"
        className="surface-card relative aspect-square w-full items-center justify-center overflow-hidden p-0"
      >
        {image ?? (
          <ImageReveal
            enabled={imageReveal}
            src={src}
            alt={title}
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover"
            placeholder={
              <CassetteTape
                size={96}
                absoluteStrokeWidth
                className="opacity-20"
              />
            }
          />
        )}
      </Box>

      {(title || subtitle) && (
        <div className="min-w-0">
          {title && (
            <div
              data-testid="card-title"
              className="text-card-foreground truncate text-sm font-bold"
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div className="text-card-foreground truncate text-xs opacity-60">
              {subtitle}
            </div>
          )}
        </div>
      )}
    </Button>

    {(onPlay || menuItems) && (
      <CardActions
        onPlay={onPlay}
        menuItems={menuItems}
        labels={labels}
        isLoading={isLoading}
      />
    )}
  </div>
);

export const Card = Object.assign(CardBase, { Skeleton: CardSkeleton });
