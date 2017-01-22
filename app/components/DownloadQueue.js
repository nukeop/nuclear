import React, { Component } from 'react';
import styles from './DownloadQueue.css';

const enums = require('../api/Enum');

export default class DownloadQueue extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.download_queue}>
        <table className="table table-hover table-condensed">
          <thead>
            <tr>
              <th>#</th>
              <th>File</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>

            {this.props.downloads.map((song, i)=>{

              var statusIcon = (<td className={styles.download_queued}><i className="fa fa-circle"/></td>);

              switch (song.status){
                case enums.DownloadQueueStatusEnum.INPROGRESS:
                  statusIcon = (<td className={styles.download_inprogress}><i className="fa fa-download"/></td>);
                  break;
                case enums.DownloadQueueStatusEnum.FINISHED:
                  statusIcon = (<td className={styles.download_finished}><i className="fa fa-check"/></td>);
                  break;
                case enums.DownloadQueueStatusEnum.ERROR:
                  statusIcon = (<td className={styles.download_error}><i className="fa fa-times"/></td>);
                  break;
              }

              return (
                <tr>
                  <td>{i+1}</td>
                  <td>{song.data.title}</td>
                  {statusIcon}
                </tr>
            );

            })}

          </tbody>
        </table>
      </div>
    );
  }
}
