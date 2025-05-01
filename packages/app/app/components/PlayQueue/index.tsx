import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import _, { head } from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TFunction, useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';
import { areEqual, FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Playlist } from '@nuclear/core';
import { StreamData } from '@nuclear/core/src/plugins/plugins.types';
import { formatDuration, QueueItem } from '@nuclear/ui';

import { PluginsState } from '../../reducers/plugins';
import { QueueItem as QueueItemType, QueueStore } from '../../reducers/queue';
import { SettingsState } from '../../reducers/settings';
import { safeAddUuid } from '../../actions/helpers';
import QueueMenu from './QueueMenu';
import { PlayQueueActions } from '../../containers/PlayQueueContainer';
import QueuePopupContainer from '../../containers/QueuePopupContainer';
import { StreamVerificationContainer } from '../../containers/StreamVerificationContainer';

import styles from './styles.scss';
import { QueueItemClone } from './QueueItemClone';

type PlayQueueProps = {
  actions: PlayQueueActions;
  playlists?: Playlist[];
  plugins: PluginsState;
  settings: SettingsState;
  queue: QueueStore;
}

type QueueRowProps = {
  data: {
    settings: SettingsState;
    queue: QueueStore;
    openPopupQueueId: string | null;
    setOpenPopupQueueId: React.Dispatch<React.SetStateAction<string | null>>;
    onSelectTrack: (index: number) => () => void;
    onRemoveTrack: (index: number) => () => void;
    onReloadTrack: (index: number) => () => void;
    onSelectStream: (index: number) => (stream: StreamData) => void;
    t: TFunction;
  };
  index: number;
  style: Object
};

const formatTrackDuration = (t: TFunction) => (track: QueueItemType) => formatDuration(head(track.streams)?.duration) === '00:00' &&
  !track.loading &&
  Boolean(track.streams)
  ? t('live')
  : formatDuration(head(track.streams)?.duration);

const QueueRow = React.memo(({ data, index, style }: QueueRowProps) => {
  const {
    queue,
    settings,
    openPopupQueueId,
    setOpenPopupQueueId,
    onSelectTrack,
    onRemoveTrack,
    onReloadTrack,
    onSelectStream,
    t
  } = data;
  const item = queue.queueItems[index] as QueueItemType;

  const handleRequestOpen = useCallback(() => {
    if (item.queueId) {
      setOpenPopupQueueId(item.queueId);
    }
  }, [setOpenPopupQueueId, item.queueId]);

  const handleRequestClose = useCallback(() => {
    setOpenPopupQueueId(null);
  }, [setOpenPopupQueueId]);

  return (
    <Draggable
      key={item.uuid}
      draggableId={item.uuid}
      index={index}
    >
      {(draggableProvided, draggableSnapshot) => {
        return (
          <div
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
            style={style ? {
              ...draggableProvided.draggableProps.style,
              ...style
            } : draggableProvided.draggableProps.style}
          >
            <QueuePopupContainer
              trigger={
                <QueueItem
                  isCompact={settings.compactQueueBar as boolean}
                  isCurrent={queue.currentTrack === index}
                  track={item}
                  duration={formatTrackDuration(t)(item)}
                  onSelect={onSelectTrack(index)}
                  onRemove={onRemoveTrack(index)}
                  onReload={onReloadTrack(index)}
                />
              }
              isQueueItemCompact={settings.compactQueueBar as boolean}
              index={index}
              track={item}
              onSelectStream={onSelectStream(index)}
              copyTrackUrlLabel={t('copy-track-url')}
              isOpen={openPopupQueueId === item.queueId}
              onRequestOpen={handleRequestOpen}
              onRequestClose={handleRequestClose}
            />
          </div>
        );
      }}
    </Draggable>
  );
}, areEqual);

const PlayQueue: React.FC<PlayQueueProps> = ({
  actions: {
    queueDrop,
    repositionSong,
    addToDownloads,
    selectNewStream,
    info,
    success,
    selectSong,
    removeFromQueue,
    clearQueue,
    resetPlayer,
    addFavoriteTrack,
    addPlaylist,
    updatePlaylist,
    toggleOption,
    reloadTrack
  },
  playlists,
  plugins,
  queue,
  settings
}) => {
  const { t } = useTranslation('queue');
  const [isFileHovered, setFileHovered] = useState(false);
  const [openPopupQueueId, setOpenPopupQueueId] = useState<string | null>(null);

  const onDropFile = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const paths = [];

    for (const f of event.dataTransfer.files) {
      paths.push(f.path);
    }

    setFileHovered(false);
    queueDrop(paths);
  };

  const onDragOverFile = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setFileHovered(true);
  };

  const onDragEndFile = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setFileHovered(false);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    // when dragging to non droppable area or back to same position
    if (!destination || source.index === destination.index) {
      return;
    }

    repositionSong(
      result.source.index,
      result.destination.index
    );
  };

  const onAddToDownloads = (track: QueueItemType) => {
    const clonedTrack = safeAddUuid(track);
    const artistName = _.isString(track?.artist)
      ? track?.artist
      : track?.artist?.name;
    addToDownloads(plugins.plugins.streamProviders, clonedTrack);
    info(
      t('download-toast-title'),
      t('download-toast-content', { artist: artistName, title: track.name }),
      <img src={track.thumbnail} />,
      settings
    );
  };

  // When a new stream is selected from the track context menu
  const onSelectStream = useCallback((index: number) => (stream: StreamData) => {
    selectNewStream(index, stream.id);
    setOpenPopupQueueId(null);
  }, [selectNewStream, setOpenPopupQueueId]);

  // When a track is switched to e.g. by double clicking
  const onSelectTrack = useCallback((index: number) => () => {
    selectSong(index);
    setOpenPopupQueueId(null);
  }, [selectSong, setOpenPopupQueueId]);

  // When a track is removed from the queue
  const onRemoveTrack = useCallback((index: number) => () => {
    removeFromQueue(index);
    if (queue.queueItems.length === 1) {
      resetPlayer();
    }
    setOpenPopupQueueId(null);
  }, [removeFromQueue, resetPlayer, queue.queueItems.length, setOpenPopupQueueId]);

  // When a track is reloaded after it gets locked for subsequent stream lookup failures
  const onReloadTrack = useCallback((index: number) => () => reloadTrack(index), [reloadTrack]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        onDragOver={onDragOverFile}
        onDrop={onDropFile}
        onDragLeave={onDragEndFile}
        className={classnames(styles.play_queue_container, { compact: settings.compactQueueBar })}
      >
        <QueueMenu
          clearQueue={clearQueue}
          resetPlayer={resetPlayer}
          addPlaylist={addPlaylist}
          updatePlaylist={updatePlaylist}
          toggleOption={toggleOption}
          addFavoriteTrack={addFavoriteTrack}
          addToDownloads={onAddToDownloads}
          currentTrack={queue.currentTrack}
          success={success}
          settings={settings}
          playlists={playlists}
          items={queue.queueItems}
          compact={Boolean(settings.compactQueueBar)}
        />

        <Droppable
          droppableId='play_queue'
          mode='virtual'
          renderClone={QueueItemClone({
            settings,
            queue,
            onSelectTrack,
            onRemoveTrack,
            onReloadTrack,
            formatTrackDuration: formatTrackDuration(t)
          })}
        >
          {(droppableProvided, snapshot) => (
            <div
              className={classnames(styles.play_queue_items, {
                [styles.file_dragged_over]: isFileHovered,
                [styles.track_dragged_over]: snapshot.isDraggingOver
              })}
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              <AutoSizer>
                {({ height, width }) => <List
                  height={height}
                  width={width}
                  itemSize={settings.compactQueueBar ? 42 : 64}
                  itemCount={queue.queueItems.length}
                  overscanCount={2}
                  itemData={{
                    queue,
                    settings,
                    openPopupQueueId,
                    setOpenPopupQueueId,
                    onSelectTrack,
                    onRemoveTrack,
                    onReloadTrack,
                    onSelectStream,
                    t
                  }}
                >
                  {QueueRow}
                </List>}
              </AutoSizer>
              {isFileHovered && (
                <Icon name='plus' className={styles.file_icon} />
              )}
            </div>
          )}
        </Droppable>
        {
          settings?.useStreamVerification &&
          <StreamVerificationContainer />
        }
      </div>
    </DragDropContext>
  );
};

export default PlayQueue;
