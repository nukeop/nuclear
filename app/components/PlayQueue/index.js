import React from 'react';
import classnames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import styles from './styles.scss';

import QueuePopup from '../QueuePopup';
import QueueItem from './QueueItem';
import QueueMenu from './QueueMenu';

class PlayQueue extends React.Component {
  constructor(props){
    super(props);
  }

  onDragEnd(result) {
    this.props.actions.swapSongs(result.source.index, result.destination.index);
  }

  renderQueueItems() {
    if (!this.props.items) {
      return null;
    }

    return this.props.items.map((el, i) => {
      return (
        <Draggable key={i} index={i} draggableId={i}>
          {(provided, snapshot) => (
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
      settings
    } = this.props;

    let {
      clearQueue,
      addPlaylist,
      toggleOption
    } = this.props.actions;

    return (
      <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
        <div className={classnames(styles.play_queue_container, {'compact': compact})}>
          <QueueMenu
            clearQueue={clearQueue}
            addPlaylist={addPlaylist}
            toggleOption={toggleOption}
            settings={settings}
            items={items}
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
