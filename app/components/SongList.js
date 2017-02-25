import React, { Component } from 'react';
import Popover from 'react-popover';

import ContentPopover from './ContentPopover';

const fs = require('fs');
const https = require('https');
const ytdl = require('ytdl-core');

import styles from './SongList.css';

export default class SongList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popoversOpen: [],
    };
  }

  componentWillMount() {
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  openPopover(i) {
    var popoverList = this.state.popoversOpen;
    popoverList.push(i);
    this.setState({
      popoversOpen: popoverList,
    });
  }

  closePopover(i) {
    var popoverList = this.state.popoversOpen;
    popoverList.splice(popoverList.indexOf(i), 1);
    this.setState({
      popoverOpen: popoverList,
    });
  }

  renderButton(i) {
    return (
      <button className={styles.songlist_details_btn} onClick={this.openPopover.bind(this, i)}><i className="fa fa-ellipsis-h"/></button>
    );
  }

  buttons(song) {
    return [
      {
        text: 'Related',
        fun: this.props.searchRelated.bind(this.props.home, song)
      },
      {
        text: 'Download',
        fun: this.props.addToDownloads.bind(this, song)
      }
    ];
  }

  renderPopover(i, song) {
      return (
        <Popover
          body={
            <ContentPopover
              graphic={song.data.thumbnail}
              title={song.data.title}
              buttons={this.buttons(song)}
            />
          }
          preferPlace='right'
          isOpen={i === this.state.popoversOpen[0]}
          onOuterAction={this.closePopover.bind(this, i)}
          ref='songlist_popover'
        >
          {this.renderButton(i)}
        </Popover>
      );
  }

  renderSongThumbnail(song) {
    if (song.data.thumbnail != null) {
      return(
        <img className={styles.songlist_thumb} src={song.data.thumbnail} />
      );
    } else {
      return(
        <img className={styles.songlist_thumb} src='../media/img/default-album-art.png' />
      )
    }
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
              <th></th>
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
                  <td className={styles.songlist_details_btn_cell}>
                      {_this.renderPopover(i, song)}
                  </td>
                  <td>
                    <div className={styles.songlist_img_container}>
                      {_this.renderSongThumbnail(song)}
                      <div className={styles.songlist_btn_container}>
                        <button className={`${styles.songlist_thumb_btn} ${styles.songlist_thumb_btn_left}`} onClick={_this.props.playNow.bind(_this.props.home, song)}>
                          <i className="fa fa-play"></i>
                        </button>
                        <button className={`${styles.songlist_thumb_btn} ${styles.songlist_thumb_btn_right}`} onClick={_this.props.addToQueue.bind(_this.props.home, song, false)}>
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
