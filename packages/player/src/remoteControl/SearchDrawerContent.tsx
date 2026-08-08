import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Track } from '@nuclearplayer/model';
import { CenteredLoader, NuclearJam } from '@nuclearplayer/ui';

type SearchDrawerContentProps = {
  isError: boolean;
  isSuccess: boolean;
  tracks: Track[];
  onAdd: (track: Track) => void;
};

export const SearchDrawerContent: FC<SearchDrawerContentProps> = ({
  isError,
  isSuccess,
  tracks,
  onAdd,
}) => {
  const { t } = useTranslation('remote');

  if (isError) {
    return (
      <NuclearJam.SearchDrawer.Error
        labels={{
          title: t('search.errorTitle'),
          description: t('search.errorDescription'),
        }}
      />
    );
  }
  if (!isSuccess) {
    return <CenteredLoader />;
  }
  if (tracks.length === 0) {
    return (
      <NuclearJam.SearchDrawer.Empty
        labels={{
          title: t('search.emptyTitle'),
          description: t('search.emptyDescription'),
        }}
      />
    );
  }
  return (
    <NuclearJam.SearchDrawer.Results>
      {tracks.map((track) => (
        <NuclearJam.SearchResultTrack
          key={`${track.source.provider}:${track.source.id}`}
          track={track}
          onAdd={onAdd}
        />
      ))}
    </NuclearJam.SearchDrawer.Results>
  );
};
