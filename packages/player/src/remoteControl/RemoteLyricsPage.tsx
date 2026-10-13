import { useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { NuclearJam } from '@nuclearplayer/ui';

import { RemoteLyricsForTrack } from './RemoteLyricsForTrack';
import { indexRoute } from './remoteRoutes';
import { useRemoteActions } from './useRemoteActions';
import { useRemoteCurrentItem } from './useRemoteCurrentItem';
import { useRemoteLyrics } from './useRemoteLyrics';

export const RemoteLyricsPage: FC = () => {
  const { t } = useTranslation('remote');
  const currentItem = useRemoteCurrentItem();
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const lyrics = useRemoteLyrics();
  const actions = useRemoteActions();

  const goBack = () => {
    if (canGoBack) {
      router.history.back();
      return;
    }
    void navigate({ to: indexRoute.to, replace: true });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col" data-testid="jam-lyrics-page">
      <NuclearJam.LyricsTopBar
        title={currentItem?.track.title}
        artist={currentItem?.track.artists[0]?.name}
        onBack={goBack}
        labels={{ back: t('lyrics.back') }}
      />
      <RemoteLyricsForTrack
        key={currentItem?.id}
        lyrics={lyrics}
        onSeekToSeconds={actions.onSeekToSeconds}
      />
    </div>
  );
};
