import { FC, ReactNode } from 'react';

import { cn } from '../../../utils';

type LyricsHighlighterProps = {
  progress: number;
  className?: string;
  children: ReactNode;
};

export const LyricsHighlighter: FC<LyricsHighlighterProps> = ({
  progress,
  className,
  children,
}) => (
  <span
    className={cn(
      'to-primary bg-linear-to-b from-transparent from-60% to-60% bg-no-repeat transition-all duration-300 ease-linear',
      className,
    )}
    style={{ backgroundSize: `${progress * 100}%` }}
  >
    {children}
  </span>
);
