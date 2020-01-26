import React from 'react';
import classnames from 'classnames';
import { ipcRenderer } from 'electron';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { withState, compose } from 'recompose';

import { QueueItem, QueuePopup, formatDuration } from '@nuclear/ui';

import { getTrackDuration, getSelectedStream } from '../../utils';
import { sendPaused } from '../../mpris';
import { safeAddUuid } from '../../actions/helpers';
import styles from './styles.scss';

import QueueMenu from './QueueMenu';

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

    this.props.actions.repositionSong(result.source.index, result.destination.index);
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
      <img src={track.thumbnail}/>,
      settings
    );
  }

  handleRerollTrack = (track) => {
    let musicSource = this.props.plugins.plugins.streamProviders.find(
      s => s.sourceName === (track.selectedStream || this.props.plugins.selected.streamProviders)
    );
  
    if (track.failed) {
      musicSource = this.props.plugins.plugins.streamProviders.find(
        s => s.sourceName === musicSource.fallback
      );
    }

    const selectedStream = getSelectedStream(
      track.streams,
      musicSource.sourceName
    );

    this.props.actions.rerollTrack(musicSource, selectedStream, track);
  }

  getSelectedStream(track) {
    const { plugins } = this.props;
    let fallbackStreamProvider;
  
    if (track.failed) {
      const defaultStreamProvider = plugins.plugins.streamProviders.find(({ sourceName }) => {
        return sourceName === plugins.selected.streamProviders;
      });
      fallbackStreamProvider = plugins.plugins.streamProviders.find(({ sourceName }) => {
        return sourceName === defaultStreamProvider.fallback;
      });
    }
    return getSelectedStream(
      track.streams,
      track.failed
        ? fallbackStreamProvider.sourceName
        : track.selectedStream || this.props.plugins.selected.streamProviders
    );
  }

  handleSelectStream = ({ track, stream }) => {
    this.props.actions.changeTrackStream(track, stream);
  }

  renderQueueItems() {
    if (!this.props.items) {
      return null;
    }

    const dropdownOptions = _.map(this.props.plugins.plugins.streamProviders, s => ({
      key: s.sourceName,
      text: s.sourceName,
      value: s.sourceName,
      content: s.sourceName
    }));

    return this.props.items.map((el, i) => {
      return (
        <Draggable key={`${el.uuid}+${i}`} index={i} draggableId={`${el.uuid}+${i}`}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <QueuePopup
                trigger={
                  <QueueItem
                    index={i}
                    track={el}
                    isLoading={el.loading}
                    isCompact={this.props.compact}
                    isCurrent={this.props.currentSong === i}
                    selectSong={this.props.actions.selectSong}
                    removeFromQueue={this.props.actions.removeFromQueue}
                    duration={
                      formatDuration(
                        getTrackDuration(
                          el,
                          this.props.plugins.selected.streamProviders
                        )
                      )
                    }
                    resetPlayer={this.props.items.length === 1 ? this.props.actions.resetPlayer : undefined}
                    sendPaused={sendPaused}
                  />
                }
                onRerollTrack={this.handleRerollTrack}
                onSelectStream={this.handleSelectStream}
                track={el}
                selectedStream={this.getSelectedStream(el)}
                dropdownOptions={dropdownOptions}
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
          className={classnames(
            styles.play_queue_container,
            {compact}
          )}
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
                className={
                  classnames(
                    styles.play_queue_items,
                    styles.fade_in,
                    {
                      [styles.file_dragged_over]: isFileHovered,
                      [styles.track_dragged_over]: snapshot.isDraggingOver
                    }
                  )
                }
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

export default compose(
  withState('isFileHovered', 'setFileHovered', false)
)(PlayQueue);
