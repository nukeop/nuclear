import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import {
  AArrowDownIcon,
  AArrowUpIcon,
  MinusIcon,
  PlusIcon,
} from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { AttributedLyrics } from '@nuclearplayer/plugin-sdk';
import { LyricsSource, LyricsSourcePicker, Stepper } from '@nuclearplayer/ui';

import { useCoreSetting } from '../../../hooks/useCoreSetting';

type LyricsToolbarProps = {
  results: AttributedLyrics[];
  selectedResult: AttributedLyrics | undefined;
  onSelectProvider: (providerId: string) => void;
  offsetMs: number;
  onShowEarlier: () => void;
  onShowLater: () => void;
};

const toLyricsSources = ({
  providerId,
  providerName,
  lyrics,
}: AttributedLyrics): LyricsSource[] => {
  if (lyrics.type === 'instrumental') {
    return [];
  }
  return [{ id: providerId, name: providerName, type: lyrics.type }];
};

export const LyricsToolbar: FC<LyricsToolbarProps> = ({
  results,
  selectedResult,
  onSelectProvider,
  offsetMs,
  onShowEarlier,
  onShowLater,
}) => {
  const { t } = useTranslation('lyrics');
  const [textSize, setTextSize] = useCoreSetting<number>('lyrics.textSize');
  const sources = results.flatMap(toLyricsSources);
  const selectedType = selectedResult?.lyrics.type;
  const isSynced =
    selectedType === 'lineSynced' || selectedType === 'wordSynced';

  return (
    <div className="flex h-14 shrink-0 items-center gap-1.5 px-10">
      {!isEmpty(sources) && (
        <LyricsSourcePicker
          data-testid="lyrics-source-picker"
          sources={sources}
          value={selectedResult?.providerId ?? ''}
          onValueChange={onSelectProvider}
          typeLabels={{
            wordSynced: t('types.wordSynced'),
            lineSynced: t('types.lineSynced'),
            plain: t('types.plain'),
          }}
        />
      )}
      <span className="flex-1" />
      {!isEmpty(sources) && !isNil(textSize) && (
        <Stepper
          decrementIcon={<AArrowDownIcon size={15} />}
          incrementIcon={<AArrowUpIcon size={15} />}
          onDecrement={() => setTextSize(textSize - 1)}
          onIncrement={() => setTextSize(textSize + 1)}
          isDecrementDisabled={textSize === 0}
          isIncrementDisabled={textSize === 2}
          labels={{
            decrement: t('smaller'),
            increment: t('larger'),
          }}
        />
      )}
      {isSynced && (
        <Stepper
          data-testid="lyrics-offset-controls"
          value={t('offsetValue', { offset: offsetMs / 1000 })}
          decrementIcon={<MinusIcon size={14} />}
          incrementIcon={<PlusIcon size={14} />}
          onDecrement={onShowEarlier}
          onIncrement={onShowLater}
          labels={{
            decrement: t('showEarlier'),
            increment: t('showLater'),
          }}
        />
      )}
    </div>
  );
};
