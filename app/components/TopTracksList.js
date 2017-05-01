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
          <tbody>
            {
              this.props.topTracks
              .slice(0, 10).map((el, i) => {
                return (
                  <tr>
                    <td>
                      <div className={styles.top_tracks_list_item}>
                        <div className={styles.top_tracks_number}>{i}</div>
                        <div className={styles.top_tracks_thumbnail}><img src={el.image[1]['#text']} /></div>
                        <div className={styles.top_tracks_info}>
                          <div className={styles.top_tracks_name}>{el.name}</div>
                          <div className={styles.top_tracks_artist}>{el.artist.name}</div>
                        </div>
                      </div>
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
