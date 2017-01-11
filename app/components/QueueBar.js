import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import styles from './QueueBar.css';

export default class QueueBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queuebarOpen: true
    };
  }



  render() {
    const contents = (
      <div>
        <table className="table table-hover table-condensed">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Length</th>
            </tr>
          </thead>
          <tbody>

            {this.props.queue.map(function(song, i){
              return (
                  <tr>
                    <td>{i+1}</td>
                    <td>{song.data.title}</td>
                    <td>{song.data.length}</td>
                  </tr>
              );
            })}

          </tbody>
        </table>
      </div>
    );

    return (
      <div>
        <Sidebar
          sidebar={contents}
          open={this.state.queuebarOpen}
          docked={true}
          children=""
          sidebarClassName={styles.queuebar}
          pullRight={true}
        />
      </div>
    );

  }

}
