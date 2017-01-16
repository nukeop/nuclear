import React, { Component } from 'react';

import styles from './SongList.css';

export default class SongList extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    var _this=this;

    if (this.props.songList.length == 0){
      return (
        <div>
          No songs found.
        </div>
      )
    }

    return(
      <div className={styles.songlist_container}>
        <table className={`${styles.songlist_table} table table-striped`}>
          <thead className={styles.songlist_header}>
            <tr>
              <th><i className="fa fa-camera-retro"></i></th>
              <th>Title</th>
              <th>Length</th>
              <th>Source</th>
            </tr>
          </thead>

          <tbody className={styles.songlist_body}>

            {this.props.songList.map(function(song, i){
              return (
                <tr>
                  <td>
                    <div className={styles.songlist_img_container}>
                      <img className={styles.songlist_thumb} src={song.data.thumbnail} />
                      <div className={styles.songlist_btn_container}>
                        <button className={`${styles.songlist_thumb_btn} ${styles.songlist_thumb_btn_left}`} onClick={_this.props.playNow.bind(_this.props.home, song, _this.props.home.videoInfoThenPlayCallback)}>
                          <i className="fa fa-play"></i>
                        </button>
                        <button className={`${styles.songlist_thumb_btn} ${styles.songlist_thumb_btn_right}`} onClick={_this.props.addToQueue.bind(_this.props.home, song, _this.props.home.videoInfoCallback)}>
                            <i className="fa fa-plus-square-o"></i>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>{song.data.title}</td>
                  <td>{song.data.length}</td>
                  <td>{song.source}</td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>
    );
  }
}
