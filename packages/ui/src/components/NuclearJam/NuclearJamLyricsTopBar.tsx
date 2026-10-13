import { ArrowLeft } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button';

export type NuclearJamLyricsTopBarLabels = {
  back: string;
};

export type NuclearJamLyricsTopBarProps = {
  title?: string;
  artist?: string;
  onBack: () => void;
  labels: NuclearJamLyricsTopBarLabels;
  className?: string;
};

export const NuclearJamLyricsTopBar: FC<NuclearJamLyricsTopBarProps> = ({
  title,
  artist,
  onBack,
  labels,
  className,
}) => (
  <div
    className={cn(
      'border-border flex shrink-0 items-center gap-3 border-b-(length:--border-width) px-4 py-3',
      className,
    )}
    data-testid="jam-lyrics-top-bar"
  >
    <Button
      size="icon"
      aria-label={labels.back}
      onClick={onBack}
      data-testid="jam-lyrics-back-button"
      className="shrink-0"
    >
      <ArrowLeft size={20} />
    </Button>
    <div className="min-w-0 flex-1">
      {title && (
        <div
          className="text-foreground truncate text-base font-black"
          data-testid="jam-lyrics-top-bar-title"
        >
          {title}
        </div>
      )}
      {artist && (
        <div
          className="text-foreground/60 truncate text-xs"
          data-testid="jam-lyrics-top-bar-artist"
        >
          {artist}
        </div>
      )}
    </div>
  </div>
);
