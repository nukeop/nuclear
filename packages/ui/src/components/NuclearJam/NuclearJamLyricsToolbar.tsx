import find from 'lodash-es/find';
import isNil from 'lodash-es/isNil';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { FC } from 'react';

import { isSyncedLyricsType } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { LyricsSource, LyricsSourcePicker, LyricsTypeLabels } from '../Lyrics';
import { Stepper } from '../Stepper';

export type NuclearJamLyricsToolbarLabels = {
  types: LyricsTypeLabels;
  showEarlier: string;
  showLater: string;
};

export type NuclearJamLyricsToolbarProps = {
  sources: LyricsSource[];
  selectedSourceId: string;
  onSelectSource: (sourceId: string) => void;
  offsetValue: string;
  onShowEarlier: () => void;
  onShowLater: () => void;
  labels: NuclearJamLyricsToolbarLabels;
  className?: string;
};

const isSyncedSource = (source: LyricsSource | undefined) =>
  !isNil(source) && isSyncedLyricsType(source.type);

export const NuclearJamLyricsToolbar: FC<NuclearJamLyricsToolbarProps> = ({
  sources,
  selectedSourceId,
  onSelectSource,
  offsetValue,
  onShowEarlier,
  onShowLater,
  labels,
  className,
}) => (
  <div
    className={cn(
      'border-border flex shrink-0 items-center gap-2 border-b-(length:--border-width) px-4 py-2',
      className,
    )}
    data-testid="jam-lyrics-toolbar"
  >
    <LyricsSourcePicker
      data-testid="jam-lyrics-source-picker"
      className="min-w-0 flex-1"
      sources={sources}
      value={selectedSourceId}
      onValueChange={onSelectSource}
      typeLabels={labels.types}
    />
    {isSyncedSource(find(sources, { id: selectedSourceId })) && (
      <Stepper
        data-testid="jam-lyrics-offset"
        className="shrink-0"
        value={offsetValue}
        decrementIcon={<MinusIcon size={14} />}
        incrementIcon={<PlusIcon size={14} />}
        onDecrement={onShowEarlier}
        onIncrement={onShowLater}
        labels={{
          decrement: labels.showEarlier,
          increment: labels.showLater,
        }}
      />
    )}
  </div>
);
