import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import CoverPreview from './CoverPreview';
import Player from './Player';
import styles from './SidebarMenu.css';

const path = require('path');

export default class SidebarMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var contents = [];

    if (("menu" in this.props) && this.props.menu!='') {
      contents.push(
        <div className={styles.sidebar_navbar}>
          <button className={`${styles.sidebar_navbar_btn}`} onClick={this.props.goBackCallback}><i className="fa fa-chevron-left" /> Back</button>
        </div>
      );
      contents.push(this.props.menu);
    } else {
      contents.push(
          <table className={`${styles.sidebar_options} table`}>
            <tr>
              <td className={styles.sidebar_brand_cell}>
                <img src={path.join(__dirname, "../media/nuclear/logo_full_light.png")} height="36"/>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleSearch}><i className="fa fa-search"/> Search</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleSearch}><i className="fa fa-search"/> Find albums</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleQueue}><i className="fa fa-list"/> Queue</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleDownloads}><i className="fa fa-download"/> Downloads</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.togglePlaylists}><i className="fa fa-music"/> My Playlists</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleSettings}><i className="fa fa-cogs"/> Settings</a>
              </td>
            </tr>
          </table>
      );
    }

    contents.push(
      <CoverPreview
        songQueue={this.props.songQueue}
        currentSongNumber={this.props.currentSongNumber}
      />
    );

    contents.push(
        <Player
          playStatus={this.props.playStatus}
          togglePlayCallback={this.props.togglePlayCallback}
          nextSongCallback={this.props.nextSongCallback}
          prevSongCallback={this.props.prevSongCallback}
          seekFromCallback={this.props.seekFromCallback}
          songStreamLoading={this.props.songStreamLoading}
          currentSongProgress={this.props.currentSongProgress}
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
