import React from 'react';
import classnames from 'classnames';
import { ipcRenderer } from 'electron';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { withState, compose } from 'recompose';

import { QueueItem, formatDuration } from '@nuclear/ui';

import { getTrackDuration } from '../../utils';
import { sendPaused } from '../../mpris';
import { safeAddUuid } from '../../actions/helpers';
import styles from './styles.scss';

import QueueMenu from './QueueMenu';
import QueuePopupContainer from '../../containers/QueuePopupContainer';

@withTranslation('queue')
class PlayQueue extends React.PureComponent {
  onDropFile = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const paths = [];

    for (let f of event.dataTransfer.files) {
      paths.push(f.path);
    }

    this.props.setFileHovered(false);

    ipcRenderer.send('queue-drop', paths);
  }

  onDragOverFile = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.setFileHovered(true);
  }

  onDragEndFile = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.setFileHovered(false);
  }

  onDragEnd = (result) => {
    const { source, destination } = result;
    // when dragging to non droppable area or back to same position
    if (!destination || source.index === destination.index) {
      return;
    }

    this.props.actions.repositionSong(
      result.source.index,
      result.destination.index
    );
  }

  onAddToDownloads = (track) => {
    const { actions, plugins, settings, t } = this.props;
    const { addToDownloads, info } = actions;

    const clonedTrack = safeAddUuid(track);
    const artistName = _.isString(_.get(track, 'artist'))
      ? _.get(track, 'artist')
      : _.get(track, 'artist.name');
    ipcRenderer.send('start-download', clonedTrack);
    addToDownloads(plugins.plugins.streamProviders, clonedTrack);
    info(
      t('download-toast-title'),
      t('download-toast-content', { artist: artistName, title: track.name }),
      <img src={track.thumbnail} />,
      settings
    );
  }

  renderQueueItems() {
    if (!this.props.items) {
      return null;
    }

    return this.props.items.map((el, i) => {
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
                    isCompact={this.props.compact}
                    isCurrent={this.props.currentSong === i}
                    selectSong={this.props.actions.selectSong}
                    removeFromQueue={this.props.actions.removeFromQueue}
                    duration={formatDuration(
                      getTrackDuration(
                        el,
                        this.props.plugins.selected.streamProviders
                      )
                    )}
                    resetPlayer={
                      this.props.items.length === 1
                        ? this.props.actions.resetPlayer
                        : undefined
                    }
                    sendPaused={sendPaused}
                  />
                }
                index={i}
                track={el}
                titleLabel={this.props.t('title')}
                idLabel={this.props.t('id')}
              />
            </div>
          )}
        </Draggable>
      );
    });
  }

  render() {
    let {
      compact,
      items,
      settings,
      playlists,
      currentSong,
      isFileHovered
    } = this.props;

    let {
      clearQueue,
      resetPlayer,
      addPlaylist,
      updatePlaylist,
      toggleOption,
      addFavoriteTrack,
      success
    } = this.props.actions;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div
          onDragOver={this.onDragOverFile}
          onDrop={this.onDropFile}
          onDragLeave={this.onDragEndFile}
          className={classnames(styles.play_queue_container, { compact })}
        >
          <QueueMenu
            clearQueue={clearQueue}
            resetPlayer={resetPlayer}
            addPlaylist={addPlaylist}
            updatePlaylist={updatePlaylist}
            toggleOption={toggleOption}
            addFavoriteTrack={addFavoriteTrack}
            addToDownloads={this.onAddToDownloads}
            currentSong={currentSong}
            success={success}
            settings={settings}
            playlists={playlists}
            items={items}
            compact={compact}
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
                {this.renderQueueItems()}
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
  }
}

export default compose(withState('isFileHovered', 'setFileHovered', false))(
  PlayQueue
);
