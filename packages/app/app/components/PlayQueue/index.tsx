import React, { useState } from 'react';
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
  };
  index: number;
  style: Object
};

const formatTrackDuration = (t: TFunction) => (track: QueueItemType) => formatDuration(head(track.streams)?.duration) === '00:00' &&
  !track.loading &&
  Boolean(track.streams)
  ? t('live')
  : formatDuration(head(track.streams)?.duration);

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
    toggleOption
  },
  playlists,
  plugins,
  queue,
  settings
}) => {
  const { t } = useTranslation('queue');
  const [isFileHovered, setFileHovered] = useState(false);

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
    const artistName = track.artists?.[0];
    addToDownloads(plugins.plugins.streamProviders, clonedTrack);
    info(
      t('download-toast-title'),
      t('download-toast-content', { artist: artistName, title: track.name }),
      <img src={track.thumbnail} />,
      settings
    );
  };

  // When a new stream is selected from the track context menu
  const onSelectStream = (index: number) => (stream: StreamData) => {
    selectNewStream(index, stream.id);
  };

  // When a track is switched to e.g. by double clicking
  const onSelectTrack = (index: number) => () => {
    selectSong(index);
  };

  // When a track is removed from the queue
  const onRemoveTrack = (index: number) => () => {
    removeFromQueue(index);
    if (queue.queueItems.length === 1) {
      resetPlayer();
    }
  };

  const QueueRow = React.memo(({ data, index, style }: QueueRowProps) => {
    const item = data.queue.queueItems[index] as QueueItemType;
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
                    isCompact={data.settings.compactQueueBar as boolean}
                    isCurrent={data.queue.currentSong === index}
                    track={item}
                    onSelect={onSelectTrack(index)}
                    onRemove={onRemoveTrack(index)}
                    duration={formatTrackDuration(t)(item)}
                  />
                }
                isQueueItemCompact={data.settings.compactQueueBar}
                index={index}
                track={item}
                onSelectStream={onSelectStream(index)}
                copyTrackUrlLabel={t('copy-track-url')} />
            </div>
          );
        }}
      </Draggable>
    );
  }, areEqual);

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
          currentSong={queue.currentSong}
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
            formatTrackDuration: formatTrackDuration(t)
          })}
        >
          {(droppableProvided, snapshot) => (
            <div
              className={classnames(styles.play_queue_items, styles.fade_in, {
                [styles.file_dragged_over]: isFileHovered,
                [styles.track_dragged_over]: snapshot.isDraggingOver
              })}
              {...droppableProvided.droppableProps}
            >
              <AutoSizer>
                {({ height, width }) => <List
                  height={height}
                  width={width}
                  itemSize={settings.compactQueueBar ? 42 : 64}
                  itemCount={queue.queueItems.length}
                  overscanCount={2}
                  itemData={{ queue, settings }}
                  outerRef={droppableProvided.innerRef}
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
