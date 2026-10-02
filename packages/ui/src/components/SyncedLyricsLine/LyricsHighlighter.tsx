import { FC, ReactNode } from 'react';

type LyricsHighlighterProps = {
  progress: number;
  children: ReactNode;
};

export const LyricsHighlighter: FC<LyricsHighlighterProps> = ({
  progress,
  children,
}) => (
  <span
    className="to-primary bg-linear-to-b from-transparent from-60% to-60% bg-no-repeat transition-all duration-300 ease-linear"
    style={{ backgroundSize: `${progress * 100}%` }}
  >
    {children}
  </span>
);
