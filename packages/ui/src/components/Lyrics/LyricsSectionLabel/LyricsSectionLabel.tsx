import { ComponentProps, FC } from 'react';

import { cn } from '../../../utils';

type LyricsSectionLabelProps = ComponentProps<'div'>;

export const LyricsSectionLabel: FC<LyricsSectionLabelProps> = ({
  className,
  ...props
}) => (
  <div
    data-testid="lyrics-section-label"
    className={cn(
      'text-foreground/60 py-1 text-xs font-bold tracking-widest uppercase',
      className,
    )}
    {...props}
  />
);
