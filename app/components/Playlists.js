import React, { Component } from 'react';
import Table, { ColumnGroup, Column } from 'rc-table';
import styles from './Playlists.css';

export default class Playlists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expandedRowKeys: []
    };
  }

  renderPlaylistContents(contents) {
    return (
      <ul className={styles.playlists_playlist_contents}>
        {contents.map((item, i) => {
          return(
            <li>{item.data.title}</li>
          );
        })}
      </ul>
    );
  }

  renderRenameButton(text, record) {
    return (
      <a
        href='#'
        className={styles.playlists_text_button}
        onClick={this.props.playlistRenameCallback.bind(null, record)}
      >
        Rename
      </a>
    );
  }

  renderDeleteButton(text, record) {
    return (
      <a
        href='#'
        className={styles.playlists_text_button}
        onClick={this.props.playlistDeleteCallback.bind(null, record)}
      >
          Delete
        </a>
    );
  }

  renderPlayButton(text, record) {
    return (
      <a
        href='#'
        className={styles.playlists_play_button}
        onClick={this.props.playlistPlayCallback.bind(null, text)}
      >
        <i className="fa fa-play" />
      </a>
    );
  }

  renderAddToQueueButton(text, record) {
    return (
      <a
        href='#'
        className={styles.playlists_play_button}
        onClick={this.props.playlistAddToQueueCallback.bind(null, text)}
      >
        <i className="fa fa-plus-square-o"></i>
      </a>
    );
  }

  expandedRowRender(record) {
      return this.renderPlaylistContents(record.contents);
    }

  onExpandedRowsChange(rows) {
    this.setState({
      expandedRowKeys: rows,
    });
  }

  onRowDoubleClick(record, index) {
    var keys = this.state.expandedRowKeys;
    if (keys.indexOf(index) > -1) {
      keys.splice(keys.indexOf(index), 1);
    } else {
      keys.push(index);
    }

    this.setState({
      expandedRowKeys: keys
    });
  }

  render() {
    const columns = [
      {title: 'Name', dataIndex: 'filename', key: 'name', width: 100},
    ];

    return(
      <div className={styles.playlists_container}>
        <Table
          data={this.props.playlists}
          expandedRowRender={this.expandedRowRender.bind(this)}
          expandedRowKeys={this.state.expandedRowKeys}
          onExpandedRowsChange={this.onExpandedRowsChange.bind(this)}
          onRowDoubleClick={this.onRowDoubleClick.bind(this)}
        >
            <Column
               dataIndex=''
               key='playButton'
               width={50}
               render={this.renderPlayButton.bind(this)}
            />
            <Column
               dataIndex=''
               key='addToQueueButton'
               width={50}
               render={this.renderAddToQueueButton.bind(this)}
            />
            <Column
              dataIndex='filename'
              key='filename'
            />
            <Column
              dataIndex=''
              key='renameButton'
              width={70}
              render={this.renderRenameButton.bind(this)}
            />
            <Column
              dataIndex=''
              key='deleteButton'
              width={50}
              render={this.renderDeleteButton.bind(this)}
            />
        </Table>
      </div>
    );
  }
}
