import { cva, VariantProps } from 'class-variance-authority';
import { Heart } from 'lucide-react';
import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button';

const favoriteButtonVariants = cva('', {
  variants: {
    size: {
      sm: '',
      default: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const iconSizes = {
  sm: 16,
  default: 24,
} as const;

const buttonSizes = {
  sm: 'icon-sm',
  default: 'icon',
} as const;

type FavoriteButtonProps = Omit<ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof favoriteButtonVariants> & {
    isFavorite: boolean;
    onToggle: () => void;
    ariaLabelAdd: string;
    ariaLabelRemove: string;
  };

export const FavoriteButton: FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  size = 'default',
  className,
  ariaLabelAdd,
  ariaLabelRemove,
  ...props
}) => {
  const resolvedSize = size ?? 'default';

  return (
    <Button
      size={buttonSizes[resolvedSize]}
      variant="text"
      className={cn(favoriteButtonVariants({ size, className }))}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isFavorite ? ariaLabelRemove : ariaLabelAdd}
      {...props}
    >
      <Heart
        size={iconSizes[resolvedSize]}
        className={cn(
          'transition-colors',
          isFavorite
            ? 'fill-accent-red text-accent-red'
            : 'text-muted-foreground hover:text-foreground',
        )}
      />
    </Button>
  );
};
