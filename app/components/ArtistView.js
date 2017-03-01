import React, { Component } from 'react';

import AlbumGrid from './AlbumGrid';

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
              {
                this.props.artist.ontour==='1'
                ? <div className={styles.artist_view_on_tour}>ON TOUR!</div>
                : null
              }
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

        <table style={{marginTop: '24px', padding: '12px 12px 12px 12px'}}>
          <tr>
            <td className={styles.artist_view_top_tracks_cell}>
              <div className={styles.artist_view_top_tracks}>
                <div className={styles.artist_view_top_tracks_label}>Popular tracks</div>
                <div className={styles.artist_view_top_tracks_list}>
                  <table style={{width: '100%'}}>
                    {
                      this.props.artistTopTracks.slice(0, 5).map((el, i) => {
                        return (
                          <tr className={styles.artist_view_top_track}>
                            <td><img className={styles.artist_view_top_track_cover} src={el.albumCover} /></td>
                            <td className={styles.artist_view_top_track_name}>{el.name}</td>
                            <td>{el.listeners}</td>
                          </tr>
                        );
                      })
                    }
                  </table>
                </div>
              </div>
            </td>
            <td style={{width: '100%'}}>

            </td>
            <td className={styles.artist_view_similar_cell}>
              <div className={styles.artist_view_similar_label}>Similar artists</div>
              {
                this.props.artist.similar.artist.map((el, i) => {
                  return (
                    <div className={styles.artist_view_similar_artist}>
                      <img className={styles.artist_view_similar_thumb} src={el.image[0]['#text']} />
                      <div className={styles.artist_view_similar_name}>{el.name}</div>
                    </div>
                  )
                })
              }
            </td>
          </tr>
        </table>

        <div className={styles.artist_view_album_separator_container}>
          ALBUMS
          <hr />
        </div>

        <AlbumGrid
          albums={this.props.artistTopAlbums}
          goToAlbum={() => {return false;}}
          addAlbumToQueue={() => {return false;}}
        />

      </div>
    );
  }
}
