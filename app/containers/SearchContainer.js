import React, { Component } from 'react';
import SearchField from '../components/SearchField';
import SongList from '../components/SongList';


export default class SearchContainer extends Component {
  render() {
    var style={position: 'absolute', width: '100%', height: '100%'};

    return (
        <div style={style}>
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
            <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
          </div>)
        }
      </div>
    );
  }
}
