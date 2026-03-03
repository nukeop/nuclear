import { CassetteTape } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { Box } from '../Box';
import { Button } from '../Button';
import { ImageReveal } from '../ImageReveal';

type CardProps = {
  src?: string;
  image?: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  imageReveal?: boolean;
};

export const Card: FC<CardProps> = ({
  src,
  image,
  title,
  subtitle,
  className,
  onClick,
  imageReveal = true,
}) => (
  <Button
    data-testid="card"
    size="flexible"
    className={cn(
      'flex w-42 flex-col items-stretch gap-2 p-2 text-left',
      className,
    )}
    onClick={onClick}
  >
    <Box
      variant="primary"
      shadow="none"
      className="relative aspect-square w-full items-center justify-center overflow-hidden p-0"
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
              className="animate-pulse opacity-20"
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
            className="text-foreground truncate text-sm font-bold"
          >
            {title}
          </div>
        )}
        {subtitle && (
          <div className="text-foreground-secondary truncate text-xs">
            {subtitle}
          </div>
        )}
      </div>
    )}
  </Button>
);
