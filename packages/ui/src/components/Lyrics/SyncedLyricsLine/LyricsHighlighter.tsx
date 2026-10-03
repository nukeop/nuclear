import { ComponentProps, FC } from 'react';

import { cn } from '../../../utils';

type LyricsHighlighterProps = ComponentProps<'span'> & {
  progress: number;
};

export const LyricsHighlighter: FC<LyricsHighlighterProps> = ({
  progress,
  className,
  ...props
}) => (
  <span
    className={cn(
      'to-primary bg-linear-to-b from-transparent from-60% to-60% bg-no-repeat transition-all duration-300 ease-linear',
      className,
    )}
    style={{ backgroundSize: `${progress * 100}%` }}
    {...props}
  />
);
