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

  renderPlayButton(text, record) {
    return (
      <a href="#" className={styles.playlists_play_button}><i className="fa fa-play" /></a>
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

  onRowClick(record, index) {
    var keys = this.state.expandedRowKeys;
    if (keys.indexOf(index) > -1) {
      keys.splice(keys.indexOf(index), 1);
      this.setState({
        expandedRowKeys: keys
      });
    }
  }

  render() {
    const columns = [
      {title: 'Name', dataIndex: 'filename', key: 'name', width: 100},
    ];

    return(
      <div className={styles.playlists_container}>
        <Table
          data={this.props.playlists}
          expandIconAsCell={true}
          expandRowByClick={true}
          expandedRowRender={this.expandedRowRender.bind(this)}
          expandedRowKeys={this.state.expandedRowKeys}
          onExpandedRowsChange={this.onExpandedRowsChange.bind(this)}
          onRowClick={this.onRowClick.bind(this)}
        >
            <Column
               dataIndex=''
               key='playButton'
               width={50}
               render={this.renderPlayButton}
            />
            <Column
              dataIndex='filename'
              key='filename'
            />
        </Table>
      </div>
    );
  }
}
