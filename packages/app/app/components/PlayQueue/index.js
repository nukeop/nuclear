import React from 'react';
import classnames from 'classnames';
import { ipcRenderer } from 'electron';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import { safeAddUuid } from '../../actions/helpers';
import styles from './styles.scss';

import QueuePopup from '../QueuePopup';
import QueueItem from './QueueItem';
import QueueMenu from './QueueMenu';

@withTranslation('queue')
class PlayQueue extends React.Component {
  constructor(props){
    super(props);
  }

  onDragEnd(result) {
    this.props.actions.swapSongs(result.source.index, result.destination.index);
  }

  onAddToDownloads(track) {
    const { actions, plugins, settings, t } = this.props;
    const { addToDownloads, info } = actions;

    const clonedTrack = safeAddUuid(track);
    const artistName = _.isString(_.get(track, 'artist'))
      ? _.get(track, 'artist')
      : _.get(track, 'artist.name');
    ipcRenderer.send('start-download', clonedTrack);
    addToDownloads(plugins.plugins.musicSources, clonedTrack);
    info(
      t('download-toast-title'),
      t('download-toast-content', { artist: artistName, title: track.name }),
      <img src={track.thumbnail}/>,
      settings
    );
  }

  renderQueueItems() {
    if (!this.props.items) {
      return null;
    }

    return this.props.items.map((el, i) => {
      return (
        <Draggable key={i} index={i} draggableId={i}>
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
                    loading={el.loading}
                    current={this.props.currentSong === i}
                    defaultMusicSource={this.props.plugins.defaultMusicSource}
                    selectSong={this.props.actions.selectSong}
                    removeFromQueue={this.props.actions.removeFromQueue}
                  />
                }
                track={el}
                musicSources={this.props.plugins.plugins.musicSources}
                defaultMusicSource={this.props.plugins.defaultMusicSource}
                rerollTrack={this.props.actions.rerollTrack}
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
      playlists
    } = this.props;

    let {
      clearQueue,
      addPlaylist,
      updatePlaylist,
      toggleOption,
      addFavoriteTrack,
      success
    } = this.props.actions;

    return (
      <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
        <div className={classnames(styles.play_queue_container, {compact})}>
          <QueueMenu
            clearQueue={clearQueue}
            addPlaylist={addPlaylist}
            updatePlaylist={updatePlaylist} 
            toggleOption={toggleOption}
            addFavoriteTrack={addFavoriteTrack}
            addToDownloads={this.onAddToDownloads.bind(this)}
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
                    {[`${styles.dragged_over}`]: snapshot.isDraggingOver}
                  )
                }
                {...provided.droppableProps}
              >
                {this.renderQueueItems()}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

        </div>
      </DragDropContext>
    );
  }
}

export default PlayQueue;
