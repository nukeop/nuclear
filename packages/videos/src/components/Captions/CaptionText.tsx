import { FC } from 'react';

import { cn } from '@nuclearplayer/ui';

import { captionTextClassName } from './captionTextClassName';

type CaptionTextProps = {
  text: string;
  width: number;
  offset: number;
  opacity: number;
};

export const CaptionText: FC<CaptionTextProps> = ({
  text,
  width,
  offset,
  opacity,
}) => (
  <div className="absolute inset-0 flex items-center justify-center">
    <p
      className={cn(captionTextClassName, 'shrink-0')}
      style={{ width, opacity, transform: `translateY(${offset}px)` }}
    >
      {text}
    </p>
  </div>
);
