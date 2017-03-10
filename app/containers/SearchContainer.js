import React, { Component } from 'react';
import SearchField from '../components/SearchField';
import SongList from '../components/SongList';


export default class SearchContainer extends Component {
  render() {
    return (
        <div>
        <SearchField
          handleSearch={this.props.handleSearch}
        />

        {!this.props.songListLoading ?
          (<SongList
            songList={this.props.songList}
            addToQueue={this.props.addToQueue}
            addToDownloads={this.props.addToDownloads}
            searchRelated={this.props.searchRelated}
            playNow={this.props.playNow}
            home={this.props.home}
          />) :
          (<div className="content-loading">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
          </div>)
        }
      </div>
    );
  }
}
