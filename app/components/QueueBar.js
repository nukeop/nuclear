import React, { Component } from 'react';
import styles from './QueueBar.css';

export default class QueueBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var _this = this;

    return (
      <div className={styles.queuebar_container}>
        <a href="#" className={styles.control_button} onClick={this.props.clearQueue}>Clear queue</a>
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
                displayTitle=<i className="fa fa-spinner fa-spin fa-3x fa-fw queue-loading" />;
              }

              var rowClass = i=== _this.props.currentSong ? styles.current_song : '';

              return (
                  <tr className={rowClass}>
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
