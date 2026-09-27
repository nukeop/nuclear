import { FC } from 'react';
import { AbsoluteFill } from 'remotion';

import { cn } from '@nuclearplayer/ui';

import { Enter } from '../Enter';

type CaptionProps = {
  text: string;
  className?: string;
};

export const Caption: FC<CaptionProps> = ({ text, className }) => (
  <AbsoluteFill className="items-center justify-end px-8 pb-12">
    <Enter>
      <p
        className={cn(
          'border-border bg-card text-card-foreground shadow-shadow max-w-4xl rounded-md border-(length:--border-width) px-6 py-3 text-center text-xl leading-snug',
          className,
        )}
      >
        {text}
      </p>
    </Enter>
  </AbsoluteFill>
);
