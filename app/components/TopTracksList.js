import React, { Component } from 'react';

import styles from './TopTracksList.css';

export default class TopTracksList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className={styles.top_tracks_list_container}>
        <table>
          <thead>
            <th><i className="fa fa-picture-o" /></th>
            <th>Artist</th>
            <th>Track</th>
            <th>Playcount</th>
          </thead>
          <tbody>
            {
              this.props.topTracks.map((el, i) => {
                return (
                  <tr>
                    <td><img src={el.image[0]['#text']} /></td>
                    <td>{el.artist.name}</td>
                    <td>{el.name}</td>
                    <td>{el.playcount}</td>

                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}
