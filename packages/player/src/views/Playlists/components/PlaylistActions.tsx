import { EllipsisVerticalIcon, PlayIcon, PlusIcon } from 'lucide-react';
import type { FC, ReactNode } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Track } from '@nuclearplayer/model';
import { Button, cn, Popover } from '@nuclearplayer/ui';

import { useQueueActions } from '../../../hooks/useQueueActions';
import { useSoundStore } from '../../../stores/soundStore';

type PlaylistActionsProps = {
  tracks: Track[];
  menuItems?: ReactNode;
  className?: string;
};

export const PlaylistActions: FC<PlaylistActionsProps> = ({
  tracks,
  menuItems,
  className,
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
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="secondary"
        onClick={handlePlayAll}
        data-testid="play-all-button"
      >
        <PlayIcon size={16} />
        {t('play')}
      </Button>
      <Popover
        className="relative"
        panelClassName="bg-background px-0 py-0"
        trigger={
          <Button
            variant="secondary"
            size="icon"
            data-testid="playlist-actions-button"
          >
            <EllipsisVerticalIcon size={16} />
          </Button>
        }
        anchor="bottom start"
      >
        <Popover.Menu>
          <Popover.Item
            icon={<PlusIcon size={16} />}
            onClick={handleAddToQueue}
            data-testid="add-to-queue-action"
          >
            {t('addToQueue')}
          </Popover.Item>
          {menuItems}
        </Popover.Menu>
      </Popover>
    </div>
  );
};
