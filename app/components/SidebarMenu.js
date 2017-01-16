import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import Player from './Player';
import styles from './SidebarMenu.css';

export default class SidebarMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var contents = [];

    if (("menu" in this.props) && this.props.menu!='') {
      contents.push(this.props.menu);
    } else {
      contents.push(
          <table className={`${styles.sidebar_options} table`}>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#'><i className="fa fa-search"/> Search</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleQueue}><i className="fa fa-list"/> Queue</a>
              </td>
            </tr>
          </table>
      );
    }


    contents.push(
        <Player
          playStatus={this.props.playStatus}
          togglePlayCallback={this.props.togglePlayCallback}
          nextSongCallback={this.props.nextSongCallback}
          prevSongCallback={this.props.prevSongCallback}
          songStreamLoading={this.props.songStreamLoading}
        />
    );

    return (
      <div>
        <Sidebar
          sidebar={contents}
          docked={true}
          open={true}
          children=""
          sidebarClassName={styles.sidebar}
        />
      </div>
    );
  }
}
