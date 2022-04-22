import React, { useState } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';

import { Playlist } from '@nuclear/core';
import { formatDuration, QueueItem } from '@nuclear/ui';

import { getTrackDuration } from '../../utils';
import { PluginsState } from '../../reducers/plugins';
import { QueueItem as QueueItemType, QueueStore } from '../../reducers/queue';
import { SettingsState } from '../../reducers/settings';
import { safeAddUuid } from '../../actions/helpers';
import { addToDownloads } from '../../actions/downloads';
import { addFavoriteTrack } from '../../actions/favorites';
import { resetPlayer } from '../../actions/player';
import { addPlaylist, updatePlaylist } from '../../actions/playlists';
import { clearQueue, queueDrop, removeFromQueue, repositionSong, selectSong } from '../../actions/queue';
import { toggleOption } from '../../actions/settings';
import { info, success } from '../../actions/toasts';
import QueueMenu from './QueueMenu';
import QueuePopupContainer from '../../containers/QueuePopupContainer';

import styles from './styles.scss';

type PlayQueueProps = {
  actions: {
    queueDrop: typeof queueDrop;
    repositionSong: typeof repositionSong;
    addToDownloads: typeof addToDownloads;
    info: typeof info;
    success: typeof success;
    selectSong: typeof selectSong;
    removeFromQueue: typeof removeFromQueue;
    clearQueue: typeof clearQueue;
    resetPlayer: typeof resetPlayer;
    addFavoriteTrack: typeof addFavoriteTrack;

    addPlaylist: typeof addPlaylist;
    updatePlaylist: typeof updatePlaylist;

    toggleOption: typeof toggleOption;
  };
  playlists?: Playlist[];
  plugins: PluginsState;
  settings: SettingsState;
  queue: QueueStore;
}

const PlayQueue: React.FC<PlayQueueProps> = ({
  actions: { 
    queueDrop,
    repositionSong,
    addToDownloads,
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
  const {t} = useTranslation('queue');
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

  const renderQueueItems = () => {
    if (!queue.queueItems) {
      return null;
    }

    return queue.queueItems.map((el, i) => {
      return (
        <Draggable
          key={`${el.uuid}+${i}`}
          index={i}
          draggableId={`${el.uuid}+${i}`}
        >
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <QueuePopupContainer
                trigger={
                  <QueueItem
                    index={i}
                    track={el}
                    isLoading={el.loading}
                    isCompact={settings.compactQueueBar}
                    isCurrent={queue.currentSong === i}
                    error={el.error}
                    selectSong={selectSong}
                    removeFromQueue={removeFromQueue}
                    duration={formatDuration(getTrackDuration(el, plugins.selected.streamProviders)) === '00:00' && !el.loading ? t('live') : formatDuration(getTrackDuration(el, plugins.selected.streamProviders))}
                    resetPlayer={queue.queueItems.length === 1 ? resetPlayer : undefined}
                  />
                }
                isQueueItemCompact={settings.compactQueueBar}
                index={i}
                track={el}
                titleLabel={t('title')}
                idLabel={t('id')}
                copyTrackUrlLabel={t('copy-track-url')}
                sourceLabel={t('source')}
              />
            </div>
          )}
        </Draggable>
      );
    });
  };

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
          compact={settings.compactQueueBar}
        />

        <Droppable droppableId='play_queue'>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={classnames(styles.play_queue_items, styles.fade_in, {
                [styles.file_dragged_over]: isFileHovered,
                [styles.track_dragged_over]: snapshot.isDraggingOver
              })}
              {...provided.droppableProps}
            >
              {renderQueueItems()}
              {provided.placeholder}
              {isFileHovered && (
                <Icon name='plus' className={styles.file_icon} />
              )}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default PlayQueue;
