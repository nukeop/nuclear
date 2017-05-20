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

        <div className={styles.artist_view_header}>
          <div className={styles.artist_view_header_img} style={{backgroundImage: 'url('+this.props.artist.image[4]['#text']+')'}} />

          <div className={styles.artist_view_header_overlay}>
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
                  {/* <div className={styles.artist_view_bio}>
                    {this.props.artist.bio.summary.split('<a')[0]}
                  </div> */}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <hr className={styles.artist_view_hr}/>

        <table style={{marginTop: '24px', padding: '12px 12px 12px 12px'}}>
          <tr>
            <td className={styles.artist_view_top_tracks_cell}>
              <div className={styles.artist_view_top_tracks}>
                <div className={styles.artist_view_top_tracks_label}>Popular tracks</div>
                <div className={styles.artist_view_top_tracks_list}>
                  <table style={{width: '100%'}}>
                    <thead>
                      <tr>
                        <th> </th>
                        <th> </th>
                        <th> </th>
                        <th style={{paddingLeft: '12px'}}>Track</th>
                        <th>Playcount</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.props.artistTopTracks.slice(0, 5).map((el, i) => {
                        return (
                          <tr className={styles.artist_view_top_track}>
                            <td><img className={styles.artist_view_top_track_cover} src={el.albumCover} /></td>
                            <td className={styles.artist_view_play_button}>
                              <a href="#" onClick={this.props.playTrack.bind(null, el)}>
                                <i className="fa fa-play" />
                              </a>
                            </td>
                            <td className={styles.artist_view_add_button}>
                              <a href="#" onClick={this.props.addTrackToQueue.bind(null, el)}>
                                <i className="fa fa-plus" />
                              </a>
                            </td>
                            <td className={styles.artist_view_top_track_name}>{el.name}</td>
                            <td>{el.listeners}</td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
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
                    <a href='#' onClick={this.props.switchToArtistView.bind(null, el.name)}>
                      <div className={styles.artist_view_similar_artist}>
                        <img className={styles.artist_view_similar_thumb} src={el.image[0]['#text']} />
                        <div className={styles.artist_view_similar_name}>{el.name}</div>
                      </div>
                    </a>
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
          goToAlbum={this.props.goToAlbum}
          addAlbumToQueue={this.props.addAlbumToQueue}
        />

      </div>
    );
  }
}
