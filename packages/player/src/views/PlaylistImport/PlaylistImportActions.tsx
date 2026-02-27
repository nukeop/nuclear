import {
  EllipsisVerticalIcon,
  PlayIcon,
  PlusIcon,
  SaveIcon,
} from 'lucide-react';
import type { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Track } from '@nuclearplayer/model';
import { Button, Popover } from '@nuclearplayer/ui';

import { useQueueActions } from '../../hooks/useQueueActions';
import { useSoundStore } from '../../stores/soundStore';

type PlaylistImportActionsProps = {
  tracks: Track[];
  onSaveLocally: () => void;
};

export const PlaylistImportActions: FC<PlaylistImportActionsProps> = ({
  tracks,
  onSaveLocally,
}) => {
  const { t } = useTranslation('playlists');
  const { addToQueue, clearQueue } = useQueueActions();

  const handlePlayAll = () => {
    clearQueue();
    addToQueue(tracks);
    useSoundStore.getState().play();
  };

  const handleAddToQueue = () => {
    addToQueue(tracks);
  };

  return (
    <div className="mb-6 flex items-center gap-2">
      <Button onClick={handlePlayAll} data-testid="play-all-button">
        <PlayIcon size={16} />
        {t('play')}
      </Button>
      <Popover
        className="relative"
        panelClassName="bg-background px-0 py-0"
        trigger={
          <Button size="icon" data-testid="playlist-actions-button">
            <EllipsisVerticalIcon size={16} />
          </Button>
        }
        anchor="bottom start"
      >
        <Popover.Menu>
          <Popover.Item
            icon={<SaveIcon size={16} />}
            onClick={onSaveLocally}
            data-testid="save-locally-action"
          >
            {t('saveLocally')}
          </Popover.Item>
          <Popover.Item
            icon={<PlusIcon size={16} />}
            onClick={handleAddToQueue}
            data-testid="add-to-queue-action"
          >
            {t('addToQueue')}
          </Popover.Item>
        </Popover.Menu>
      </Popover>
    </div>
  );
};
