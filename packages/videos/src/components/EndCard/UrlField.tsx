import { Search } from 'lucide-react';
import { FC } from 'react';

import { cn } from '@nuclearplayer/ui';

import { useTypedText } from './useTypedText';

type UrlFieldProps = {
  url: string;
  typingStartFrame: number;
};

export const UrlField: FC<UrlFieldProps> = ({ url, typingStartFrame }) => {
  const { typed, isCaretVisible } = useTypedText(url, typingStartFrame);

  return (
    <div className="surface-input border-border flex h-20 w-full items-center gap-4 rounded-md border-(length:--video-border-width) px-6">
      <Search className="text-muted-foreground size-8 shrink-0" />
      <span className="text-5xl leading-none whitespace-pre">{typed}</span>
      <span
        className={cn('bg-foreground -ml-3 h-12 w-1', {
          invisible: !isCaretVisible,
        })}
      />
    </div>
  );
};
