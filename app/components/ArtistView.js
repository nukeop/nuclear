import React, { Component } from 'react';

import styles from './ArtistView.css';

export default class ArtistView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.artist_view_container}>

        <table>
          <tr>
            <td>
              <img className={styles.artist_view_main_photo} src={this.props.artist.image[2]['#text']} />
            </td>
            <td className={styles.artist_view_info_cell}>
              <div className={styles.artist_view_artist_name}>{this.props.artist.name}</div>
              <div className={styles.artist_view_tags}>
                {
                  this.props.artist.tags.tag.map((el, i) => {
                    return (
                      <div className={styles.artist_view_tag}>{'#' + el.name}</div>
                    );
                  })
                }
              </div>
              <div className={styles.artist_view_bio}>
                {this.props.artist.bio.summary.split('<a')[0]}
              </div>
            </td>
          </tr>
        </table>

        <table style={{marginTop: '24px'}}>
          <tr>
            <td><div className={styles.artist_view_top_tracks}></div></td>
            <td className={styles.artist_view_similar_cell}>
              <div className={styles.artist_view_similar_label}>Similar artists:</div>
              {
                this.props.artist.similar.artist.map((el, i) => {
                  return (
                    <div className={styles.artist_view_similar_artist}>
                      <img className={styles.artist_view_similar_thumb} src={el.image[2]['#text']} />
                      <div className={styles.artist_view_similar_name}>{el.name}</div>
                    </div>
                  )
                })
              }
            </td>
          </tr>
        </table>
      </div>
    );
  }
}
