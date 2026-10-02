import { cva } from 'class-variance-authority';
import { AlignLeft, List, LucideIcon, WholeWord } from 'lucide-react';
import { ComponentProps, FC } from 'react';

import type { LyricsType } from '@nuclearplayer/model';

import { cn } from '../../utils';

const ICONS: Record<LyricsType, LucideIcon> = {
  wordSynced: WholeWord,
  lineSynced: List,
  plain: AlignLeft,
};

const lyricsTypeBadgeVariants = cva(
  'border-border inline-flex flex-none items-center justify-center border-(length:--border-width) font-bold whitespace-nowrap',
  {
    variants: {
      variant: {
        expanded: 'h-6 gap-1 rounded-full pr-2 pl-1.5 text-xs',
        icon: 'size-5.5 rounded-md',
      },
      type: {
        wordSynced: 'bg-primary text-primary-foreground',
        lineSynced: 'bg-background text-foreground',
        plain: 'bg-muted text-muted-foreground',
      },
    },
  },
);

type LyricsTypeBadgeProps = Omit<ComponentProps<'span'>, 'children'> & {
  type: LyricsType;
  variant: 'expanded' | 'icon';
  label: string;
};

export const LyricsTypeBadge: FC<LyricsTypeBadgeProps> = ({
  type,
  variant,
  label,
  className,
  ...props
}) => {
  const Icon = ICONS[type];

  if (variant === 'icon') {
    return (
      <span
        role="img"
        aria-label={label}
        title={label}
        className={cn(lyricsTypeBadgeVariants({ variant, type, className }))}
        {...props}
      >
        <Icon className="size-3.5" />
      </span>
    );
  }

  return (
    <span
      className={cn(lyricsTypeBadgeVariants({ variant, type, className }))}
      {...props}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
};
