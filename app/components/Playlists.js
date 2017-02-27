import React, { Component } from 'react';
import Popover from 'react-popover';
import styles from './Playlists.css';

import ContentPopover from './ContentPopover';

export default class Playlists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expandedRowKeys: [],
      popoverOpen: null
    };
  }

  buttons(playlist) {
    return [
      {
        text: (<span><i className="fa fa-plus" /> Add to queue</span>),
        fun: this.props.playlistAddToQueueCallback.bind(null, playlist)
      },
      {
        text: 'Rename',
        fun: this.props.playlistRenameCallback.bind(null, playlist)
      },
      {
        text: 'Delete',
        fun: this.props.playlistDeleteCallback.bind(null, playlist)
      }
    ];
  }

  openPopover(playlist) {
    this.setState({popoverOpen: playlist});
  }

  renderPopover(playlist) {
    return (
      <Popover
        body={
          <ContentPopover
            graphic={playlist.contents.thumbnail}
            title={playlist.contents.name}
            buttons = {this.buttons(playlist)}
          />
        }
        preferPlace='below'
        isOpen={this.state.popoverOpen===playlist}
        onOuterAction={this.setState.bind(this, {popoverOpen: null}, null)}
        >
          <a className={styles.playlists_show_more_btn} href='#' onClick={this.openPopover.bind(this, playlist)}><i className="fa fa-ellipsis-h" /></a>
        </Popover>
      )
    }

    renderPlaylistContents(contents) {
      return (
        <ul className={styles.playlists_playlist_contents}>
          {contents.tracks.map((item, i) => {
            return(
              <li>{item.data.title}</li>
            );
          })}
        </ul>
      );
    }

    render() {
      const columns = [
        {title: 'Name', dataIndex: 'filename', key: 'name', width: 100},
      ];

      return(
        <div className={styles.playlists_container}>
          <table style={{width: '100%'}}>

            {
              this.props.playlists.map((el, i) => {
                return (
                  <tr className={styles.playlists_playlist_row}>
                    <td className={styles.playlists_cover_art_cell}><img className={styles.playlists_cover_art} src={el.contents.thumbnail} /></td>
                    <td className={styles.playlists_description_cell}>
                      <div className={styles.playlists_description_name}>{el.contents.name}</div>
                      <div className={styles.playlists_track_list_table_container}>
                        <table>

                          {
                            el.contents.tracks.map((track, ix) => {
                              return (
                                ix < 3
                                ? (
                                  <tr>
                                    <td>
                                      {track.data.title}
                                    </td>
                                  </tr>
                                )
                                : null
                              );
                            })
                          }

                          {
                            el.contents.tracks.length > 3
                            ? <tr><td>({el.contents.tracks.length-3} more)</td></tr>
                            : null
                          }

                        </table>
                      </div>

                      <a className={styles.playlists_play_all_btn} href='#' onClick={this.props.playlistPlayCallback.bind(null, el)}><i className="fa fa-play" /> PLAY</a>
                      {this.renderPopover(el)}

                    </td>
                  </tr>
                );
              })
            }

          </table>
        </div>
      );
    }
  }
