import React, { Component } from 'react';
import Popover from 'react-popover';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import ContentPopover from './ContentPopover';

import styles from './QueueBar.css';

const jsonfile = require('jsonfile');
const path = require('path');
const globals = require('../api/Globals');

const SortableItem = SortableElement(({song, ix, _this, renderPopover, openPopover}) =>
{
  var displayTitle = song.data.title;
  if (song.data.streamUrlLoading) {
    displayTitle=<i className="fa fa-spinner fa-pulse fa-3x fa-fw queue-loading" />;
  }

  var rowClass = ix=== _this.props.currentSong ? styles.current_song : '';

  return (
    renderPopover(
      song,
      (<tr className={rowClass} onContextMenu={openPopover} onDoubleClick={_this.props.changeSong.bind(_this, ix)}>
        <td>{ix+1}</td>
        <td><div className={styles.song_thumbnail_cell} style={{background: 'url(' + song.data.thumbnail + ') center/96px no-repeat'}} /></td>
        <td>{displayTitle}</td>
        <td>{song.data.length}</td>
      </tr>)
    )
  );
}
);

const SortableList = SortableContainer(({songs, _this, renderPopover, openPopover}) => {
	return (
		<tbody>
			{songs.map((song, index) =>
                <SortableItem
                  key={`item-${index}`}
                  index={index}
                  song={song}
                  ix={index}
                  _this={_this}
                  renderPopover={renderPopover}
                  openPopover={openPopover.bind(null, song)}
                />
            )}
		</tbody>
	);
});

export default class QueueBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverOpen: null
    };
  }

  openPopover(track) {
    this.setState({popoverOpen: track});
  }

  closePopover() {
    this.setState({popoverOpen: null});
  }

  exportQueue() {
    var playlist = {
      name: 'playlist' + Date.now(),
      thumbnail: this.props.queue[0].data.thumbnail,
      tracks: []
    };
    this.props.queue.map((song, i)=>{
      var newItem = {
        source: song.source,
        data: {
          id: song.data.id,
          title: song.data.title
        }
      }

      playlist.tracks.push(newItem);
    });

    var filename = playlist.name + '.json';

    jsonfile.writeFile(path.join(
      globals.directories.userdata,
      globals.directories.playlists,
      filename
    ), playlist, (err) => {
      console.error(err);
    });

    this.props.home.showAlertSuccess("Playlist "+filename+" exported.")
  }

  popoverButtons(track) {
    return [
      {
        text: (<span><i className="fa fa-trash-o" /> Remove from queue</span>),
        fun: null
      }
    ];
  }

  renderPopover(track, element) {
    var content = (track.artist != undefined && track.title != undefined)
                  ? (<ContentPopover
                      graphic={track.data.thumbnail}
                      artist={track.artist}
                      title={track.title}
                      buttons={this.popoverButtons()}
                  />)
                  : (<ContentPopover
                      graphic={track.data.thumbnail}
                      title={track.data.title}
                      buttons={this.popoverButtons()}
                  />)

    return (
      <Popover
        body={content}
        preferPlace='right'
        isOpen={this.state.popoverOpen===track}
        onOuterAction={this.closePopover.bind(this)}
      >
          {element}
      </Popover>
    );
  }

  render() {
    var _this = this;

    return (
      <div className={styles.queuebar_container}>
        <a href="#" className={styles.control_button} onClick={this.props.clearQueue}>Clear queue</a>
        <a href="#" className={styles.control_button} onClick={this.exportQueue.bind(this)}>Export queue</a>
        <div className={styles.queuebar_table_container}>
        <table className="table table-hover table-condensed">
          <thead>
            <tr>
              <th>#</th>
              <th><i className="fa fa-camera-retro" /></th>
              <th>Title</th>
              <th>Length</th>
            </tr>
          </thead>

          <SortableList
            songs={this.props.queue}
            _this={_this}
            helperClass={styles.sortable_helper}
            onSortEnd={({oldIndex, newIndex}) => {this.props.changeQueueOrder(oldIndex, newIndex);}}
            pressDelay={200}
            renderPopover={this.renderPopover.bind(this)}
            openPopover={this.openPopover.bind(this)}
          />

        </table>
      </div>
      </div>
    );

  }

}
