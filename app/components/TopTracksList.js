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
              <th></th>
              <th></th>
              <th></th>
              <th style={{textAlign: "left"}}>Track</th>
              <th style={{textAlign: "right"}}>Listeners</th>
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
                    <td className={styles.top_tracks_number_cell}>
                      <span className={styles.top_tracks_play_button}>
                        <a
                          href="#"
                          onClick={this.props.playTrack.bind(null, el)}
                        >
                          <i className="fa fa-play" />
                        </a>
                      </span>
                      <span className={styles.top_tracks_number}>
                        {i+1}
                      </span>
                    </td>
                    <td style={{verticalAlign: "middle"}}>
                      <div className={styles.top_tracks_add_button}>
                        <a
                          href="#"
                          onClick={this.props.addTrackToQueue.bind(null, el)}
                        >
                          <i className="fa fa-plus" />
                        </a>
                      </div>
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
