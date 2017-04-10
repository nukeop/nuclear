import React, { Component } from 'react';

import styles from './PitchforkReviewMini.css';

export default class PitchforkReviewMini extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.review_box}>
        <div className={styles.review_container}>

          <table>
            <tbody>
              <tr>
                <td>
                  <div className={styles.review_thumbnail_container}>
                    <img className={styles.review_thumbnail} src={this.props.album.thumbnail} />
                  </div>
                </td>
                <td className={styles.review_album_details_cell}>
                  <div className={styles.review_album_details_container}>
                    <div>{this.props.album.title}</div>
                    <div className={styles.review_artist_name}>by <a href='#' onClick={this.props.switchToArtistView.bind(null, this.props.album.artist)} className={styles.review_artist_name_link}>{this.props.album.artist}</a></div>
                    <div>Genre: {this.props.album.genres.join(', ')}</div>
                  </div>
                  <div className={styles.review_score}>{this.props.album.details.score}</div>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
        <div className={styles.review_abstract_container}>
          <div className={styles.review_abstract}>
            {this.props.album.details.abstract}
          </div>
        </div>
      </div>
    );
  }

}
