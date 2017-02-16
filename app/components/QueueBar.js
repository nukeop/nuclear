import React, { Component } from 'react';
import styles from './QueueBar.css';

const jsonfile = require('jsonfile');
const path = require('path');
const globals = require('../api/Globals');

export default class QueueBar extends Component {
  constructor(props) {
    super(props);
  }

  exportQueue() {
    var allItems = [];
    this.props.queue.map((song, i)=>{
      var newItem = {
        source: song.source,
        data: {
          id: song.data.id,
          title: song.data.title
        }
      }

      allItems.push(newItem);
    });

    var filename = 'playlist' + Date.now() + '.json';

    jsonfile.writeFile(path.join(
      globals.directories.userdata,
      globals.directories.playlists,
      filename
    ), allItems, (err) => {
      console.error(err);
    });

    this.props.home.showAlertSuccess("Playlist "+filename+" exported.")
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
              <th>Title</th>
              <th>Length</th>
            </tr>
          </thead>
          <tbody>

            {this.props.queue.map(function(song, i){
              var displayTitle = song.data.title;
              if (song.data.streamUrlLoading) {
                displayTitle=<i className="fa fa-spinner fa-pulse fa-3x fa-fw queue-loading" />;
              }

              var rowClass = i=== _this.props.currentSong ? styles.current_song : '';

              return (
                  <tr className={rowClass} onDoubleClick={_this.props.changeSong.bind(this, i)}>
                    <td>{i+1}</td>
                    <td>{displayTitle}</td>
                    <td>{song.data.length}</td>
                  </tr>
              );
            })}

          </tbody>
        </table>
      </div>
      </div>
    );

  }

}
