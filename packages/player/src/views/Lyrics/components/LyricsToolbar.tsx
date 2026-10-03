import { MinusIcon, PlusIcon } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Lyrics } from '@nuclearplayer/model';
import { Stepper } from '@nuclearplayer/ui';

type LyricsToolbarProps = {
  lyrics: Lyrics | undefined;
  offsetMs: number;
  onShowEarlier: () => void;
  onShowLater: () => void;
};

export const LyricsToolbar: FC<LyricsToolbarProps> = ({
  lyrics,
  offsetMs,
  onShowEarlier,
  onShowLater,
}) => {
  const { t } = useTranslation('lyrics');
  const isSynced =
    lyrics?.type === 'lineSynced' || lyrics?.type === 'wordSynced';

  return (
    <div className="flex h-14 shrink-0 items-center justify-end gap-1.5 px-10">
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
