import { useNavigate } from '@tanstack/react-router';
import { EllipsisIcon, Trash2Icon } from 'lucide-react';
import { FC, useState } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Dialog, Input, Popover, QueuePanel } from '@nuclearplayer/ui';

import { useCurrentQueueItem } from '../hooks/useCurrentQueueItem';
import { useQueue } from '../hooks/useQueue';
import { useQueueActions } from '../hooks/useQueueActions';
import { usePlaylistStore } from '../stores/playlistStore';

type ConnectedQueuePanelProps = {
  isCollapsed?: boolean;
};

export const ConnectedQueuePanel: FC<ConnectedQueuePanelProps> = ({
  isCollapsed = false,
}) => {
  const { t } = useTranslation('queue');
  const queue = useQueue();
  const currentItem = useCurrentQueueItem();
  const actions = useQueueActions();

  const handleReorder = (fromIndex: number, toIndex: number) => {
    actions.reorder(fromIndex, toIndex);
  };

  const handleSelectItem = (itemId: string) => {
    actions.goToId(itemId);
  };

  const handleRemoveItem = (itemId: string) => {
    actions.removeByIds([itemId]);
  };

  return (
    <QueuePanel
      items={queue.items}
      currentItemId={currentItem?.id}
      isCollapsed={isCollapsed}
      reorderable={!isCollapsed}
      onReorder={handleReorder}
      onSelectItem={handleSelectItem}
      onRemoveItem={handleRemoveItem}
      labels={{
        emptyTitle: t('empty.title'),
        emptySubtitle: t('empty.subtitle'),
        removeButton: t('actions.remove'),
        playbackError: t('errors.playback'),
        noCandidates: t('candidates.empty'),
        candidateFailed: t('candidates.failed'),
      }}
    />
  );
};

export const QueueHeaderActions: FC = () => {
  const { t } = useTranslation('queue');
  const { t: tPlaylists } = useTranslation('playlists');
  const navigate = useNavigate();
  const queue = useQueue();
  const { clearQueue } = useQueueActions();
  const saveQueueAsPlaylist = usePlaylistStore(
    (state) => state.saveQueueAsPlaylist,
  );

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const handleSaveAsPlaylist = async () => {
    if (!playlistName.trim()) {
      return;
    }
    const playlistId = await saveQueueAsPlaylist(playlistName.trim());
    setSaveDialogOpen(false);
    setPlaylistName('');
    navigate({ to: '/playlists/$playlistId', params: { playlistId } });
  };

  if (queue.items.length === 0) {
    return null;
  }

  return (
    <>
      <Button size="icon" data-testid="clear-queue-button" onClick={clearQueue}>
        <Trash2Icon />
      </Button>
      <Popover
        className="relative"
        trigger={
          <Button size="icon" data-testid="queue-more-button">
            <EllipsisIcon />
          </Button>
        }
        anchor="bottom end"
      >
        <Popover.Menu>
          <Popover.Item
            onClick={() => setSaveDialogOpen(true)}
            data-testid="save-queue-as-playlist"
          >
            {t('actions.saveAsPlaylist')}
          </Popover.Item>
        </Popover.Menu>
      </Popover>
      <Dialog.Root
        isOpen={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSaveAsPlaylist();
          }}
        >
          <Dialog.Title>{t('actions.saveAsPlaylist')}</Dialog.Title>
          <div className="mt-4">
            <Input
              label={tPlaylists('name')}
              placeholder={tPlaylists('namePlaceholder')}
              value={playlistName}
              onChange={(event) => setPlaylistName(event.target.value)}
              data-testid="save-queue-playlist-name-input"
              autoFocus
            />
          </div>
          <Dialog.Actions>
            <Dialog.Close>{t('common:actions.cancel')}</Dialog.Close>
            <Button type="submit">{t('common:actions.save')}</Button>
          </Dialog.Actions>
        </form>
      </Dialog.Root>
    </>
  );
};
