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
            <tr>
              <th> </th>
              <th> </th>
              <th>Track</th>
              <th>Listeners</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.topTracks
              .slice(0, 10).map((el, i) => {
                return (
                  <tr className={styles.top_tracks_row}>
                    <td className={styles.top_tracks_thumbnail_cell}>
                      <img className={styles.top_tracks_thumbnail} src={el.image[1]['#text']} />
                    </td>
                    <td>
                      <div className={styles.top_tracks_number}>{i+1}</div>
                    </td>
                    <td>
                      <div className={styles.top_tracks_info}>
                        <div className={styles.top_tracks_name}>{el.name}</div>
                        <div className={styles.top_tracks_artist}>
                          <a
                            href="#"
                            onClick={this.props.switchToArtistView.bind(null, el.artist)}
                          >
                            {el.artist}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.top_tracks_listeners}>{el.listeners}</div>
                    </td>
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
