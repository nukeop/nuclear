import { MinusIcon, PlusIcon } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';
import { Stepper, SyncedLyrics } from '@nuclearplayer/ui';

import { useSoundStore } from '../../../stores/soundStore';
import { secondsToMs } from '../../../utils/time';
import { useLyricsOffset } from '../hooks/useLyricsOffset';

type ConnectedSyncedLyricsProps = {
  lyrics: LineSyncedLyrics | WordSyncedLyrics;
};

export const ConnectedSyncedLyrics: FC<ConnectedSyncedLyricsProps> = ({
  lyrics,
}) => {
  const { t } = useTranslation('lyrics');
  const positionSeconds = useSoundStore((state) => state.seek);
  const seekTo = useSoundStore((state) => state.seekTo);
  const { offsetMs, showEarlier, showLater } = useLyricsOffset();

  return (
    <>
      <div className="flex h-14 shrink-0 items-center justify-end gap-1.5">
        <Stepper
          data-testid="lyrics-offset-controls"
          value={t('offsetValue', { offset: offsetMs / 1000 })}
          decrementIcon={<MinusIcon size={14} />}
          incrementIcon={<PlusIcon size={14} />}
          onDecrement={showEarlier}
          onIncrement={showLater}
          labels={{
            decrement: t('showEarlier'),
            increment: t('showLater'),
          }}
        />
      </div>
      <SyncedLyrics
        data-testid="lyrics-content"
        className="flex-1"
        lyrics={lyrics}
        positionMs={secondsToMs(positionSeconds) - offsetMs}
        onSeek={(positionMs) => seekTo((positionMs + offsetMs) / 1000)}
        labels={{ currentLine: t('currentLine') }}
      />
    </>
  );
};
