import React, { Component } from 'react';
import DebounceInput from 'react-debounce-input';

import CoverPreview from './CoverPreview';
import Player from './Player';
import SearchSidebarContainer from '../containers/SearchSidebarContainer';
import styles from './SidebarMenu.css';

const path = require('path');
const enums = require('../api/Enum');

export default class SidebarMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searching: false
    };
  }

  handleSearch(event, value) {
    console.log(event.target.value);
  }

  renderGoBack() {
    return(
      <div className={styles.sidebar_navbar}>
        <button className={`${styles.sidebar_navbar_btn}`} onClick={this.props.goBackCallback}><i className="fa fa-chevron-left" /> Back</button>
      </div>
    );
  }

  renderDefault() {
    var contents = [];

    contents.push(

      <div style={{flex: '0 0 auto'}}>
        <div className={styles.sidebar_brand_cell}>
          <img src={path.join(__dirname, "../media/nuclear/logo_full_light.png")} height="36"/>
        </div>

        <div className={styles.sidebar_search_cell}>
          <DebounceInput
            className={styles.sidebar_search_field}
            placeholder="Search..."
            minLength={2}
            debounceTimeout={500}
            onChange={this.handleSearch}
            autoFocus
          />
        </div>

        {/* <SearchSidebarContainer /> */}
      </div>
    );

    contents.push(
      <div style={{flex: '1 1 auto', height: '0px', overflowY: 'auto'}}>
        <div className={styles.sidebar_options_container}>
          <table className={styles.sidebar_options}>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleMainContents.bind(null, enums.MainContentItemEnum.DASHBOARD)}><i className="fa fa-dashboard"/> Dashboard</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleMainContents.bind(null, enums.MainContentItemEnum.ALBUMS)}><i className="fa fa-search"/> Find albums</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleMainContents.bind(null, enums.MainContentItemEnum.ARTISTS)}><i className="fa fa-search"/> Find artists</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleMainContents.bind(null, enums.MainContentItemEnum.SEARCH)}><i className="fa fa-search"/> Search</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleSidebarContents.bind(null, enums.SidebarMenuItemEnum.QUEUE)}><i className="fa fa-list"/> Queue</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleSidebarContents.bind(null, enums.SidebarMenuItemEnum.DOWNLOADS)}><i className="fa fa-download"/> Downloads</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleMainContents.bind(null, enums.MainContentItemEnum.PLAYLISTS)}><i className="fa fa-music"/> My Playlists</a>
              </td>
            </tr>
            <tr>
              <td className={styles.sidebar_options_cell}>
                <a href='#' onClick={this.props.toggleMainContents.bind(null, enums.MainContentItemEnum.SETTINGS)}><i className="fa fa-cogs"/> Settings</a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    );

    return contents;
  }

  render() {
    var contents = [];

    if (("menu" in this.props) && this.props.menu!='') {
      contents.push(this.renderGoBack());
      contents.push(this.props.menu);
    } else {
      contents.push(this.renderDefault());
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
      <div className={styles.sidebar}>
        {contents}
      </div>
    );
  }
}
