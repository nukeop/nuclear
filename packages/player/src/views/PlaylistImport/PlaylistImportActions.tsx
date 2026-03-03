import { SaveIcon } from 'lucide-react';
import type { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Track } from '@nuclearplayer/model';
import { Popover } from '@nuclearplayer/ui';

import { PlaylistActions } from '../PlaylistDetail/components/PlaylistActions';

type PlaylistImportActionsProps = {
  tracks: Track[];
  onSaveLocally: () => void;
};

export const PlaylistImportActions: FC<PlaylistImportActionsProps> = ({
  tracks,
  onSaveLocally,
}) => {
  const { t } = useTranslation('playlists');

  return (
    <PlaylistActions
      tracks={tracks}
      menuItems={
        <Popover.Item
          icon={<SaveIcon size={16} />}
          onClick={onSaveLocally}
          data-testid="save-locally-action"
        >
          {t('saveLocally')}
        </Popover.Item>
      }
    />
  );
};
